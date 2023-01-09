import { z } from "zod";

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 255;

export const EMAIL_MIN_LENGTH = 6;
export const EMAIL_MAX_LENGTH = 255;

export const AGE_MIN = 2;
export const AGE_MAX = 200;

export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 255;

const NAME_LENGTH_ERR_MSG = ` must be between ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters`;
const EMAIL_LENGTH_ERR_MSG = `email must be between ${EMAIL_MIN_LENGTH}-${EMAIL_MAX_LENGTH} characters`;
const AGE_NUMBER_ERR_MSG = `age must be between ${AGE_MIN}-${AGE_MAX}`;
const PASSWORD_LENGTH_ERR_MSG = `password must be between ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters`;

export const userSchema = z.object({
  firstname: z
    .string({
      invalid_type_error: "firstname must be of type string",
      required_error: "firstname is required"
    })
    .min(NAME_MIN_LENGTH, `firstname ${NAME_LENGTH_ERR_MSG}`)
    .max(NAME_MAX_LENGTH, `firstname ${NAME_LENGTH_ERR_MSG}`),
  lastname: z
    .string({
      invalid_type_error: "lastname must be of type string",
      required_error: "lastname is required"
    })
    .min(NAME_MIN_LENGTH, `lastname ${NAME_LENGTH_ERR_MSG}`)
    .max(NAME_MAX_LENGTH, `lastname ${NAME_LENGTH_ERR_MSG}`),
  email: z
    .string({
      invalid_type_error: "email must be of type string",
      required_error: "email is required"
    })
    .email()
    .min(EMAIL_MIN_LENGTH, EMAIL_LENGTH_ERR_MSG)
    .max(EMAIL_MAX_LENGTH, EMAIL_LENGTH_ERR_MSG),
  age: z
    .number({
      invalid_type_error: "age must be of type number",
      required_error: "age is required"
    })
    .min(AGE_MIN, AGE_NUMBER_ERR_MSG)
    .max(AGE_MAX, AGE_NUMBER_ERR_MSG),
  password: z
    .string({
      invalid_type_error: "password must be of type string",
      required_error: "password is required"
    })
    .min(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_ERR_MSG)
    .max(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_ERR_MSG)
});

export function validatePassword(str: string) {
  return (
    stringContainsLowercase(str) &&
    stringContainsUppercase(str) &&
    stringContainsSpecialCharacter(str) &&
    stringContainsNumber(str)
  );
}

function stringContainsUppercase(str: string) {
  return str !== str.toUpperCase();
}
function stringContainsLowercase(str: string) {
  return str !== str.toLocaleLowerCase();
}
function stringContainsNumber(str: string) {
  const format = /\d/;
  return format.test(str);
}
function stringContainsSpecialCharacter(str: string) {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return format.test(str);
}
