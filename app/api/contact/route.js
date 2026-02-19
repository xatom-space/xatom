import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const payload = {
      fromName: name,
      fromEmail: email,
      message
    };

    const hasSMTP =
      process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO;

    if (!hasSMTP) {
      console.log('[CONTACT_FALLBACK]', payload);
      return NextResponse.json({ message: 'Saved in server log (SMTP not configured).' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_TO,
      subject: `[xatom.space] Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    });

    return NextResponse.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('[CONTACT_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
