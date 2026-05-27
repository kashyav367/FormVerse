import { z } from "zod";

import {
  authenticatedProcedure,
  publicProcedure,
  router,
} from "../../trpc";

import {
  createFieldInputModel,
  createFieldOutputModel,
} from "./model";

import {
  formFieldService,
} from "../../services";

export const formFieldRouter =
router({

createField:
  authenticatedProcedure
    .input(
      createFieldInputModel
    )
    .output(
      createFieldOutputModel
    )
    .mutation(
      async ({ input }) => {

        return await
        formFieldService
        .createField({

          ...input,

          isRequired:
            input.isRequired ?? false,

        });

      }
    ),

 listFields:
    publicProcedure
    .input( 
      z.object({

        formId:
          z.string()
            .uuid(),

      })
    )

   .output(
z.array(
z.object({

id:
z.string(),

formId:
z.string(),

label:
z.string(),

labelKey:
z.string(),

type:
z.string(),

index:
z.number(),

placeholder:
z.string()
.nullable()
.optional(),

options:
z.string()
.nullable()
.optional(),

description:
z.string()
.nullable()
.optional(),

isRequired:
z.boolean(),

})
)
)

.query(
async ({ input }) => {

return await
formFieldService
.getFields({

formId:
input.formId,

});

}
),

deleteField:
authenticatedProcedure
.input(
z.object({

fieldId:
z.string()
.uuid(),

})
)

.mutation(
async ({ input }) => {

return await
formFieldService
.deleteField({

fieldId:
input.fieldId,

});

}
),

updateField:
authenticatedProcedure

.input(
z.object({

fieldId:
z.string()
.uuid(),

label:
z.string()
.optional(),

description:
z.string()
.optional(),

options:
z.string()
.optional(),

isRequired:
z.boolean()
.optional(),

})
)

.mutation(
async ({ input }) => {

return await
formFieldService
.updateField({

fieldId:
input.fieldId,

label:
input.label,

description:
input.description,

options:
input.options,

isRequired:
input.isRequired,

});

}
),

});