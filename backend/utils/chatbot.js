const axios = require('axios');

class Chatbot {
    constructor() {
        this.API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
        this.headers = { 
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json" 
        };
    }

    async generateResponse(message) {
        try {
            const response = await axios.post(
                this.API_URL,
                { inputs: message },
                { headers: this.headers }
            );
            
            return response.data.generated_text;
        } catch (error) {
            console.error('Error connecting to Hugging Face API:', error);
            throw new Error('Unable to process the message at the moment.');
        }
    }

    async processMessage(message) {
        try {
            // Add career-specific context to the message
            const contextualizedMessage = `As a career advisor, please answer: ${message}`;
            const response = await this.generateResponse(contextualizedMessage);
            return response;
        } catch (error) {
            console.error('Error processing message:', error);
            throw error;
        }
    }
}

module.exports = new Chatbot();
