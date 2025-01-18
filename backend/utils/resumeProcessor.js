const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');

class ResumeProcessor {
    constructor() {
        this.commonSections = [
            'education',
            'experience',
            'skills',
            'projects',
            'certifications',
            'summary',
            'objective'
        ];
    }

    async extractTextFromPDF(filePath) {
        try {
            const dataBuffer = await fs.readFile(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } catch (error) {
            throw new Error(`Error extracting text from PDF: ${error.message}`);
        }
    }

    async extractTextFromDOCX(filePath) {
        try {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } catch (error) {
            throw new Error(`Error extracting text from DOCX: ${error.message}`);
        }
    }

    async extractText(filePath, fileType) {
        if (fileType === 'pdf') {
            return this.extractTextFromPDF(filePath);
        } else if (fileType === 'docx') {
            return this.extractTextFromDOCX(filePath);
        }
        throw new Error('Unsupported file type');
    }

    identifySkills(text, skillsList) {
        const extractedSkills = [];
        skillsList.forEach(skill => {
            const regex = new RegExp(`\\b${skill}\\b`, 'gi');
            if (regex.test(text)) {
                extractedSkills.push(skill);
            }
        });
        return extractedSkills;
    }

    findMissingKeySkills(extractedSkills, requiredSkills) {
        return requiredSkills.filter(skill => 
            !extractedSkills.some(extracted => 
                extracted.toLowerCase() === skill.toLowerCase()
            )
        );
    }

    analyzeSections(text) {
        const feedback = [];
        
        this.commonSections.forEach(section => {
            const sectionRegex = new RegExp(`\\b${section}\\b`, 'i');
            if (!sectionRegex.test(text)) {
                feedback.push({
                    section,
                    feedback: `Missing ${section} section`,
                    severity: 'high'
                });
            }
        });

        // Check for section content
        const sections = text.split(/\n(?=[A-Z][A-Za-z\s]+:?)/);
        sections.forEach(section => {
            const content = section.trim();
            if (content.length < 50) {
                feedback.push({
                    section: 'Content',
                    feedback: 'Section content appears too brief',
                    severity: 'medium'
                });
            }
        });

        return feedback;
    }

    calculateOverallScore(extractedSkills, missingSkills, formatFeedback) {
        let score = 100;

        // Deduct points for missing skills
        score -= (missingSkills.length * 5);

        // Deduct points for format issues
        formatFeedback.forEach(feedback => {
            switch (feedback.severity) {
                case 'high':
                    score -= 10;
                    break;
                case 'medium':
                    score -= 5;
                    break;
                case 'low':
                    score -= 2;
                    break;
            }
        });

        // Ensure score stays within 0-100
        return Math.max(0, Math.min(100, score));
    }

    async analyzeResume(filePath, fileType, requiredSkills) {
        try {
            // Extract text from resume
            const text = await this.extractText(filePath, fileType);

            // Extract skills
            const extractedSkills = this.identifySkills(text, requiredSkills);

            // Find missing key skills
            const missingKeySkills = this.findMissingKeySkills(extractedSkills, requiredSkills);

            // Analyze resume sections and format
            const formatFeedback = this.analyzeSections(text);

            // Calculate overall score
            const overallScore = this.calculateOverallScore(
                extractedSkills,
                missingKeySkills,
                formatFeedback
            );

            return {
                extractedSkills,
                missingKeySkills,
                recommendedSkills: missingKeySkills,
                formatFeedback,
                overallScore
            };
        } catch (error) {
            throw new Error(`Resume analysis failed: ${error.message}`);
        }
    }
}

module.exports = new ResumeProcessor();
