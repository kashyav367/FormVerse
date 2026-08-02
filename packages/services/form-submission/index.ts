import db, { eq, and, sql, desc } from "@repo/database";
import { formSubmissions } from "@repo/database/models/form-submission";
import { formTable } from "@repo/database/models/form";
import { formsFields } from "@repo/database/models/form-field";
import { responseAnswersTable } from "@repo/database/models/response-answer";
import { analyticsEventsTable } from "@repo/database/models/analytics-event";
import { buildDynamicFormZodSchema } from "./dynamic-schema";

export interface CreateSubmissionOptions {
  formId: string;
  responseData: Record<string, any>;
  submitterIpHash?: string;
  completionTimeSeconds?: number;
  honeypotTrap?: string;
}

export interface GetSubmissionsParams {
  formId: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

class FormSubmissionService {
  public async createSubmission(payload: CreateSubmissionOptions) {
    const { formId, responseData, submitterIpHash, completionTimeSeconds, honeypotTrap } = payload;

    // 1. Honeypot Bot Trap Protection
    if (honeypotTrap && honeypotTrap.trim() !== "") {
      throw new Error("Spam submission detected by honeypot filter");
    }

    // 2. Fetch Form metadata & verify status
    const forms = await db.select().from(formTable).where(eq(formTable.id, formId));
    if (!forms || forms.length === 0) {
      throw new Error("Form not found");
    }
    const form = forms[0]!;

    if (!form.isPublished) {
      throw new Error("This form is not published and is not accepting responses.");
    }

    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
      throw new Error(form.closedMessage || "This form has expired.");
    }

    // Check Max Submissions limit
    if (form.maxSubmissions && form.maxSubmissions > 0) {
      const countRes = await db
        .select({ count: sql<number>`count(*)` })
        .from(formSubmissions)
        .where(eq(formSubmissions.formId, formId));

      const count = Number(countRes[0]?.count ?? 0);

      if (count >= form.maxSubmissions) {
        throw new Error(form.closedMessage || "Maximum submission limit reached for this form.");
      }
    }

    // 3. Fetch Form Fields & Build Dynamic Zod Schema Validation
    const fields = await db
      .select()
      .from(formsFields)
      .where(eq(formsFields.formId, formId))
      .orderBy(formsFields.index);

    const dynamicZodSchema = buildDynamicFormZodSchema(
      fields.map((f) => ({
        id: f.id,
        label: f.label,
        labelKey: f.labelKey,
        type: f.type,
        options: f.options ? (typeof f.options === "string" ? JSON.parse(f.options) : f.options) : [],
        isRequired: f.isRequired,
        validationRules: f.validationRules as any,
        conditionalLogic: f.conditionalLogic as any,
      }))
    );

    // Validate payload against dynamic schema
    const validatedData = await dynamicZodSchema.parseAsync(responseData);

    // 4. Save Main Submission Record
    const [result] = await db
      .insert(formSubmissions)
      .values({
        formId,
        responseData: JSON.stringify(validatedData),
        submitterIpHash: submitterIpHash || null,
        completionTimeSeconds: completionTimeSeconds || null,
      })
      .returning({ id: formSubmissions.id });

    if (!result) {
      throw new Error("Submission failed");
    }

    // 5. Populate EAV response_answers table for normalized reporting
    const answerRecords = fields.map((field) => {
      const val = validatedData[field.labelKey || field.id];
      let textVal: string | null = null;
      let numVal: number | null = null;
      let jsonVal: any = null;

      if (val !== undefined && val !== null) {
        if (typeof val === "number") {
          numVal = val;
          textVal = String(val);
        } else if (typeof val === "string") {
          textVal = val;
        } else {
          jsonVal = val;
          textVal = JSON.stringify(val);
        }
      }

      return {
        submissionId: result.id,
        fieldId: field.id,
        fieldKey: field.labelKey || field.id,
        valueText: textVal,
        valueNumber: numVal,
        valueJson: jsonVal,
      };
    });

    if (answerRecords.length > 0) {
      await db.insert(responseAnswersTable).values(answerRecords);
    }

    // 6. Record SUBMIT Analytics Event
    await db.insert(analyticsEventsTable).values({
      formId,
      eventType: "SUBMIT",
      ipHash: submitterIpHash || null,
    });

    return {
      id: result.id,
      submittedAt: new Date(),
    };
  }

  public async getSubmissions(params: GetSubmissionsParams) {
    const { formId, searchQuery, page = 1, limit = 50 } = params;
    const offset = (page - 1) * limit;

    const data = await db
      .select({
        id: formSubmissions.id,
        formId: formSubmissions.formId,
        responseData: formSubmissions.responseData,
        completionTimeSeconds: formSubmissions.completionTimeSeconds,
        submittedAt: formSubmissions.submittedAt,
      })
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId))
      .orderBy(desc(formSubmissions.submittedAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const countRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));

    const totalCount = Number(countRes[0]?.count ?? 0);

    const parsedSubmissions = data.map((item) => {
      let parsed = {};
      try {
        parsed = typeof item.responseData === "string" ? JSON.parse(item.responseData) : item.responseData;
      } catch {
        parsed = {};
      }
      return {
        ...item,
        responseData: parsed,
      };
    });

    let filtered = parsedSubmissions;
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = parsedSubmissions.filter((item) =>
        JSON.stringify(item.responseData).toLowerCase().includes(q)
      );
    }

    return {
      submissions: filtered,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit) || 1,
    };
  }

  public async getSubmissionById(submissionId: string) {
    const [submission] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.id, submissionId));

    if (!submission) {
      throw new Error("Submission not found");
    }

    let parsed = {};
    try {
      parsed = typeof submission.responseData === "string" ? JSON.parse(submission.responseData) : submission.responseData;
    } catch {
      parsed = {};
    }

    const answers = await db
      .select()
      .from(responseAnswersTable)
      .where(eq(responseAnswersTable.submissionId, submissionId));

    return {
      ...submission,
      responseData: parsed,
      answers,
    };
  }

  public async deleteSubmission(submissionId: string) {
    await db.delete(formSubmissions).where(eq(formSubmissions.id, submissionId));
    return { success: true };
  }
}

export default new FormSubmissionService();