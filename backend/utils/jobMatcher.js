const huggingfaceService = require('./huggingfaceService');
const JobRole = require('../models/JobRole');

class JobMatcher {
    constructor() {
        this.similarityThreshold = 0.6; // Minimum similarity score to consider a match
    }

    cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }

    async generateJobRoleEmbedding(role) {
        const roleText = `${role.title} ${role.description} ${role.requiredSkills.join(' ')}`;
        return await huggingfaceService.generateEmbeddings(roleText);
    }

    async generateResumeEmbedding(resume) {
        const resumeText = `
            ${resume.experience.map(exp => 
                `${exp.position} ${exp.company} ${exp.achievements.join(' ')} ${exp.technologies.join(' ')}`
            ).join(' ')}
            ${resume.education.map(edu => 
                `${edu.degree} ${edu.field} ${edu.institution}`
            ).join(' ')}
            ${resume.analysis.extractedSkills.join(' ')}
        `;
        return await huggingfaceService.generateEmbeddings(resumeText);
    }

    findMatchedAndMissingSkills(resumeSkills, roleSkills) {
        const matched = roleSkills.filter(skill => 
            resumeSkills.some(resumeSkill => 
                resumeSkill.toLowerCase() === skill.toLowerCase()
            )
        );
        const missing = roleSkills.filter(skill => 
            !resumeSkills.some(resumeSkill => 
                resumeSkill.toLowerCase() === skill.toLowerCase()
            )
        );
        return { matched, missing };
    }

    async findMatchingRoles(resume, limit = 3) {
        try {
            // Generate embedding for the resume
            const resumeEmbedding = await this.generateResumeEmbedding(resume);

            // Get all job roles
            const jobRoles = await JobRole.find({});
            const matches = [];

            // Calculate similarity scores
            for (const role of jobRoles) {
                if (!role.embedding) {
                    role.embedding = await this.generateJobRoleEmbedding(role);
                    await role.save();
                }

                const similarity = this.cosineSimilarity(resumeEmbedding, role.embedding);
                if (similarity >= this.similarityThreshold) {
                    const { matched, missing } = this.findMatchedAndMissingSkills(
                        resume.analysis.extractedSkills,
                        role.requiredSkills
                    );

                    matches.push({
                        roleId: role._id,
                        matchScore: similarity * 100,
                        matchedSkills: matched,
                        missingSkills: missing
                    });
                }
            }

            // Sort by match score and return top matches
            return matches
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);

        } catch (error) {
            console.error('Error finding matching roles:', error);
            throw error;
        }
    }
}

module.exports = new JobMatcher();
