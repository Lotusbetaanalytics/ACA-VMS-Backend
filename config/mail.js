const nodemailer = require("nodemailer");

const sendEmail = async function (options) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: { ciphers: "SSLv3" },
    service: "Outlook365",
    // tls: {
    //   // do not fail on invalid certs
    //   rejectUnauthorized: false,
    // },
  });

  const message = {
    from: `${process.env.FROM_NAME}, <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email,
    cc: options.cc,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  transporter.sendMail(message, (err, info) => {
    if (!err) {
      console.log("message sent " + info.response);
    }
  });
};

module.exports = sendEmail;
