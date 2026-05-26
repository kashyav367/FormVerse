import { z } from "zod";

import {
  publicProcedure,
  router,
} from "../../trpc";

import {
  formSubmissionService,
} from "../../services";

export const formSubmissionRouter =
router({

  createSubmission:
    publicProcedure

      .input(
        z.object({

          formId:
            z.string()
              .uuid(),

          responseData:
            z.record(
              z.string(),
              z.string()
            ),

        })
      )

      .mutation(
        async ({ input }) => {

          return await
          formSubmissionService
          .createSubmission(
            input
          );

        }
      ),

  listSubmissions:
publicProcedure

.input(
z.object({

formId:
z.string()
.uuid(),

})
)

.query(
async ({ input }) => {



const data=

await formSubmissionService
.getSubmissions(
input.formId
);



return data;

}
),

});