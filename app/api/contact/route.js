import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return Response.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"xatom.space Contact" <${process.env.EMAIL_USER}>`,
      to: 'xatom_space@naver.com',
      replyTo: email,
      subject: `[xatom Contact] ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
    });

    return Response.json({ message: 'ok' });
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}