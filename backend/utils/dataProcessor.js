const fs = require('fs').promises;
const path = require('path');

class DataProcessor {
    constructor() {
        this.datasets = {
            stackoverflow2023: {
                commonSkills: [
                    'JavaScript', 'Python', 'Java', 'SQL', 'HTML/CSS',
                    'Node.js', 'React.js', 'Git', 'AWS', 'Docker',
                    'TypeScript', 'MongoDB', 'Express.js', 'REST APIs'
                ],
                roles: [
                    {
                        title: 'Full Stack Developer',
                        requiredSkills: ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Express.js'],
                        description: 'Develops both client and server-side applications',
                        popularity: 85,
                        averageSalary: '80,000 - 120,000'
                    },
                    {
                        title: 'Frontend Developer',
                        requiredSkills: ['JavaScript', 'React.js', 'HTML/CSS', 'TypeScript'],
                        description: 'Specializes in client-side development',
                        popularity: 80,
                        averageSalary: '70,000 - 110,000'
                    },
                    {
                        title: 'Backend Developer',
                        requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'SQL', 'REST APIs'],
                        description: 'Focuses on server-side logic and database management',
                        popularity: 82,
                        averageSalary: '75,000 - 115,000'
                    },
                    {
                        title: 'DevOps Engineer',
                        requiredSkills: ['Docker', 'AWS', 'Git', 'Python'],
                        description: 'Manages deployment and infrastructure',
                        popularity: 78,
                        averageSalary: '90,000 - 130,000'
                    }
                ]
            },
            stackoverflow2024: {
                commonSkills: [
                    'JavaScript', 'Python', 'TypeScript', 'SQL', 'HTML/CSS',
                    'Node.js', 'React.js', 'Git', 'AWS', 'Docker',
                    'AI/ML', 'MongoDB', 'Express.js', 'REST APIs'
                ],
                roles: [
                    {
                        title: 'AI/ML Engineer',
                        requiredSkills: ['Python', 'AI/ML', 'SQL', 'AWS'],
                        description: 'Develops machine learning models and AI solutions',
                        popularity: 90,
                        averageSalary: '100,000 - 150,000'
                    },
                    {
                        title: 'Cloud Solutions Architect',
                        requiredSkills: ['AWS', 'Docker', 'Python', 'REST APIs'],
                        description: 'Designs and implements cloud infrastructure',
                        popularity: 88,
                        averageSalary: '110,000 - 160,000'
                    },
                    {
                        title: 'Full Stack JavaScript Developer',
                        requiredSkills: ['JavaScript', 'TypeScript', 'React.js', 'Node.js', 'MongoDB'],
                        description: 'Develops modern web applications using JavaScript ecosystem',
                        popularity: 86,
                        averageSalary: '85,000 - 130,000'
                    }
                ]
            },
            naukri: {
                commonSkills: [
                    'JavaScript', 'Python', 'Java', 'SQL', 'HTML/CSS',
                    'Node.js', 'React.js', 'Git', 'Cloud Computing',
                    'TypeScript', 'NoSQL', 'Express.js', 'REST APIs'
                ],
                roles: [
                    {
                        title: 'Software Development Engineer',
                        requiredSkills: ['Java', 'Python', 'SQL', 'Git'],
                        description: 'Develops and maintains software applications',
                        popularity: 92,
                        averageSalary: '70,000 - 120,000'
                    },
                    {
                        title: 'MERN Stack Developer',
                        requiredSkills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
                        description: 'Specializes in MERN stack development',
                        popularity: 84,
                        averageSalary: '60,000 - 100,000'
                    },
                    {
                        title: 'Cloud Developer',
                        requiredSkills: ['Cloud Computing', 'JavaScript', 'Python', 'REST APIs'],
                        description: 'Develops cloud-based applications',
                        popularity: 86,
                        averageSalary: '80,000 - 130,000'
                    }
                ]
            }
        };
    }

    async loadDatasets() {
        try {
            console.log('Using built-in datasets');
            // Datasets are already loaded in constructor
            return true;
        } catch (error) {
            console.error('Error with datasets:', error);
            return false;
        }
    }

    async getCommonSkills() {
        // Combine and deduplicate skills from all datasets
        const allSkills = new Set([
            ...this.datasets.stackoverflow2023.commonSkills,
            ...this.datasets.stackoverflow2024.commonSkills,
            ...this.datasets.naukri.commonSkills
        ]);
        return Array.from(allSkills);
    }

    async getAllRoles() {
        // Combine roles from all datasets
        return [
            ...this.datasets.stackoverflow2023.roles,
            ...this.datasets.stackoverflow2024.roles,
            ...this.datasets.naukri.roles
        ];
    }

    calculateSkillMatch(userSkills, jobSkills) {
        const matchedSkills = userSkills.filter(skill => 
            jobSkills.some(jobSkill => 
                jobSkill.toLowerCase().includes(skill.toLowerCase())
            )
        );
        return (matchedSkills.length / jobSkills.length) * 100;
    }

    identifySkillGaps(userSkills, requiredSkills) {
        return requiredSkills.map(skill => ({
            skill,
            status: userSkills.some(userSkill => 
                userSkill.toLowerCase().includes(skill.toLowerCase())
            ) ? 'complete' : 'missing'
        }));
    }

    async generateRecommendations(userProfile) {
        const recommendations = [];
        const processDataset = (data, source) => {
            // Process each job in the dataset
            return data.roles.map(job => {
                const matchScore = this.calculateSkillMatch(userProfile.skills, job.requiredSkills);
                const skillGap = this.identifySkillGaps(userProfile.skills, job.requiredSkills);

                return {
                    jobTitle: job.title,
                    industry: job.description,
                    matchScore,
                    requiredSkills: job.requiredSkills.map(skill => ({
                        skill,
                        importance: 'must-have'
                    })),
                    skillGap,
                    salaryRange: job.averageSalary,
                    jobGrowth: job.popularity,
                    source
                };
            });
        };

        // Process all datasets
        Object.entries(this.datasets).forEach(([source, data]) => {
            if (data) {
                const datasetRecommendations = processDataset(data, source);
                recommendations.push(...datasetRecommendations);
            }
        });

        // Sort by match score and return top recommendations
        return recommendations
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
    }

    async getCareerTrends() {
        const trends = {
            topJobs: {},
            skillDemand: {},
            salaryTrends: {},
            industryGrowth: {}
        };

        // Process each dataset for trends
        Object.entries(this.datasets).forEach(([source, data]) => {
            if (data) {
                // Aggregate job titles
                data.roles.forEach(job => {
                    // Count job titles
                    trends.topJobs[job.title] = (trends.topJobs[job.title] || 0) + 1;

                    // Aggregate skills
                    job.requiredSkills.forEach(skill => {
                        trends.skillDemand[skill] = (trends.skillDemand[skill] || 0) + 1;
                    });

                    // Track salary ranges
                    if (!trends.salaryTrends[job.title]) {
                        trends.salaryTrends[job.title] = [];
                    }
                    trends.salaryTrends[job.title].push(job.averageSalary);

                    // Track industry growth
                    if (!trends.industryGrowth[job.description]) {
                        trends.industryGrowth[job.description] = [];
                    }
                    trends.industryGrowth[job.description].push(job.popularity);
                });
            }
        });

        // Process and sort the trends
        return {
            topJobs: Object.entries(trends.topJobs)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10),
            topSkills: Object.entries(trends.skillDemand)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 20),
            salaryTrends: Object.entries(trends.salaryTrends)
                .map(([job, ranges]) => ({
                    job,
                    average: ranges.reduce((acc, range) => 
                        acc + ((range.split('-')[0].replace(',', '') + range.split('-')[1].replace(',', '')) / 2), 0) / ranges.length
                }))
                .sort((a, b) => b.average - a.average),
            industryGrowth: Object.entries(trends.industryGrowth)
                .map(([industry, growths]) => ({
                    industry,
                    averageGrowth: growths.reduce((acc, g) => acc + g, 0) / growths.length
                }))
                .sort((a, b) => b.averageGrowth - a.averageGrowth)
        };
    }
}

module.exports = new DataProcessor();
