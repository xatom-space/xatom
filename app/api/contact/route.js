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
        user: process.env.EMAIL_USER, // 발신용 Gmail 주소
        pass: process.env.EMAIL_PASS, // Gmail App Password(16자리)
      },
    });

    await transporter.sendMail({
      from: `"xatom.space Contact" <${process.env.EMAIL_USER}>`,
      to: 'xatom_space@naver.com', // ✅ 수신: 네이버
      replyTo: email, // ✅ 네이버에서 답장 누르면 고객 이메일로 바로
      subject: `[xatom Contact] ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6;">
          <h2>xatom.space Contact Message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-line;">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return Response.json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Email send error:', error);
    return Response.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}

// 간단 XSS 방지(메일 HTML용)
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}