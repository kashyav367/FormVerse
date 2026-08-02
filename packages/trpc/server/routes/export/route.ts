import { z } from "zod";
import { authenticatedProcedure, router } from "../../trpc";
import { exportService } from "../../services";

export const exportRouter = router({
  exportSubmissionsCSV: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/export/csv/{formId}",
        tags: ["Export"],
        summary: "Export all form submissions as a formatted CSV string",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        filename: z.string(),
        csvContent: z.string(),
        count: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await exportService.exportSubmissionsToCSV(input.formId);
    }),
});
