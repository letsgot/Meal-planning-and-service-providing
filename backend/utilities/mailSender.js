const nodemailer = require("nodemailer");
const secrets = process.env||require("../secrets");
async function mailSender(email,token) {
    // input through which mechanism send your email
    //  -> port, facilitator (technical details) 
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        secure: true,
        auth: {
            user: secrets.APP_EMAIL,
            pass: secrets.APP_PASSWORD
        }
    });
    // let token = "sdmfbdskbdb";
    let dataObj = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: "Forget Password resolving", // Subject line
        html: `<b>OTP with token ${token}?</b>`,
    }
    // send mail with defined transporter object
    let info = await transporter.sendMail(dataObj);
}

module.exports = mailSender;