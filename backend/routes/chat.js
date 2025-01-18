const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Chat = require('../models/Chat');
const chatbot = require('../utils/chatbot');

// Start new chat session
router.post('/start', auth, async (req, res) => {
    try {
        const chat = new Chat({
            userId: req.user._id,
            context: {
                currentTopic: 'general',
                relevantSkills: req.user.profile.skills || [],
                careerInterests: req.user.profile.interests || []
            }
        });

        await chat.save();
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send message in chat
router.post('/:chatId/message', auth, async (req, res) => {
    try {
        const { message } = req.body;
        const chat = await Chat.findOne({
            _id: req.params.chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        // Add user message to chat
        chat.messages.push({
            content: message,
            role: 'user'
        });

        // Get context for the chatbot
        const context = {
            pastUserInputs: chat.messages
                .filter(msg => msg.role === 'user')
                .map(msg => msg.content),
            generatedResponses: chat.messages
                .filter(msg => msg.role === 'assistant')
                .map(msg => msg.content)
        };

        // Get chatbot response
        let response = await chatbot.processMessage(message, context);

        // Enhance response with career context
        response = chatbot.enhanceResponseWithCareerContext(response, req.user.profile);

        // Add bot response to chat
        chat.messages.push({
            content: response,
            role: 'assistant'
        });

        await chat.save();
        res.json({
            message: response,
            chat: chat
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.user._id })
            .sort({ lastActivity: -1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific chat
router.get('/:chatId', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get career advice
router.get('/advice', auth, async (req, res) => {
    try {
        const advice = await chatbot.generateCareerAdvice(req.user.profile);
        res.json(advice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete chat
router.delete('/:chatId', auth, async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({
            _id: req.params.chatId,
            userId: req.user._id
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
