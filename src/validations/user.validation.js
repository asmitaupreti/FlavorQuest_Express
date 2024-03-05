import { object, string, ref } from "yup";

const PASSWORD_REGEX = /^[a-zA-Z0-9]{8,}$/;

const userCreateValidationSchema = object({
   username: string().required().trim(),
   email: string().email().required(),
   fullName: string().required().trim().min(2).max(50),
   avatar: string().required(),
   coverImage: string().optional(),
   password: string().matches(
      PASSWORD_REGEX,
      "password must contain only letters and numbers with a minimum of 8 characters"
   ),
   confirmPassword: string().oneOf(
      [ref("password"), null],
      "confirmPassword doesn't match the password"
   ),
});

export { userCreateValidationSchema };
