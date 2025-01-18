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
    analysis: {
        extractedSkills: [String],
        missingKeySkills: [String],
        recommendedSkills: [String],
        formatFeedback: [{
            section: String,
            feedback: String,
            severity: {
                type: String,
                enum: ['high', 'medium', 'low']
            }
        }],
        overallScore: {
            type: Number,
            min: 0,
            max: 100
        }
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

const Resume = mongoose.model('Resume', resumeSchema);
module.exports = Resume;
