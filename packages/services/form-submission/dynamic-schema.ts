import { z } from "zod";

export interface FieldConfig {
  id: string;
  label: string;
  labelKey: string;
  type: string;
  options?: string[] | null;
  isRequired: boolean;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: string;
    customErrorMessage?: string;
  } | null;
  conditionalLogic?: {
    targetFieldId: string;
    operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than";
    value: string;
  } | null;
}

export function buildDynamicFormZodSchema(fields: FieldConfig[]) {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    const key = field.labelKey || field.id;
    const rules = field.validationRules || {};
    const options = field.options || [];

    let baseSchema: z.ZodTypeAny;

    switch (field.type.toUpperCase()) {
      case "EMAIL": {
        let emailSchema = z.string();
        if (field.isRequired) {
          emailSchema = emailSchema.min(1, `${field.label} is required`);
        }
        baseSchema = emailSchema.email("Invalid email address format");
        break;
      }

      case "NUMBER": {
        let numSchema = z.union([z.string(), z.number()]).transform((val, ctx) => {
          if (val === "" || val === null || val === undefined) {
            return undefined;
          }
          const parsed = Number(val);
          if (isNaN(parsed)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `${field.label} must be a valid number`,
            });
            return z.NEVER;
          }
          return parsed;
        });

        if (rules.minValue !== undefined && rules.minValue !== null) {
          numSchema = numSchema.pipe(
            z.number().min(rules.minValue, rules.customErrorMessage || `${field.label} must be at least ${rules.minValue}`)
          ) as any;
        }
        if (rules.maxValue !== undefined && rules.maxValue !== null) {
          numSchema = numSchema.pipe(
            z.number().max(rules.maxValue, rules.customErrorMessage || `${field.label} must be at most ${rules.maxValue}`)
          ) as any;
        }
        baseSchema = numSchema;
        break;
      }

      case "SELECT": {
        let selectSchema = z.string();
        if (field.isRequired) {
          selectSchema = selectSchema.min(1, `${field.label} is required`);
        }
        if (options && options.length > 0) {
          selectSchema = selectSchema.refine(
            (val) => options.includes(val),
            rules.customErrorMessage || `Please select a valid option for ${field.label}`
          );
        }
        baseSchema = selectSchema;
        break;
      }

      case "CHECKBOX": {
        let checkboxSchema = z.union([z.array(z.string()), z.string()]).transform((val) => {
          if (Array.isArray(val)) return val;
          if (typeof val === "string" && val.trim()) return [val];
          return [];
        });

        if (field.isRequired) {
          checkboxSchema = checkboxSchema.refine(
            (arr) => arr.length > 0,
            `${field.label} requires at least one selection`
          ) as any;
        }
        baseSchema = checkboxSchema;
        break;
      }

      case "TEXTAREA":
      case "TEXT":
      default: {
        let strSchema = z.string();

        if (rules.minLength !== undefined && rules.minLength !== null) {
          strSchema = strSchema.min(
            rules.minLength,
            rules.customErrorMessage || `${field.label} must be at least ${rules.minLength} characters`
          );
        }

        if (rules.maxLength !== undefined && rules.maxLength !== null) {
          strSchema = strSchema.max(
            rules.maxLength,
            rules.customErrorMessage || `${field.label} must be at most ${rules.maxLength} characters`
          );
        }

        if (rules.pattern) {
          try {
            const regex = new RegExp(rules.pattern);
            strSchema = strSchema.regex(
              regex,
              rules.customErrorMessage || `${field.label} format is invalid`
            );
          } catch (e) {
            // Ignore invalid regex pattern gracefully
          }
        }

        baseSchema = strSchema;
        break;
      }
    }

    if (!field.isRequired) {
      baseSchema = baseSchema.optional().nullable();
    } else {
      if (field.type.toUpperCase() === "TEXT" || field.type.toUpperCase() === "TEXTAREA") {
        baseSchema = (baseSchema as z.ZodString).min(1, `${field.label} is required`);
      }
    }

    schemaShape[key] = baseSchema;
  }

  return z.object(schemaShape);
}
