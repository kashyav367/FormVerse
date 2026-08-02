import db, { eq } from "@repo/database";
import { formTable } from "@repo/database/models/form";
import { formsFields } from "@repo/database/models/form-field";
import { formSubmissions } from "@repo/database/models/form-submission";

class ExportService {
  public async exportSubmissionsToCSV(formId: string) {
    const [form] = await db.select().from(formTable).where(eq(formTable.id, formId));
    if (!form) throw new Error("Form not found");

    const fields = await db
      .select()
      .from(formsFields)
      .where(eq(formsFields.formId, formId))
      .orderBy(formsFields.index);

    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));

    // Headers
    const headers = ["Submission ID", "Submitted At", ...fields.map((f) => `"${f.label.replace(/"/g, '""')}"`)];
    const rows: string[][] = [headers];

    for (const sub of submissions) {
      let data: Record<string, any> = {};
      try {
        data = typeof sub.responseData === "string" ? JSON.parse(sub.responseData) : sub.responseData || {};
      } catch {
        data = {};
      }

      const row = [
        sub.id,
        new Date(sub.submittedAt).toISOString(),
        ...fields.map((field) => {
          const key = field.labelKey || field.id;
          const val = data[key];
          if (val === undefined || val === null) return '""';
          if (Array.isArray(val)) {
            return `"${val.join("; ").replace(/"/g, '""')}"`;
          }
          return `"${String(val).replace(/"/g, '""')}"`;
        }),
      ];
      rows.push(row);
    }

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    return {
      filename: `${form.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_responses.csv`,
      csvContent,
      count: submissions.length,
    };
  }
}

export default new ExportService();
