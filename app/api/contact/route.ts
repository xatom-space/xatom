import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_TO = 'xatom.space@gmail.com';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const message = String(body?.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const result = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'contact@xatom.space',
      to: CONTACT_TO,
      replyTo: email,
      subject: `[xatom Contact] ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (result.error) {
      console.error('resend send error', result.error);
      return NextResponse.json(
        { error: result.error.message || 'Failed to send message.' },
        { status: 500 }
      );
    }

    console.log('resend send success', result.data);

    return NextResponse.json({
      ok: true,
      id: result.data?.id ?? null,
    });
  } catch (error) {
    console.error('contact send error', error);
    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}
