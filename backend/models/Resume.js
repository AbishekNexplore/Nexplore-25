const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'docx'],
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    personalInfo: {
        name: String,
        email: String,
        phone: String,
        location: String,
        linkedIn: String,
        portfolio: String
    },
    education: [{
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        gpa: Number,
        highlights: [String]
    }],
    experience: [{
        company: String,
        position: String,
        startDate: Date,
        endDate: Date,
        location: String,
        achievements: [String],
        technologies: [String]
    }],
    analysis: {
        extractedSkills: [String],
        missingKeySkills: [String],
        recommendedSkills: [String],
        actionVerbs: [String],
        measurableAchievements: [String],
        formatFeedback: [{
            section: String,
            feedback: String,
            severity: {
                type: String,
                enum: ['high', 'medium', 'low']
            }
        }],
        aiSuggestions: [String],
        overallScore: {
            type: Number,
            min: 0,
            max: 100
        },
        sectionScores: {
            formatting: Number,
            content: Number,
            achievements: Number,
            skills: Number
        }
    },
    suggestedRoles: [{
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'JobRole'
        },
        matchScore: Number,
        matchedSkills: [String],
        missingSkills: [String]
    }],
    embedding: {
        type: [Number],
        sparse: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    lastAnalyzed: {
        type: Date,
        default: Date.now
    }
});

// Update the lastAnalyzed timestamp before saving if analysis is modified
resumeSchema.pre('save', function(next) {
    if (this.isModified('analysis')) {
        this.lastAnalyzed = Date.now();
    }
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
