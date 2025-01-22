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
        required: true,
        enum: ['pdf', 'doc', 'docx']
    },
    filePath: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    analysis: {
        personalInfo: {
            name: String,
            email: String,
            phone: String,
            location: String,
            linkedin: String,
            portfolio: String
        },
        overallScore: {
            type: Number,
            default: 0
        },
        sectionScores: {
            formatting: {
                type: Number,
                default: 0
            },
            content: {
                type: Number,
                default: 0
            },
            skills: {
                type: Number,
                default: 0
            },
            achievements: {
                type: Number,
                default: 0
            }
        },
        extractedSkills: [{
            type: String
        }],
        suggestions: [{
            type: String
        }],
        aiSuggestions: {
            type: String,
            default: ''
        }
    },
    suggestedRoles: [{
        title: {
            type: String,
            required: true
        },
        matchScore: {
            type: Number,
            required: true
        },
        description: String,
        requirements: [String],
        matchedSkills: [String],
        missingSkills: [String]
    }]
}, {
    timestamps: true
});

// Update the lastAnalyzed timestamp before saving if analysis is modified
resumeSchema.pre('save', function(next) {
    if (this.isModified('analysis')) {
        this.updatedAt = Date.now();
    }
    next();
});

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
