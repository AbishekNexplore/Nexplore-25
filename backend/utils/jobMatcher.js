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

    async findMatchingRoles(extractedSkills, limit = 5) {
        try {
            // Get all job roles from the database
            const allRoles = await JobRole.find({});
            
            // Calculate match scores for each role
            const matchedRoles = allRoles.map(role => {
                const { matched, missing } = this.findMatchedAndMissingSkills(extractedSkills, role.requiredSkills);
                const matchScore = (matched.length / role.requiredSkills.length) * 100;
                
                return {
                    title: role.title,
                    matchScore,
                    description: role.description,
                    requirements: role.requiredSkills,
                    matchedSkills: matched,
                    missingSkills: missing
                };
            });

            // Sort by match score and return top matches
            return matchedRoles
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, limit);
        } catch (error) {
            console.error('Error finding matching roles:', error);
            return [];
        }
    }

    async ensureDefaultRoles() {
        try {
            const count = await JobRole.countDocuments();
            if (count === 0) {
                const defaultRoles = [
                    {
                        title: 'Full Stack Developer',
                        description: 'Build and maintain web applications using modern technologies',
                        requiredSkills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Git', 'RESTful API']
                    },
                    {
                        title: 'Data Scientist',
                        description: 'Analyze data and build machine learning models',
                        requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'PyTorch', 'Data Analysis']
                    },
                    {
                        title: 'DevOps Engineer',
                        description: 'Manage infrastructure and deployment pipelines',
                        requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Git']
                    },
                    {
                        title: 'Frontend Developer',
                        description: 'Create responsive and user-friendly web interfaces',
                        requiredSkills: ['JavaScript', 'React', 'HTML5', 'CSS3', 'TypeScript', 'Redux']
                    },
                    {
                        title: 'Backend Developer',
                        description: 'Design and implement server-side applications',
                        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'RESTful API', 'SQL', 'Microservices']
                    }
                ];

                await JobRole.insertMany(defaultRoles);
                console.log('Added default job roles');
            }
        } catch (error) {
            console.error('Error ensuring default roles:', error);
        }
    }

    async getRequiredSkills() {
        try {
            // Get all job roles from the database
            const roles = await JobRole.find({}, 'requiredSkills');
            
            // Combine all required skills and remove duplicates
            const allSkills = [...new Set(roles.reduce((acc, role) => 
                [...acc, ...role.requiredSkills], []))];
            
            return allSkills;
        } catch (error) {
            console.error('Error getting required skills:', error);
            return [];
        }
    }

    async getSuggestedRoles(skills) {
        try {
            // Find roles that match the given skills
            const roles = await JobRole.find({
                requiredSkills: { $in: skills }
            }).limit(5);

            // If no exact matches, find roles with similar skills
            if (roles.length === 0) {
                const allRoles = await JobRole.find({}).limit(5);
                return allRoles.map(role => ({
                    title: role.title,
                    matchScore: this.calculateSkillMatchScore(skills, role.requiredSkills)
                })).sort((a, b) => b.matchScore - a.matchScore);
            }

            return roles.map(role => ({
                title: role.title,
                matchScore: this.calculateSkillMatchScore(skills, role.requiredSkills)
            })).sort((a, b) => b.matchScore - a.matchScore);
        } catch (error) {
            console.error('Error getting suggested roles:', error);
            return [];
        }
    }

    calculateSkillMatchScore(candidateSkills, roleSkills) {
        const matchedSkills = roleSkills.filter(skill =>
            candidateSkills.some(candidateSkill =>
                candidateSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );
        return (matchedSkills.length / roleSkills.length) * 100;
    }
}

module.exports = new JobMatcher();
