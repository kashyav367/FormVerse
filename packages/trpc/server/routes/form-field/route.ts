import { z } from "zod";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { formFieldService } from "../../services";

export const formFieldRouter = router({
  createField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/form-fields",
        tags: ["Form Fields"],
        summary: "Add a field to a form",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        label: z.string(),
        type: z.string(),
        placeholder: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        options: z.any().optional().nullable(),
        isRequired: z.boolean().optional().default(false),
        validationRules: z.any().optional().nullable(),
        conditionalLogic: z.any().optional().nullable(),
      })
    )
    .output(
      z.object({
        id: z.string(),
        labelKey: z.string(),
        index: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await formFieldService.createField(input);
    }),

  listFields: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/form-fields/{formId}",
        tags: ["Form Fields"],
        summary: "List all fields for a form ordered by index",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
      })
    )
    .output(z.array(z.any()))
    .query(async ({ input }) => {
      return await formFieldService.getFields({ formId: input.formId });
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: "/form-fields/{fieldId}",
        tags: ["Form Fields"],
        summary: "Update field label, options, validation rules, or conditional logic",
      },
    })
    .input(
      z.object({
        fieldId: z.string().uuid(),
        label: z.string().optional(),
        type: z.string().optional(),
        placeholder: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        options: z.any().optional().nullable(),
        isRequired: z.boolean().optional(),
        validationRules: z.any().optional().nullable(),
        conditionalLogic: z.any().optional().nullable(),
      })
    )
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await formFieldService.updateField(input);
    }),

  reorderFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: "/form-fields/reorder",
        tags: ["Form Fields"],
        summary: "Reorder form fields via array of field IDs",
      },
    })
    .input(
      z.object({
        formId: z.string().uuid(),
        fieldOrder: z.array(z.string().uuid()),
      })
    )
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input }) => {
      return await formFieldService.reorderFields(input);
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: "/form-fields/{fieldId}",
        tags: ["Form Fields"],
        summary: "Delete a field from a form",
      },
    })
    .input(
      z.object({
        fieldId: z.string().uuid(),
      })
    )
    .output(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await formFieldService.deleteField({ fieldId: input.fieldId });
    }),
});