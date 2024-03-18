import { object, string, ref } from "yup";

const PASSWORD_REGEX = /^[a-zA-Z0-9]{8,}$/;

const userRegisterValidationSchema = object({
   username: string().required().trim(),
   email: string().email().required(),
   fullName: string().required().trim().min(2).max(50),
   coverImage: string().optional(),
   password: string()
      .matches(
         PASSWORD_REGEX,
         "password must contain only letters and numbers with a minimum of 8 characters"
      )
      .required(),
   confirmPassword: string()
      .oneOf(
         [ref("password"), null],
         "confirmPassword doesn't match the password"
      )
      .required(),
});
const userLoginValidationSchema = object({
   username: string().required().trim(),
   password: string()
      .required()
      .matches(
         PASSWORD_REGEX,
         "password must contain only letters and numbers with a minimum of 8 characters"
      ),
});

const changeUserPasswordValidation = object({
   oldPassword: string()
      .required()
      .matches(
         PASSWORD_REGEX,
         "password must contain only letters and numbers with a minimum of 8 characters"
      ),
   newPassword: string()
      .required()
      .matches(
         PASSWORD_REGEX,
         "password must contain only letters and numbers with a minimum of 8 characters"
      ),
   confirmPassword: string()
      .required()
      .oneOf(
         [ref("newPassword"), null],
         "confirm password must match with new password"
      ),
});
export {
   userRegisterValidationSchema,
   userLoginValidationSchema,
   changeUserPasswordValidation,
};
