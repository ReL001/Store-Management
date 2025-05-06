// utils/emailService.js
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";

// Configure Mailtrap transporter
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: parseInt(process.env.MAILTRAP_PORT || "2525"),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

/**
 * Base email sending function
 */
export const sendEmail = async (options) => {
  try {
    await transporter.sendMail({
      from: `"Store Management System" <${process.env.EMAIL_FROM || "no-reply@storemgmt.com"}>`,
      ...options,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new ApiError(500, "Failed to send email");
  }
};

/**
 * Specialized function for quotation requests
 */
export const sendQuotationRequest = async ({ order, user }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const itemsTable = `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
      <thead>
        <tr style="background-color: #f5f5f5;">
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Item</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Description</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Qty</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Unit Price</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.description || "-"}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${formatCurrency(item.unitPrice)}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${formatCurrency(item.quantity * item.unitPrice)}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; color: #333;">
      <div style="background-color: #1976d2; padding: 20px; color: white;">
        <h1 style="margin: 0;">Quotation Request</h1>
        <p style="margin: 5px 0 0; font-size: 14px;">
          Ref: ${order.ginDetails.ginNumber} | ${order.ginDetails.department}
        </p>
      </div>
      
      <div style="padding: 25px;">
        <p>Dear ${order.vendor.name},</p>
        
        <p>We kindly request your quotation for the following items as per our requirements:</p>
        
        ${itemsTable}
        
        <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-left: 4px solid #1976d2;">
          <h3 style="margin-top: 0;">Quotation Requirements</h3>
          <ul style="padding-left: 20px; margin-bottom: 0;">
            <li>Detailed pricing for all items</li>
            <li>Delivery schedule and terms</li>
            <li>Quotation validity period</li>
            <li>GST and other applicable taxes</li>
          </ul>
        </div>
        
        <p><strong>Required by:</strong> 
  ${new Date(
    new Date(order.ginDetails.date).setDate(
      new Date(order.ginDetails.date).getDate() + 7
    )
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}
</p>

        
        <p>Please submit your quotation by replying to this email.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>${user.fullName}</strong><br>
          ${user.department ? `${user.department}<br>` : ""}
          ${user.organization || "Store Manager, KITCOEK, Kolhapur"}
        </p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666;">
        
      </div>
    </div>
  `;

  return sendEmail({
    to: order.vendor.email,
    subject: `Quotation Request - ${order.ginDetails.ginNumber}`,
    html: emailHtml,
  });
};
