// src/services/emailService.js
const postmark = require("postmark");
const AppError = require("../utils/AppError");
require("dotenv").config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);


/**
 * sendEmail({ to, subject, html })
 * Returns a Promise
 */
module.exports.sendEmail = async function ({ to, subject, html }) {
  try {
    const result = await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL, // Must be verified in Postmark
      To: to,
      Subject: subject,
      HtmlBody: html,
    });
    return result;
  } catch (err) {
    console.error("Postmark sendEmail error:", err);
    // throw new AppError("Failed to send email.", 500);
  }
};
