module.exports = {
  createTransport: jest.fn(() => ({
    sendMail: jest.fn((options) => {
      // Simulation de l'envoi à tous les destinataires
      const recipients = Array.isArray(options.to) ? options.to : [options.to];
      recipients.forEach((recipient) => {
        console.log(`Email envoyé à ${recipient}`);
      });
      return Promise.resolve({ messageId: Math.random().toString(36).substring(7) });
    }),
  })),
};