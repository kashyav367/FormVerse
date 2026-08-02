import { z } from "zod";
import { publicProcedure, authenticatedProcedure, router } from "../../trpc";
import { formSubmissionService } from "../../services";

export const formSubmissionRouter = router({
  createSubmission: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/submissions",
        tags: ["Form Submissions"],
        summary: "Public form submission endpoint with dynamic Zod validation, honeypot filter, and limit enforcement",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        responseData: z.record(z.string(), z.any()),
        submitterIpHash: z.string().optional(),
        completionTimeSeconds: z.number().optional(),
        honeypotTrap: z.string().optional(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        submittedAt: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      return await formSubmissionService.createSubmission(input);
    }),

  listSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/submissions/list/{formId}",
        tags: ["Form Submissions"],
        summary: "List submissions for a form with search query and pagination",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        searchQuery: z.string().optional(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(50),
      })
    )
    .output(
      z.object({
        submissions: z.array(z.any()),
        totalCount: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await formSubmissionService.getSubmissions(input);
    }),

  getSubmissionById: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/submissions/{submissionId}",
        tags: ["Form Submissions"],
        summary: "Get full submission details with normalized EAV answers",
      },
    })
    .input(
      z.object({
        submissionId: z.string().uuid(),
      })
    )
    .output(z.any())
    .query(async ({ input }) => {
      return await formSubmissionService.getSubmissionById(input.submissionId);
    }),

  deleteSubmission: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/submissions/{submissionId}",
        tags: ["Form Submissions"],
        summary: "Delete a form submission by ID",
      },
    })
    .input(
      z.object({
        submissionId: z.string().uuid(),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return await formSubmissionService.deleteSubmission(input.submissionId);
    }),
});
