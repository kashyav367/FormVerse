import db, {
  eq
} from "@repo/database";

import {
  formSubmissions
} from "@repo/database/models/form-submission";

import {
  createSubmissionInput,
  CreateSubmissionInputType
} from "./model";

class FormSubmissionService {

  public async createSubmission(
    payload: CreateSubmissionInputType
  ) {

    const {
      formId,
      responseData
    } =
    await createSubmissionInput
    .parseAsync(payload);

    const [result] =
    await db
    .insert(
      formSubmissions
    )
    .values({

      formId,

      responseData:
      JSON.stringify(
        responseData
      )

    })
    .returning({

      id:
      formSubmissions.id

    });

    if (!result) {

      throw new Error(
        "Submission failed"
      );

    }

    return {

      id:
      result.id

    };

  }

  public async getSubmissions(
  formId: string
){

  return await db
    .select()
    .from(
      formSubmissions
    )
    .where(
      eq(
        formSubmissions.formId,
        formId
      )
    );

}

}

export default
new FormSubmissionService();