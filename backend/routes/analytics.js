const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const analyticsProcessor = require('../utils/analyticsProcessor');

// Get latest analytics (public route for basic trends)
router.get('/trends/public', async (req, res) => {
    try {
        const analytics = await analyticsProcessor.getLatestAnalytics();
        
        // Filter sensitive information for public view
        const publicTrends = analytics.careerTrends.map(trend => ({
            jobTitle: trend.jobTitle,
            growthRate: trend.growthRate,
            requiredSkills: trend.requiredSkills.slice(0, 5) // Only top 5 skills
        }));

        res.json(publicTrends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get detailed analytics (authenticated users)
router.get('/trends/detailed', auth, async (req, res) => {
    try {
        const analytics = await analyticsProcessor.getLatestAnalytics();
        
        // Include salary information and more details for authenticated users
        const detailedTrends = analytics.careerTrends.map(trend => ({
            jobTitle: trend.jobTitle,
            count: trend.count,
            growthRate: trend.growthRate,
            averageSalary: trend.averageSalary,
            requiredSkills: trend.requiredSkills,
            source: trend.source
        }));

        res.json(detailedTrends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user analytics (admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const analytics = await analyticsProcessor.getLatestAnalytics();
        res.json(analytics.userAnalytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Force update analytics (admin only)
router.post('/update', auth, isAdmin, async (req, res) => {
    try {
        const analytics = await analyticsProcessor.updateAnalytics();
        res.json({ message: 'Analytics updated successfully', analytics });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get skill trends
router.get('/skills', auth, async (req, res) => {
    try {
        const analytics = await analyticsProcessor.getLatestAnalytics();
        
        // Aggregate skills across all career trends
        const skillTrends = {};
        analytics.careerTrends.forEach(trend => {
            trend.requiredSkills.forEach(({ skill, frequency }) => {
                if (!skillTrends[skill]) {
                    skillTrends[skill] = {
                        frequency: 0,
                        jobs: new Set()
                    };
                }
                skillTrends[skill].frequency += frequency;
                skillTrends[skill].jobs.add(trend.jobTitle);
            });
        });

        // Convert to array and sort by frequency
        const sortedSkills = Object.entries(skillTrends)
            .map(([skill, data]) => ({
                skill,
                frequency: data.frequency,
                jobCount: data.jobs.size,
                relatedJobs: Array.from(data.jobs).slice(0, 5) // Top 5 related jobs
            }))
            .sort((a, b) => b.frequency - a.frequency);

        res.json(sortedSkills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get industry trends
router.get('/industries', auth, async (req, res) => {
    try {
        const analytics = await analyticsProcessor.getLatestAnalytics();
        
        // Group trends by industry
        const industryTrends = {};
        analytics.careerTrends.forEach(trend => {
            const industry = trend.jobTitle.split(' ')[0]; // Simple industry extraction
            if (!industryTrends[industry]) {
                industryTrends[industry] = {
                    jobCount: 0,
                    averageGrowth: 0,
                    averageSalary: 0,
                    jobs: []
                };
            }
            
            const ind = industryTrends[industry];
            ind.jobCount++;
            ind.averageGrowth += trend.growthRate;
            ind.averageSalary += trend.averageSalary;
            ind.jobs.push(trend.jobTitle);
        });

        // Calculate averages and format response
        const formattedTrends = Object.entries(industryTrends)
            .map(([industry, data]) => ({
                industry,
                jobCount: data.jobCount,
                averageGrowth: data.averageGrowth / data.jobCount,
                averageSalary: data.averageSalary / data.jobCount,
                topJobs: data.jobs.slice(0, 5) // Top 5 jobs in the industry
            }))
            .sort((a, b) => b.jobCount - a.jobCount);

        res.json(formattedTrends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
