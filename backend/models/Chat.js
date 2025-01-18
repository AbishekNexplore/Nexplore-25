const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema],
    context: {
        currentTopic: String,
        relevantSkills: [String],
        careerInterests: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    }
});

// Update lastActivity timestamp before saving
chatSchema.pre('save', function(next) {
    this.lastActivity = new Date();
    next();
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
