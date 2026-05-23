import { z } from "zod";

export const createSubmissionInputModel =
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

export const createSubmissionOutputModel =
z.object({

  id:
    z.string(),

});