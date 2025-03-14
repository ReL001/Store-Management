import nodemailer from 'nodemailer';
import { IUser } from '../models/user.model';
import { IProduct } from '../models/product.model';
import { IRequest } from '../models/request.model';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendProductStatusNotification(product: IProduct, user: IUser) {
    const subject = `Product ${product.status.toUpperCase()}: ${product.gin}`;
    const html = `
      <h2>Product Status Update</h2>
      <p>Dear ${user.name},</p>
      <p>Your product with GIN number ${product.gin} has been ${product.status}.</p>
      <h3>Product Details:</h3>
      <ul>
        <li>Department: ${product.department}</li>
        <li>Bill Number: ${product.billNumber}</li>
        <li>Total Amount: ${product.totalAmount}</li>
      </ul>
      <p>Thank you for using our system.</p>
    `;

    await this.sendEmail(user.email, subject, html);
  }

  async sendRequestStatusNotification(request: IRequest, user: IUser) {
    const subject = `Request ${request.status.toUpperCase()}: ${request._id}`;
    const html = `
      <h2>Request Status Update</h2>
      <p>Dear ${user.name},</p>
      <p>Your request has been ${request.status}.</p>
      <h3>Request Details:</h3>
      <ul>
        <li>Department: ${request.department}</li>
        <li>Total Amount: ${request.totalAmount}</li>
      </ul>
      <p>Thank you for using our system.</p>
    `;

    await this.sendEmail(user.email, subject, html);
  }

  async sendNewProductNotification(product: IProduct, hod: IUser) {
    const subject = `New Product Request: ${product.gin}`;
    const html = `
      <h2>New Product Request</h2>
      <p>Dear ${hod.name},</p>
      <p>A new product request has been submitted for your approval.</p>
      <h3>Product Details:</h3>
      <ul>
        <li>GIN: ${product.gin}</li>
        <li>Department: ${product.department}</li>
        <li>Bill Number: ${product.billNumber}</li>
        <li>Total Amount: ${product.totalAmount}</li>
      </ul>
      <p>Please review and take necessary action.</p>
    `;

    await this.sendEmail(hod.email, subject, html);
  }

  async sendNewRequestNotification(request: IRequest, storeManager: IUser) {
    const subject = `New Request: ${request._id}`;
    const html = `
      <h2>New Request</h2>
      <p>Dear ${storeManager.name},</p>
      <p>A new request has been submitted for your approval.</p>
      <h3>Request Details:</h3>
      <ul>
        <li>Department: ${request.department}</li>
        <li>Total Amount: ${request.totalAmount}</li>
      </ul>
      <p>Please review and take necessary action.</p>
    `;

    await this.sendEmail(storeManager.email, subject, html);
  }
}

export const emailService = new EmailService(); 