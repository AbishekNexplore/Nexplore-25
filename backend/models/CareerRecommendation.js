const mongoose = require('mongoose');

const careerRecommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    requiredSkills: [{
        skill: String,
        importance: {
            type: String,
            enum: ['must-have', 'nice-to-have'],
            default: 'must-have'
        }
    }],
    skillGap: [{
        skill: String,
        status: {
            type: String,
            enum: ['missing', 'partial', 'complete'],
            default: 'missing'
        }
    }],
    salaryRange: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        }
    },
    jobGrowth: {
        trend: {
            type: String,
            enum: ['growing', 'stable', 'declining'],
            required: true
        },
        percentage: Number
    },
    source: {
        type: String,
        enum: ['stackoverflow-2023', 'stackoverflow-2024', 'naukri'],
        required: true
    },
    dateGenerated: {
        type: Date,
        default: Date.now
    }
});

const CareerRecommendation = mongoose.model('CareerRecommendation', careerRecommendationSchema);
module.exports = CareerRecommendation;
