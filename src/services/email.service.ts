import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import config from "@app/config/index";
import ErrorService from "./error.service";
import { EmailServiceInterface } from "@app/typings/services";

/**
 *
 * @class EmailService
 * @extends EmailServiceInterface
 * @classdesc Class representing the email service
 * @description Email message notification service class
 * @name EmailService
 * @exports EmailServiceInterface
 */

export default class EmailService extends EmailServiceInterface {
  protected static transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  static init() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if we don't have a real mail account for testing in development
    if (config.NODE_ENV === "test") {
      nodemailer.createTestAccount().then(({ user, pass }) => {
        EmailService.initiateTransporter({
          secure: false,
          auth: { user, pass },
          host: "smtp.ethereal.email",
        });
      });
    }

    if (config.IS_PRODUCTION_OR_STAGING) {
      // Custom mailgun transport for nodemailer
      EmailService.initiateTransporter({
        service: config.EMAIL_SERVICE,
        host: config.EMAIL_HOST,
        secure: false,
        auth: {
          user: config.EMAIL_USERNAME,
          pass: config.EMAIL_PASSWORD,
        },
      });
    }
  }

  /**
   * @async
   * @method initiateTransporter
   * @description Initiate email transporter
   * @param {SMTPTransport.Options | undefined} options - transport configuration
   * @returns {void} void
   * @memberof SmsServiceInterface
   */
  static initiateTransporter(options?: SMTPTransport.Options): void {
    // create reusable transporter object using the default SMTP transport
    if (EmailService.transporter) return;
    EmailService.transporter = nodemailer.createTransport({ port: config.EMAIL_PORT, ...options });
  }

  /**
   * @async
   * @method sendMail
   * @description Send a user email message
   * @param {nodemailer.SendMailOptions} options - message object
   * @returns {Promise<SMTPTransport.SentMessageInfo>} {Promise<SMTPTransport.SentMessageInfo>}
   * @memberof SmsServiceInterface
   */
  public static sendMail = async (
    options: nodemailer.SendMailOptions
  ): Promise<SMTPTransport.SentMessageInfo | ErrorResponseInterface> => {
    try {
      const payload = { ...options, from: `lendsqr ${config.EMAIL_USERNAME}` };
      return EmailService.transporter.sendMail(payload);
    } catch (error: any) {
      return ErrorService.reportError({
        errorData: error,
        status: error.status,
        message: `Failed sending email to ${config.to}`,
        error: `Error sending email on ${config.subject}`,
      });
    }
  };
}
