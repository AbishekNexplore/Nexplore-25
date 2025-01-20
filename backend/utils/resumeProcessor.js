const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs').promises;
const path = require('path');
const huggingfaceService = require('./huggingfaceService');
const personalInfoExtractor = require('./personalInfoExtractor');
const jobMatcher = require('./jobMatcher');

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
        this.actionVerbsList = [
            'achieved', 'improved', 'trained', 'managed', 'created',
            'developed', 'implemented', 'increased', 'decreased', 'resolved',
            'negotiated', 'launched', 'coordinated', 'generated', 'reduced',
            'supervised', 'established', 'expanded', 'directed', 'organized'
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

    async analyzeActionVerbs(text) {
        try {
            // First use basic detection
            const foundVerbs = this.actionVerbsList.filter(verb => {
                const regex = new RegExp(`\\b${verb}\\b`, 'gi');
                return regex.test(text);
            });

            // Then use AI to find additional action verbs
            const aiVerbs = await huggingfaceService.detectActionVerbs(text);
            
            // Combine and remove duplicates
            return [...new Set([...foundVerbs, ...aiVerbs])];
        } catch (error) {
            console.error('Error analyzing action verbs:', error);
            return foundVerbs;
        }
    }

    async analyzeMeasurableAchievements(text) {
        try {
            return await huggingfaceService.detectMeasurableAchievements(text);
        } catch (error) {
            console.error('Error analyzing measurable achievements:', error);
            return [];
        }
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

    calculateSectionScores(extractedSkills, actionVerbs, measurableAchievements, formatFeedback) {
        const scores = {
            formatting: 100,
            content: 100,
            achievements: 100,
            skills: 100
        };

        // Format score
        formatFeedback.forEach(feedback => {
            switch (feedback.severity) {
                case 'high': scores.formatting -= 20; break;
                case 'medium': scores.formatting -= 10; break;
                case 'low': scores.formatting -= 5; break;
            }
        });

        // Skills score
        scores.skills = Math.min(100, extractedSkills.length * 10);

        // Achievements score
        const hasActionVerbs = actionVerbs.length >= 5;
        const hasMeasurableAchievements = measurableAchievements.length >= 3;
        
        if (!hasActionVerbs) scores.achievements -= 50;
        if (!hasMeasurableAchievements) scores.achievements -= 50;

        // Normalize scores
        Object.keys(scores).forEach(key => {
            scores[key] = Math.max(0, Math.min(100, scores[key]));
        });

        return scores;
    }

    calculateOverallScore(sectionScores) {
        const weights = {
            formatting: 0.2,
            content: 0.3,
            achievements: 0.25,
            skills: 0.25
        };

        const weightedScore = Object.entries(sectionScores)
            .reduce((score, [key, value]) => score + (value * weights[key]), 0);

        return Math.round(weightedScore);
    }

    async analyzeResume(filePath, fileType, requiredSkills) {
        try {
            // Extract text from resume
            const text = await this.extractText(filePath, fileType);

            // Extract personal information
            const personalInfo = personalInfoExtractor.extractAll(text);

            // Extract skills
            const extractedSkills = this.identifySkills(text, requiredSkills);
            const missingKeySkills = this.findMissingKeySkills(extractedSkills, requiredSkills);

            // Analyze resume sections and format
            const formatFeedback = this.analyzeSections(text);

            // Analyze action verbs and achievements
            const actionVerbs = await this.analyzeActionVerbs(text);
            const measurableAchievements = await this.analyzeMeasurableAchievements(text);

            // Get AI suggestions
            const aiSuggestions = await huggingfaceService.analyzeText(text);

            // Calculate scores
            const sectionScores = this.calculateSectionScores(
                extractedSkills,
                actionVerbs,
                measurableAchievements,
                formatFeedback
            );

            const overallScore = this.calculateOverallScore(sectionScores);

            return {
                personalInfo,
                extractedSkills,
                missingKeySkills,
                recommendedSkills: missingKeySkills,
                actionVerbs,
                measurableAchievements,
                formatFeedback,
                aiSuggestions,
                sectionScores,
                overallScore
            };
        } catch (error) {
            throw new Error(`Resume analysis failed: ${error.message}`);
        }
    }
}

module.exports = new ResumeProcessor();
