import { z } from "zod";

export const createSubmissionInput =
z.object({

  formId:
    z.string()
      .uuid(),

  responseData:
    z.record(
      z.string(),
      z.string()
    ),

});

export type CreateSubmissionInputType =
z.infer<
  typeof createSubmissionInput
>;