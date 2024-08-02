class Email {
    constructor(to, subject, message, htmlMessage) {
      this.to = to;
      this.subject = subject;
      this.message = message;
      this.htmlMessage = htmlMessage;
    }
  
    isValid() {
      return this.to && this.subject && (this.message || this.htmlMessage);
    }
  }
  
  module.exports = Email;