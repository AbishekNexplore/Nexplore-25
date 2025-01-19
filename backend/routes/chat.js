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
            messages: []
        });

        await chat.save();
        console.log('New chat created:', chat);
        res.json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
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

        // Get response from chatbot
        const botResponse = await chatbot.processMessage(message);

        // Add bot response to chat
        chat.messages.push({
            content: botResponse,
            role: 'assistant'
        });

        await chat.save();
        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Failed to process message' });
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
