import { formsFields } from "@repo/database/models/form-field";
import db, {
  eq,
  max,
  asc,
} from "@repo/database";

import {
  createFieldInput,
  CreateFieldInputType,
  deleteFieldInput,
  DeleteFieldInputType,
  updateFieldInput,
  UpdateFieldInputType,
  getFieldInputType,
  GetFieldInputType,
} from "./model";

function toLabelKey(
  label: string
): string {

  return label
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "_"
    )
    .replace(
      /^_|_$/g,
      ""
    );

}

class FormFieldService {

  private async getNextIndex(
    formId: string
  ): Promise<number> {

    const result =
      await db
        .select({
          maxIndex:
            max(
              formsFields.index
            ),
        })
        .from(
          formsFields
        )
        .where(
          eq(
            formsFields.formId,
            formId
          )
        );

    const current =
      result[0]
      ?.maxIndex;

    return current
      ? Number(
          current
        ) + 1
      : 1;

  }

  public async createField(
    payload:
    CreateFieldInputType
  ) {

    const {

      label,
      formId,
      isRequired,
      type,
      placeholder,
      options,
      description,

    } =
      await createFieldInput
      .parseAsync(
        payload
      );

    const labelKey =
      toLabelKey(
        label
      );

    const index =
      await this
      .getNextIndex(
        formId
      );

    const [result] =

      await db
        .insert(
          formsFields
        )

        .values({

          label,

          labelKey,

          type,

          index,

          formId,

          isRequired,

          placeholder:
            placeholder ?? null,

          options:
            options ?? null,

          description:
            description ?? null,

        })

        .returning({

          id:
            formsFields.id,

        });

    if (!result) {

      throw new Error(
        "Failed to create field"
      );

    }

    return {

      id:
        result.id,

      labelKey,

      index,

    };

  }

  public async updateField(
    payload:
    UpdateFieldInputType
  ) {

    const {

      fieldId,
      label,
      type,
      placeholder,
      isRequired,
      options,
      description,

    } =
      await updateFieldInput
      .parseAsync(
        payload
      );

    const [result] =

      await db
        .update(
          formsFields
        )

        .set({

          ...(label && {

            label,

            labelKey:
              toLabelKey(
                label
              ),

          }),

          ...(type && {
            type
          }),

          ...(placeholder !== undefined && {

            placeholder,

          }),

          ...(isRequired !== undefined && {

            isRequired,

          }),

          ...(options !== undefined && {

            options,

          }),

          ...(description !== undefined && {

            description,

          }),

        })

        .where(
          eq(
            formsFields.id,
            fieldId
          )
        )

        .returning({

          id:
            formsFields.id,

        });

    if (!result) {

      throw new Error(
        "Field not found"
      );

    }

    return result;

  }

  public async deleteField(
    payload:
    DeleteFieldInputType
  ) {

    const {

      fieldId,

    } =
      await deleteFieldInput
      .parseAsync(
        payload
      );

    const [result] =

      await db
        .delete(
          formsFields
        )

        .where(
          eq(
            formsFields.id,
            fieldId
          )
        )

        .returning({

          id:
            formsFields.id,

        });

    if (!result) {

      throw new Error(
        `Field with ID ${fieldId} not found`
      );

    }

    return {

      id:
        result.id,

    };

  }

  public async getFields(
    payload:
    GetFieldInputType
  ) {

    const {
      formId,
    } =
      await getFieldInputType
      .parseAsync(
        payload
      );

    return await db
      .select({

        id:
          formsFields.id,

        formId:
          formsFields.formId,

        label:
          formsFields.label,

        labelKey:
          formsFields.labelKey,

        type:
          formsFields.type,

        index:
          formsFields.index,

        placeholder:
          formsFields.placeholder,

        options:
          formsFields.options,

        description:
          formsFields.description,

        isRequired:
          formsFields.isRequired,

      })

      .from(
        formsFields
      )

      .where(
        eq(
          formsFields.formId,
          formId
        )
      )

      .orderBy(
        asc(
          formsFields.index
        )
      );

  }

}

export default new FormFieldService();