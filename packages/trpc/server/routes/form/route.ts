import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { formService } from "../../services";
import z from "zod";

const TAGS = ["Forms"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/createForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        theme: z.string().optional(),
        template: z.string().optional(),
        visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
        category: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .output(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await formService.createForm({
        ...input,
        createdBy: ctx.user.id,
      });
    }),

  listForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/listForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(
      z.object({
        search: z.string().optional(),
        visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
        isPublished: z.boolean().optional(),
      }).optional()
    )
    .output(z.array(z.any()))
    .query(async ({ ctx, input }) => {
      return await formService.listFormByUserId({
        userId: ctx.user.id,
        search: input?.search,
        visibility: input?.visibility,
        isPublished: input?.isPublished,
      });
    }),

  deleteForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/deleteForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await formService.deleteForm({
        formId: input.formId,
      });
    }),

  updateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/updateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        isPublished: z.boolean().optional(),
        visibility: z.enum(["PUBLIC", "UNLISTED"]).optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        theme: z.string().optional(),
        maxSubmissions: z.number().optional().nullable(),
        expiresAt: z.string().optional().nullable(),
        closedMessage: z.string().optional(),
      })
    )
    .output(z.any())
    .mutation(async ({ input }) => {
      return await formService.updateForm(input as any);
    }),

  getForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(z.any())
    .query(async ({ input }) => {
      return await formService.getFormById(input.formId);
    }),

  getPublicForm: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/getPublicForm"),
        tags: TAGS,
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(z.any())
    .query(async ({ input }) => {
      const form = await formService.getFormById(input.formId);
      if (!form.isPublished) {
        throw new Error("This form is currently unpublished and not accepting submissions.");
      }
      return form;
    }),

  listPublicForms: publicProcedure
    .output(z.array(z.any()))
    .query(async () => {
      return await formService.getPublicForms();
    }),

  duplicateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/duplicateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await formService.duplicateForm({
        formId: input.formId,
        createdBy: ctx.user.id,
      });
    }),

  dashboardStats: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/dashboardStats"),
        tags: TAGS,
        protect: true,
      },
    })
    .output(
      z.object({
        totalForms: z.number(),
        publishedForms: z.number(),
        unlistedForms: z.number(),
        totalResponses: z.number(),
      })
    )
    .query(async ({ ctx }) => {
      return await formService.getDashboardStats(ctx.user.id);
    }),
});