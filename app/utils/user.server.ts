import { z } from "zod"

export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 255

export const EMAIL_MIN_LENGTH = 6
export const EMAIL_MAX_LENGTH = 255

export const USERNAME_MIN_LENGTH = 3
export const USERNAME_MAX_LENGTH = 20

export const AGE_MIN = 2
export const AGE_MAX = 200

export const PASSWORD_MIN_LENGTH = 6
export const PASSWORD_MAX_LENGTH = 255

const NAME_LENGTH_ERR_MSG = ` must be between ${NAME_MIN_LENGTH}-${NAME_MAX_LENGTH} characters`
const EMAIL_LENGTH_ERR_MSG = `email must be between ${EMAIL_MIN_LENGTH}-${EMAIL_MAX_LENGTH} characters`
const USERNAME_LENGTH_ERR_MSG = `username must be between ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters`
const PASSWORD_LENGTH_ERR_MSG = `password must be between ${PASSWORD_MIN_LENGTH}-${PASSWORD_MAX_LENGTH} characters`

export const userSchema = z.object({
  username: z
    .string({
      invalid_type_error: "username must be of type string",
      required_error: "username is required",
    })
    .min(USERNAME_MIN_LENGTH, USERNAME_LENGTH_ERR_MSG)
    .max(USERNAME_MAX_LENGTH, USERNAME_LENGTH_ERR_MSG),

  password: z
    .string({
      invalid_type_error: "password must be of type string",
      required_error: "password is required",
    })
    .min(PASSWORD_MIN_LENGTH, PASSWORD_LENGTH_ERR_MSG)
    .max(PASSWORD_MAX_LENGTH, PASSWORD_LENGTH_ERR_MSG),
})

export function validatePassword(str: string) {
  return (
    stringContainsLowercase(str) &&
    stringContainsUppercase(str) &&
    stringContainsSpecialCharacter(str) &&
    stringContainsNumber(str)
  )
}

function stringContainsUppercase(str: string) {
  return str !== str.toUpperCase()
}
function stringContainsLowercase(str: string) {
  return str !== str.toLocaleLowerCase()
}
function stringContainsNumber(str: string) {
  const format = /\d/
  return format.test(str)
}
function stringContainsSpecialCharacter(str: string) {
  const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/
  return format.test(str)
}
