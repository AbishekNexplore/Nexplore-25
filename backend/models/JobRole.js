const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    requiredSkills: [{
        type: String,
        required: true
    }],
    recommendedSkills: [{
        type: String
    }],
    embedding: {
        type: [Number],
        sparse: true
    },
    category: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'lead'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
jobRoleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const JobRole = mongoose.model('JobRole', jobRoleSchema);
module.exports = JobRole;
