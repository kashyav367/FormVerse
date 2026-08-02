import { formsFields } from "@repo/database/models/form-field";
import db, {
  eq,
  max,
  asc,
} from "@repo/database";

function toLabelKey(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

class FormFieldService {
  private async getNextIndex(formId: string): Promise<number> {
    const result = await db
      .select({
        maxIndex: max(formsFields.index),
      })
      .from(formsFields)
      .where(eq(formsFields.formId, formId));

    const current = result[0]?.maxIndex;
    return current ? Number(current) + 1 : 0;
  }

  public async createField(payload: any) {
    const { label, formId, isRequired, type, placeholder, options, description, validationRules, conditionalLogic } = payload;

    const labelKey = toLabelKey(label);
    const index = await this.getNextIndex(formId);

    const [result] = await db
      .insert(formsFields)
      .values({
        label,
        labelKey,
        type,
        index,
        formId,
        isRequired: !!isRequired,
        placeholder: placeholder ?? null,
        options: options ?? null,
        description: description ?? null,
        validationRules: validationRules ?? null,
        conditionalLogic: conditionalLogic ?? null,
      })
      .returning({ id: formsFields.id });

    if (!result) {
      throw new Error("Failed to create field");
    }

    return {
      id: result.id,
      labelKey,
      index,
    };
  }

  public async updateField(payload: any) {
    const { fieldId, label, type, placeholder, isRequired, options, description, validationRules, conditionalLogic } = payload;

    const [result] = await db
      .update(formsFields)
      .set({
        ...(label && { label, labelKey: toLabelKey(label) }),
        ...(type && { type }),
        ...(placeholder !== undefined && { placeholder }),
        ...(isRequired !== undefined && { isRequired }),
        ...(options !== undefined && { options }),
        ...(description !== undefined && { description }),
        ...(validationRules !== undefined && { validationRules }),
        ...(conditionalLogic !== undefined && { conditionalLogic }),
      })
      .where(eq(formsFields.id, fieldId))
      .returning({ id: formsFields.id });

    if (!result) {
      throw new Error("Field not found");
    }

    return result;
  }

  public async reorderFields(payload: { formId: string; fieldOrder: string[] }) {
    const { formId, fieldOrder } = payload;
    for (let i = 0; i < fieldOrder.length; i++) {
      const fieldId = fieldOrder[i];
      if (fieldId) {
        await db
          .update(formsFields)
          .set({ index: i })
          .where(eq(formsFields.id, fieldId));
      }
    }
    return { success: true };
  }

  public async deleteField(payload: { fieldId: string }) {
    const { fieldId } = payload;
    const [result] = await db
      .delete(formsFields)
      .where(eq(formsFields.id, fieldId))
      .returning({ id: formsFields.id });

    if (!result) {
      throw new Error(`Field with ID ${fieldId} not found`);
    }

    return { id: result.id };
  }

  public async getFields(payload: { formId: string }) {
    const { formId } = payload;
    return await db
      .select()
      .from(formsFields)
      .where(eq(formsFields.formId, formId))
      .orderBy(asc(formsFields.index));
  }
}

export default new FormFieldService();