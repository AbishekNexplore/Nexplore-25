const { HfInference } = require('@huggingface/inference');
const dotenv = require('dotenv');
dotenv.config();

class HuggingFaceService {
    constructor() {
        const apiKey = process.env.HUGGINGFACE_API_KEY;
        if (!apiKey) {
            console.error('HUGGINGFACE_API_KEY is not set in environment variables');
            throw new Error('HUGGINGFACE_API_KEY is required');
        }
        this.hf = new HfInference(apiKey);
        this.textGenerationModel = "google/flan-t5-base";
        this.embeddingModel = "sentence-transformers/all-MiniLM-L6-v2";
    }

    async generateEmbeddings(text) {
        try {
            const response = await this.hf.featureExtraction({
                model: this.embeddingModel,
                inputs: text,
            });
            return response;
        } catch (error) {
            console.error('Error generating embeddings:', error);
            throw error;
        }
    }

    async analyzeText(text) {
        try {
            const prompt = `Analyze this resume text and provide specific suggestions for improvement, focusing on action verbs and measurable achievements:\n\n${text}`;
            const response = await this.hf.textGeneration({
                model: this.textGenerationModel,
                inputs: prompt,
                parameters: {
                    max_length: 200,
                    temperature: 0.7,
                }
            });
            return response[0].generated_text;
        } catch (error) {
            console.error('Error analyzing text:', error);
            throw error;
        }
    }

    async detectActionVerbs(text) {
        try {
            const prompt = `Extract all action verbs from this text and list them:\n\n${text}`;
            const response = await this.hf.textGeneration({
                model: this.textGenerationModel,
                inputs: prompt,
                parameters: {
                    max_length: 100,
                    temperature: 0.3,
                }
            });
            return response[0].generated_text.split(',').map(verb => verb.trim());
        } catch (error) {
            console.error('Error detecting action verbs:', error);
            throw error;
        }
    }

    async detectMeasurableAchievements(text) {
        try {
            const prompt = `Find measurable achievements (numbers, percentages, metrics) from this text:\n\n${text}`;
            const response = await this.hf.textGeneration({
                model: this.textGenerationModel,
                inputs: prompt,
                parameters: {
                    max_length: 150,
                    temperature: 0.3,
                }
            });
            return response[0].generated_text;
        } catch (error) {
            console.error('Error detecting measurable achievements:', error);
            throw error;
        }
    }
}

module.exports = new HuggingFaceService();
