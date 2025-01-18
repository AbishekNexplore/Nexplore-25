const mongoose = require('mongoose');

const careerTrendSchema = new mongoose.Schema({
    jobTitle: String,
    count: Number,
    growthRate: Number,
    averageSalary: Number,
    requiredSkills: [{
        skill: String,
        frequency: Number
    }],
    source: {
        type: String,
        enum: ['stackoverflow-2023', 'stackoverflow-2024', 'naukri']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const userAnalyticsSchema = new mongoose.Schema({
    totalUsers: Number,
    activeUsers: Number,
    userSkills: [{
        skill: String,
        count: Number
    }],
    userInterests: [{
        interest: String,
        count: Number
    }],
    popularSearches: [{
        term: String,
        count: Number
    }],
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const analyticsSchema = new mongoose.Schema({
    careerTrends: [careerTrendSchema],
    userAnalytics: [userAnalyticsSchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
