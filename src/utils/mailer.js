import nodemailer from 'nodemailer'

module.exports = async (req, res) => {
    console.log(req.body.email);
    return new Promise((resolve, reject) => {
        const output = `
    <strong>Thông báo kích hoạt tài khoản</strong>
    <h3>BuzzHome</h3>
    <ul>
      <li>Mã kích hoạt cho email ${req.body.email} là: <strong> ${req.body.code}</strong></li>
    </ul>
    `;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "n17dccn023@student.ptithcm.edu.vn", // generated ethereal user
                pass: "Dung0801", // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'Activation Account', // sender address
            to: req.body.email, // list of receivers
            subject: "Activation Account", // Subject line
            html: output, // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject({ status: false })
            }
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            console.log("Sent!");
            resolve({ status: true })
        });
    })

}

