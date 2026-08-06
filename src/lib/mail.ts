import { Resend } from "resend";

import { env } from "@/lib/env";

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendMail = async ({ to, subject, html, text }: SendMailInput) => {
  if (!env.RESEND_API_KEY) {
    console.info(
      `[mail] RESEND_API_KEY unset — skipping send.\nTo: ${to}\nSubject: ${subject}\n${text ?? html}`,
    );
    return { id: "console-fallback" };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const from = env.EMAIL_FROM ?? "noreply@example.com";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
};

export const sendResetPasswordEmail = async ({
  to,
  name,
  url,
}: {
  to: string;
  name: string;
  url: string;
}) => {
  const subject = "Reset your password";
  const text = `Hi ${name},\n\nReset your password using this link:\n${url}\n\nIf you did not request this, you can ignore this email.`;
  const html = `
    <p>Hi ${name},</p>
    <p>Reset your password using this link:</p>
    <p><a href="${url}">${url}</a></p>
    <p>If you did not request this, you can ignore this email.</p>
  `;

  return sendMail({ to, subject, html, text });
};
