const axios = require('axios');

class Chatbot {
    constructor() {
        this.API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill";
        this.headers = { 
            "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json" 
        };
        
        // Career-related response templates
        this.templates = {
            skills: {
                pattern: /skills? (needed|required) for (.+)/i,
                response: async (role) => {
                    const skills = await this.getSkillsForRole(role);
                    return `For a ${role} position, key skills typically include:\n${skills.join('\n- ')}`;
                }
            },
            salary: {
                pattern: /salary|pay|compensation for (.+)/i,
                response: async (role) => {
                    const salary = await this.getSalaryInfo(role);
                    return `Based on current market data, ${role} positions typically offer:\n${salary}`;
                }
            },
            career_path: {
                pattern: /career path|growth|progression for (.+)/i,
                response: async (role) => {
                    const path = await this.getCareerPath(role);
                    return `A typical career progression for a ${role} might look like:\n${path}`;
                }
            }
        };
    }

    async getSkillsForRole(role) {
        // This would typically query your career dataset
        // For now, returning placeholder data
        return [
            'Technical Skills',
            'Soft Skills',
            'Industry Knowledge'
        ];
    }

    async getSalaryInfo(role) {
        // This would typically query your salary dataset
        // For now, returning placeholder data
        return 'Salary ranges vary by location and experience level';
    }

    async getCareerPath(role) {
        // This would typically query your career progression dataset
        // For now, returning placeholder data
        return 'Entry Level → Mid Level → Senior Level → Lead → Manager';
    }

    async processMessage(message, context) {
        try {
            // Check for career-specific patterns first
            for (const [key, template] of Object.entries(this.templates)) {
                const match = message.match(template.pattern);
                if (match) {
                    return await template.response(match[1]);
                }
            }

            // If no pattern matches, use Hugging Face API
            const response = await axios.post(
                this.API_URL,
                {
                    inputs: {
                        text: message,
                        past_user_inputs: context.pastUserInputs || [],
                        generated_responses: context.generatedResponses || []
                    }
                },
                { headers: this.headers }
            );

            return response.data.generated_text;
        } catch (error) {
            console.error('Error in chatbot processing:', error);
            throw new Error('Failed to process message');
        }
    }

    enhanceResponseWithCareerContext(response, userProfile) {
        // Add career-specific context to generic responses
        if (userProfile.skills && userProfile.skills.length > 0) {
            response += `\n\nBased on your skills (${userProfile.skills.join(', ')}), `;
            response += 'you might want to consider exploring related career paths.';
        }

        if (userProfile.interests && userProfile.interests.length > 0) {
            response += `\n\nGiven your interests in ${userProfile.interests.join(', ')}, `;
            response += 'you might find opportunities in these fields particularly rewarding.';
        }

        return response;
    }

    async generateCareerAdvice(userProfile) {
        // Generate personalized career advice based on user profile
        const advice = [];

        if (userProfile.skills) {
            const matchingCareers = await this.findMatchingCareers(userProfile.skills);
            advice.push({
                type: 'career_matches',
                content: `Based on your skills, you might be well-suited for: ${matchingCareers.join(', ')}`
            });
        }

        if (userProfile.interests) {
            const relevantIndustries = await this.findRelevantIndustries(userProfile.interests);
            advice.push({
                type: 'industry_suggestions',
                content: `Given your interests, consider exploring: ${relevantIndustries.join(', ')}`
            });
        }

        return advice;
    }

    async findMatchingCareers(skills) {
        // This would typically query your career dataset
        // For now, returning placeholder data
        return ['Software Developer', 'Data Scientist', 'Product Manager'];
    }

    async findRelevantIndustries(interests) {
        // This would typically query your industry dataset
        // For now, returning placeholder data
        return ['Technology', 'Finance', 'Healthcare'];
    }
}

module.exports = new Chatbot();
