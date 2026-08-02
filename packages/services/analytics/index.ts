import db, { eq, sql, and } from "@repo/database";
import { formTable } from "@repo/database/models/form";
import { formsFields } from "@repo/database/models/form-field";
import { formSubmissions } from "@repo/database/models/form-submission";
import { analyticsEventsTable } from "@repo/database/models/analytics-event";
import { responseAnswersTable } from "@repo/database/models/response-answer";

class AnalyticsService {
  public async trackEvent(formId: string, eventType: "VIEW" | "START" | "SUBMIT", ipHash?: string, userAgent?: string) {
    await db.insert(analyticsEventsTable).values({
      formId,
      eventType,
      ipHash: ipHash || null,
      userAgent: userAgent || null,
    });
    return { success: true };
  }

  public async getOverviewStats(formId: string) {
    const [viewsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEventsTable)
      .where(and(eq(analyticsEventsTable.formId, formId), eq(analyticsEventsTable.eventType, "VIEW")));

    const [startsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(analyticsEventsTable)
      .where(and(eq(analyticsEventsTable.formId, formId), eq(analyticsEventsTable.eventType, "START")));

    const [submissionsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));

    const totalViews = Number(viewsResult?.count || 0);
    const totalStarts = Number(startsResult?.count || 0);
    const totalSubmissions = Number(submissionsResult?.count || 0);

    const conversionRate = totalViews > 0 ? parseFloat(((totalSubmissions / totalViews) * 100).toFixed(1)) : 0;
    const startRate = totalViews > 0 ? parseFloat(((totalStarts / totalViews) * 100).toFixed(1)) : 0;

    // Average completion time
    const [timeResult] = await db
      .select({ avgTime: sql<number>`avg(${formSubmissions.completionTimeSeconds})` })
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));

    const avgCompletionTimeSeconds = Math.round(Number(timeResult?.avgTime || 0));

    return {
      totalViews,
      totalStarts,
      totalSubmissions,
      conversionRate,
      startRate,
      avgCompletionTimeSeconds,
    };
  }

  public async getFieldWiseAnalytics(formId: string) {
    const fields = await db
      .select()
      .from(formsFields)
      .where(eq(formsFields.formId, formId))
      .orderBy(formsFields.index);

    const submissions = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.formId, formId));

    const totalSubmissions = submissions.length;

    const breakdown = fields.map((field) => {
      const key = field.labelKey || field.id;
      const options = (field.options as string[]) || [];

      const optionCounts: Record<string, number> = {};
      let numValues: number[] = [];

      options.forEach((opt) => {
        optionCounts[opt] = 0;
      });

      submissions.forEach((sub) => {
        const val = (sub.responseData as Record<string, any>)?.[key];
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            val.forEach((v) => {
              if (optionCounts[v] !== undefined) optionCounts[v]++;
              else optionCounts[v] = (optionCounts[v] || 0) + 1;
            });
          } else if (typeof val === "string" || typeof val === "number") {
            const strVal = String(val);
            if (optionCounts[strVal] !== undefined) optionCounts[strVal]++;
            else optionCounts[strVal] = (optionCounts[strVal] || 0) + 1;

            if (typeof val === "number" || !isNaN(Number(val))) {
              numValues.push(Number(val));
            }
          }
        }
      });

      let numStats: { min?: number; max?: number; avg?: number } | null = null;
      if (numValues.length > 0) {
        const sum = numValues.reduce((a, b) => a + b, 0);
        numStats = {
          min: Math.min(...numValues),
          max: Math.max(...numValues),
          avg: parseFloat((sum / numValues.length).toFixed(2)),
        };
      }

      return {
        fieldId: field.id,
        label: field.label,
        type: field.type,
        totalResponses: submissions.filter((s) => (s.responseData as Record<string, any>)?.[key] !== undefined).length,
        optionCounts,
        numStats,
      };
    });

    return {
      totalSubmissions,
      fields: breakdown,
    };
  }
}

export default new AnalyticsService();
