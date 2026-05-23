import db, { eq } from "@repo/database";
import { formTable } from "@repo/database/models/form";

import {
  createFormInput,
  CreatorFormInputType,
  listFormByUserIdInput,
  ListFormsByUserIdInputType,
} from "./model";

class FormService {

  public async createForm(
    payload: CreatorFormInputType
  ){

    const {
      title,
      description,
      createdBy,
    } =
    await createFormInput.parseAsync(
      payload
    );

    const [result] =

    await db
    .insert(
      formTable
    )

    .values({

      title,

      description,

      createdBy,

      isPublished:false,

      visibility:"UNLISTED",

    })

    .returning({

      id:
      formTable.id,

    });

    if(!result){

      throw new Error(

        "Something went wrong while creating form"

      );

    }

    return {

      id:
      result.id,

    };

  }

  public async listFormByUserId(
    payload: ListFormsByUserIdInputType
  ){

    const {
      userId
    } =
    await listFormByUserIdInput.parseAsync(
      payload
    );

    return await db

    .select({

      id:
      formTable.id,

      title:
      formTable.title,

      description:
      formTable.description,

      createdAt:
      formTable.createdAt,

      updatedAt:
      formTable.updatedAt,

      isPublished:
      formTable.isPublished,

      visibility:
      formTable.visibility,

    })

    .from(
      formTable
    )

    .where(

      eq(
        formTable.createdBy,
        userId
      )

    );

  }

  public async deleteForm(
    {
      formId
    }:
    {
      formId:string
    }
  ){

    const [result] =

    await db

    .delete(
      formTable
    )

    .where(

      eq(
        formTable.id,
        formId
      )

    )

    .returning({

      id:
      formTable.id,

    });

    if(!result){

      throw new Error(
        "Form not found"
      );

    }

    return result;

  }

  public async updateForm(
    payload:{
      formId:string;

      isPublished?:boolean;

      visibility?:
      "PUBLIC"|
      "UNLISTED";
    }
  ){

    const [result] =

    await db

    .update(
      formTable
    )

    .set({

      ...(payload.isPublished!==undefined && {

        isPublished:
        payload.isPublished

      }),

      ...(payload.visibility && {

        visibility:
        payload.visibility

      }),

    })

    .where(

      eq(
        formTable.id,
        payload.formId
      )

    )

    .returning({

      id:
      formTable.id,

      isPublished:
      formTable.isPublished,

      visibility:
      formTable.visibility,

    });

    if(!result){

      throw new Error(
        "Form not found"
      );

    }

    return result;

  }

  public async getFormById(
formId:string
){

const [form]=

await db
.select()

.from(
formTable
)

.where(
eq(
formTable.id,
formId
)
);

if(!form){

throw new Error(
"Form not found"
);

}

return form;

}

public async getPublicForms(){

return await db

.select({

id:
formTable.id,

title:
formTable.title,

description:
formTable.description

})

.from(
formTable
)

.where(

eq(
formTable.visibility,
"PUBLIC"
)

);

}

}



export default new FormService();