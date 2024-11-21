import nodemailer from 'nodemailer';

// Function to send an email (Fonction pour envoyer un email)
export const sendEmail = async ({ to, subject, text }) => {
    try {
        // Create a transporter with SMTP configuration (Créez un transporteur avec les informations de configuration SMTP)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // SMTP host address (Adresse hôte SMTP)
            port: process.env.SMTP_PORT, // SMTP port (Port SMTP)
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports (true pour 465, false pour les autres ports)
            auth: {
                user: process.env.SMTP_USER, // Email address for sending (Adresse email utilisée pour l'envoi)
                pass: process.env.SMTP_PASS, // Password or App Password for the email (Mot de passe ou App Password de l'email)
            },
        });

        // Send the email (Envoyer l'email)
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER, // Sender address (Adresse de l'expéditeur)
            to, // Recipient (Destinataire)
            subject, // Email subject (Sujet de l'email)
            text, // Text content of the email (Contenu texte de l'email)
        });

        console.log(`Email sent: ${info.messageId}`); // (Email envoyé)
    } catch (error) {
        console.error('Error sending email:', error); // (Erreur lors de l'envoi de l'email)
        throw new Error('Failed to send email.'); // (Échec de l'envoi de l'email)
    }
};
