import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Button,
    CircularProgress,
    Divider,
    Card,
    CardContent
} from '@mui/material';
import {
    Send,
    AttachFile,
    SmartToy,
    Person,
    Save,
    Delete,
    BookmarkBorder,
    Bookmark
} from '@mui/icons-material';
import { sendMessage, startNewChat, loadChatHistory } from '../../store/slices/chatSlice';

const CareerChat = () => {
    const dispatch = useDispatch();
    const { messages, loading, currentChat } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.auth);
    const [input, setInput] = useState('');
    const [savedMessages, setSavedMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!currentChat) {
            dispatch(startNewChat());
        }
    }, [dispatch, currentChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            await dispatch(sendMessage({ content: input, chatId: currentChat.id }));
            setInput('');
        }
    };

    const handleSaveMessage = (messageId) => {
        if (savedMessages.includes(messageId)) {
            setSavedMessages(savedMessages.filter(id => id !== messageId));
        } else {
            setSavedMessages([...savedMessages, messageId]);
        }
    };

    const getSuggestionChips = () => {
        const suggestions = [
            "What career path suits my skills?",
            "How can I improve my resume?",
            "What are the trending jobs in tech?",
            "Salary expectations for my role",
            "Skills I should learn next"
        ];

        return (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {suggestions.map((suggestion, index) => (
                    <Chip
                        key={index}
                        label={suggestion}
                        onClick={() => setInput(suggestion)}
                        clickable
                        sx={{ '&:hover': { bgcolor: 'primary.light' } }}
                    />
                ))}
            </Box>
        );
    };

    return (
        <Grid container spacing={2}>
            {/* Chat Area */}
            <Grid item xs={12} md={8}>
                <Paper 
                    elevation={3}
                    sx={{
                        height: 'calc(100vh - 200px)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* Chat Header */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Typography variant="h6">
                            Career Advisor Chat
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Ask anything about your career path and get AI-powered guidance
                        </Typography>
                    </Box>

                    {/* Messages Area */}
                    <Box sx={{ 
                        flexGrow: 1, 
                        overflow: 'auto',
                        p: 2,
                        backgroundColor: 'grey.50'
                    }}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        flexDirection: 'column',
                                        alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                        mb: 2
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        maxWidth: '70%'
                                    }}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                {message.sender === 'user' ? <Person /> : <SmartToy />}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Box>
                                            <Paper
                                                elevation={1}
                                                sx={{
                                                    p: 2,
                                                    bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                                                    borderRadius: 2
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {message.content}
                                                </Typography>
                                            </Paper>
                                            {message.resources && (
                                                <Box sx={{ mt: 1 }}>
                                                    {message.resources.map((resource, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={resource.title}
                                                            size="small"
                                                            onClick={() => window.open(resource.url)}
                                                            sx={{ mr: 1, mb: 1 }}
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                            <Box sx={{ 
                                                display: 'flex',
                                                alignItems: 'center',
                                                mt: 0.5
                                            }}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleSaveMessage(message.id)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    {savedMessages.includes(message.id) ? 
                                                        <Bookmark fontSize="small" /> : 
                                                        <BookmarkBorder fontSize="small" />
                                                    }
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                            <div ref={messagesEndRef} />
                        </List>
                    </Box>

                    {/* Suggestion Chips */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        {getSuggestionChips()}
                    </Box>

                    {/* Input Area */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <form onSubmit={handleSend}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton size="large">
                                    <AttachFile />
                                </IconButton>
                                <TextField
                                    fullWidth
                                    placeholder="Type your message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mx: 1 }}
                                    disabled={loading}
                                />
                                <IconButton 
                                    type="submit" 
                                    color="primary"
                                    disabled={!input.trim() || loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : <Send />}
                                </IconButton>
                            </Box>
                        </form>
                    </Box>
                </Paper>
            </Grid>

            {/* Saved Items and History */}
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Saved Insights
                        </Typography>
                        <List>
                            {messages
                                .filter(msg => savedMessages.includes(msg.id))
                                .map((msg, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => handleSaveMessage(msg.id)}>
                                                <Delete />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText
                                            primary={msg.content}
                                            secondary={new Date(msg.timestamp).toLocaleDateString()}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                    </CardContent>
                </Card>

                <Card sx={{ mt: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Chat History
                        </Typography>
                        <List>
                            {currentChat?.history?.map((chat, index) => (
                                <ListItem
                                    key={index}
                                    button
                                    onClick={() => dispatch(loadChatHistory(chat.id))}
                                >
                                    <ListItemText
                                        primary={chat.title}
                                        secondary={new Date(chat.timestamp).toLocaleDateString()}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CareerChat;
