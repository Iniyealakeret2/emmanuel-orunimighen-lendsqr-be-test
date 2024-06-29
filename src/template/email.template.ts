import { OtpInterface, messageTemplate } from "./email.form.template";

export const signupMessageTemplate = (p: OtpInterface) => {
  return messageTemplate({ ...p, message: "Use the following OTP to verify your account" });
};

export const newOtpMessageTemplate = (p: OtpInterface) => {
  return messageTemplate({ ...p, message: "reset password process " });
};
