import { z } from "zod";
import { publicProcedure, authenticatedProcedure, router } from "../../trpc";
import { analyticsService } from "../../services";

export const analyticsRouter = router({
  trackEvent: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/analytics/track",
        tags: ["Analytics"],
        summary: "Track form analytics event (VIEW, START, SUBMIT)",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        eventType: z.enum(["VIEW", "START", "SUBMIT"]),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return await analyticsService.trackEvent(input.formId, input.eventType);
    }),

  getOverviewStats: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/overview/{formId}",
        tags: ["Analytics"],
        summary: "Get form overview analytics (views, starts, submissions, conversion rate, completion speed)",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        totalViews: z.number(),
        totalStarts: z.number(),
        totalSubmissions: z.number(),
        conversionRate: z.number(),
        startRate: z.number(),
        avgCompletionTimeSeconds: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await analyticsService.getOverviewStats(input.formId);
    }),

  getFieldWiseAnalytics: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/analytics/fields/{formId}",
        tags: ["Analytics"],
        summary: "Get field-wise response distribution and option analytics",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        totalSubmissions: z.number(),
        fields: z.array(z.any()),
      })
    )
    .query(async ({ input }) => {
      return await analyticsService.getFieldWiseAnalytics(input.formId);
    }),
});
