import nodemailer from "nodemailer";

/**
 * @todo encapsulate the sendMail method for error handling
 */
const mailer = nodemailer.createTransport({
	host: "sandbox.smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "2077af6d9ffcf5",
		pass: "e92aa1b5def0aa",
	},
});

export { mailer };
