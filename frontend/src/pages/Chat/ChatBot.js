import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography,
    Button
} from '@mui/material';
import { startNewChat, sendMessage } from '../../store/slices/chatSlice';

const ChatBot = () => {
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const currentChat = useSelector(state => state.chat.currentChat);
    const [messages, setMessages] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (currentChat?.messages) {
            setMessages(currentChat.messages);
        }
    }, [currentChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const messageText = input.trim();
        
        if (messageText) {
            try {
                let activeChatId = currentChat?._id;

                // Add user message immediately to UI
                setMessages(prev => [...prev, { content: messageText, role: 'user' }]);
                setInput('');

                if (!activeChatId) {
                    // Start a new chat if we don't have one
                    const result = await dispatch(startNewChat()).unwrap();
                    if (!result) {
                        console.error('Failed to start new chat');
                        return;
                    }
                    activeChatId = result._id;
                }

                // Send message to backend
                const response = await dispatch(sendMessage({ 
                    content: messageText, 
                    chatId: activeChatId
                })).unwrap();

                // Add bot response to UI
                if (response && response.response) {
                    setMessages(prev => [...prev, { content: response.response, role: 'assistant' }]);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                // Add error message to UI
                setMessages(prev => [...prev, { 
                    content: "Sorry, I encountered an error. Please try again.", 
                    role: 'assistant',
                    isError: true 
                }]);
            }
        }
    };

    return (
        <Box p={3} bgcolor="background.default" style={{ height: '100vh' }}>
            <Grid container direction="column" style={{ height: '100%' }}>
                <Grid item xs={12} style={{ flexGrow: 1, overflow: 'auto' }}>
                    <Paper elevation={3} style={{ height: '100%', overflow: 'auto', padding: '20px' }}>
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                mb={2}
                                display="flex"
                                justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                            >
                                <Paper
                                    elevation={1}
                                    style={{
                                        padding: '10px 20px',
                                        maxWidth: '70%',
                                        backgroundColor: msg.role === 'user' ? '#e3f2fd' : msg.isError ? '#ffcccc' : '#f5f5f5',
                                        borderRadius: '15px'
                                    }}
                                >
                                    <Typography>{msg.content}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Paper>
                </Grid>
                <Grid item>
                    <Box mt={2}>
                        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                disabled={!input.trim()}
                            >
                                Send
                            </Button>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChatBot;
