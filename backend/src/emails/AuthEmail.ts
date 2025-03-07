import { transport } from "../config/nodemailer";

type EmailType = {
  name: string;
  email: string;
  token: string;
};

export class AuthEmail {
  static sendConfirmationEmail = async (user: EmailType) => {
    try {
      const email = await transport.sendMail({
        from: "Magic Elves <from@example.com>",
        to: user.email,
        subject: "Confirm your email",
        html: `
            <h1>Email Confirmation</h1>
            <p>Hola ${user.name} has creado tu cuenta de cashAdmin</p>
            <a href="#">Confirmar cuenta</a>
            <p>e ingresa el siguiente token: ${user.token}</p>
        `,
      });
      console.log("Message sent: %s", email);
    } catch (error) {
      console.error("ERROR", error);
      throw error;
    }
  };
}
