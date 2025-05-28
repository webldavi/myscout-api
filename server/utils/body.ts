import { readBody } from "h3";

type FieldRule = {
  type: "string" | "number" | "boolean";
  required?: boolean;
  validator?: (value: any) => boolean;
};

type Schema = {
  [key: string]: FieldRule;
};

export const parseAndValidateBody = async <T = any>(event: any, schema: Schema): Promise<T> => {
  const body = await readBody(event);
  const errors: string[] = [];

  for (const key in schema) {
    const rule = schema[key];
    const value = body[key];

    if (rule.required && value === undefined) {
      errors.push(`Campo '${key}' é obrigatório`);
      continue;
    }

    if (value !== undefined && typeof value !== rule.type) {
      errors.push(`Campo '${key}' deve ser do tipo ${rule.type}`);
      continue;
    }

    if (value !== undefined && rule.validator && !rule.validator(value)) {
      errors.push(`Campo '${key}' é inválido`);
    }
  }

  if (errors.length) {
    throw createError({
      statusCode: 422,
      statusMessage: "Erro de validação",
      data: errors,
    });
  }

  return body as T;
};
