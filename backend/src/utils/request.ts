import { HttpError } from "./errors";

export const getParamString = (
  value: string | string[] | undefined,
  field = "id",
) => {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) {
    return value[0];
  }

  throw new HttpError(400, `Invalid parameter: ${field}`);
};
