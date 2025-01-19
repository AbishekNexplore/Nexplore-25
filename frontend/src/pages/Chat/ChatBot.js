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
    const currentChat = useSelector((state) => state.chat.currentChat);
    const { messages, loading } = useSelector((state) => state.chat);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const messageText = input.trim();
        
        if (messageText) {
            try {
                if (!currentChat) {
                    const result = await dispatch(startNewChat()).unwrap();
                    if (!result) {
                        console.error('Failed to start new chat');
                        return;
                    }
                }
                
                await dispatch(sendMessage({ 
                    content: messageText, 
                    chatId: currentChat.id 
                }));
                
                setInput('');
            } catch (error) {
                console.error('Error sending message:', error);
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
                                        backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                                        borderRadius: msg.role === 'user' ? '20px 20px 0 20px' : '20px 20px 20px 0'
                                    }}
                                >
                                    <Typography variant="body1">{msg.content}</Typography>
                                </Paper>
                            </Box>
                        ))}
                        <div ref={messagesEndRef} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                        <form onSubmit={handleSend}>
                            <Grid container spacing={2}>
                                <Grid item xs={11}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        placeholder="Type your message..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={loading}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={loading || !input.trim()}
                                        style={{ height: '100%' }}
                                    >
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ChatBot;
