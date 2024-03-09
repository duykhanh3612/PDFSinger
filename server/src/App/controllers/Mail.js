var nodemailer = require("nodemailer");

class Mail {
  // Hàm để gửi email
  sendMail(req, res) {
    // Logic gửi email ở đây
    // Sử dụng nodemailer để tạo và gửi email

    // Ví dụ:
    const transporter = nodemailer.createTransport({
      // Cấu hình transporter (chẳng hạn như SMTP, OAuth2, ...)
    });

    const mailOptions = {
      from: 'your-email@example.com',
      to: 'recipient@example.com',
      subject: 'Subject of your email',
      text: 'Body of your email',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
      }
    });
  }
}

module.exports = new Mail();
