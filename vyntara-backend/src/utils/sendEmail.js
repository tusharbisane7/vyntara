// utils/sendEmail.js

import nodemailer from 'nodemailer';

const port = Number(process.env.SMTP_PORT || 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

export async function sendSubmissionConfirmation({
  to,
  name,
  kind,
  reference,
  position
}) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error('SMTP configuration is incomplete.');
  }

  if (!to) {
    throw new Error('Recipient email is required.');
  }

  const safeName = escapeHtml(name || 'there');
  const isApplication = kind === 'application';

  const subject = isApplication
    ? 'Application Received | Vyntara Technologies'
    : 'We Have Received Your Enquiry | Vyntara Technologies';

  const detailHtml = isApplication
    ? `
      <p><strong>Position:</strong>
        ${escapeHtml(position || 'The position you applied for')}
      </p>
      <p><strong>Application number:</strong>
        ${escapeHtml(reference || 'Not available')}
      </p>
    `
    : `
      <p>Our team will review your requirements and contact you
      if we need additional information or wish to proceed further.</p>
    `;

  const detailText = isApplication
    ? `Position: ${position || 'The position you applied for'}
Application number: ${reference || 'Not available'}`
    : 'Our team will review your requirements and contact you if we need additional information or wish to proceed further.';

  const text = `
Hello ${name || 'there'},

Thank you for your ${isApplication ? 'application' : 'enquiry'} to Vyntara Technologies.

We have successfully received your submission.

${detailText}

We will contact you if your ${isApplication ? 'application' : 'enquiry'} is shortlisted or if we wish to proceed further with you.

Please note that submission does not guarantee shortlisting or further consideration.

This is an automated email. Please do not reply to this email, as this inbox is not monitored for responses.

Thank you for your patience and understanding.

Best regards,
Vyntara Technologies
support@vyntara.tech
https://www.vyntaralabs.tech
  `.trim();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#222;line-height:1.6">
      <h2 style="color:#243b53">Vyntara Technologies</h2>

      <p>Hello ${safeName},</p>

      <p>
        Thank you for your
        ${isApplication ? 'application' : 'enquiry'}
        to Vyntara Technologies.
      </p>

      <p><strong>We have successfully received your submission.</strong></p>

      ${detailHtml}

      <p>
        We will contact you if your
        ${isApplication ? 'application' : 'enquiry'}
        is shortlisted or if we wish to proceed further with you.
      </p>

      <p>
        Please note that submission does not guarantee shortlisting
        or further consideration.
      </p>

      <p style="padding:12px;background:#f4f6f8;border-radius:6px">
        <strong>
          This is an automated email. Please do not reply to this email,
          as this inbox is not monitored for responses.
        </strong>
      </p>

      <p>Thank you for your patience and understanding.</p>

      <p>
        Best regards,<br>
        <strong>Vyntara Technologies</strong><br>
        <a href="mailto:support@vyntara.tech">support@vyntara.tech</a><br>
        <a href="https://www.vyntaralabs.tech">www.vyntaralabs.tech</a>
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: `"Vyntara Technologies" <${process.env.SMTP_FROM || 'support@vyntara.tech'}>`,
    to,
    subject,
    text,
    html
  });
}