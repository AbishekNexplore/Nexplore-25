const fs = require('fs').promises;
const path = require('path');

class DataProcessor {
    constructor() {
        this.datasets = {
            stackoverflow2023: null,
            stackoverflow2024: null,
            naukri: null
        };
    }

    async loadDatasets() {
        try {
            const basePath = path.join(process.cwd(), '..', 'datasets');
            
            // Load all datasets
            const [so2023, so2024, naukri] = await Promise.all([
                fs.readFile(path.join(basePath, 'stackoverflow-2023.json'), 'utf8'),
                fs.readFile(path.join(basePath, 'stackoverflow-2024.json'), 'utf8'),
                fs.readFile(path.join(basePath, 'naukri.json'), 'utf8')
            ]);

            this.datasets.stackoverflow2023 = JSON.parse(so2023);
            this.datasets.stackoverflow2024 = JSON.parse(so2024);
            this.datasets.naukri = JSON.parse(naukri);

            console.log('All datasets loaded successfully');
        } catch (error) {
            console.error('Error loading datasets:', error);
            throw error;
        }
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
            return data.jobs.map(job => {
                const matchScore = this.calculateSkillMatch(userProfile.skills, job.requiredSkills);
                const skillGap = this.identifySkillGaps(userProfile.skills, job.requiredSkills);

                return {
                    jobTitle: job.title,
                    industry: job.industry,
                    matchScore,
                    requiredSkills: job.requiredSkills.map(skill => ({
                        skill,
                        importance: 'must-have'
                    })),
                    skillGap,
                    salaryRange: job.salaryRange,
                    jobGrowth: job.growth,
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
                data.jobs.forEach(job => {
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
                    trends.salaryTrends[job.title].push(job.salaryRange);

                    // Track industry growth
                    if (!trends.industryGrowth[job.industry]) {
                        trends.industryGrowth[job.industry] = [];
                    }
                    trends.industryGrowth[job.industry].push(job.growth);
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
                        acc + ((range.min + range.max) / 2), 0) / ranges.length
                }))
                .sort((a, b) => b.average - a.average),
            industryGrowth: Object.entries(trends.industryGrowth)
                .map(([industry, growths]) => ({
                    industry,
                    averageGrowth: growths.reduce((acc, g) => acc + g.percentage, 0) / growths.length
                }))
                .sort((a, b) => b.averageGrowth - a.averageGrowth)
        };
    }
}

module.exports = new DataProcessor();
