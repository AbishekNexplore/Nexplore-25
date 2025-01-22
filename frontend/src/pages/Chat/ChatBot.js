import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Avatar,
    CircularProgress,
    Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import { sendMessage, startNewChat } from '../../store/slices/chatSlice';
import { ReactComponent as MapLogo } from '../../assets/map-svgrepo-com.svg';
import { ReactComponent as UserAvatar } from '../../assets/avatar-boy-svgrepo-com.svg';
import Navbar from '../../components/layout/Navbar';

const ChatBot = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const rawMessages = useSelector(state => state.chat.messages);
    const messages = useMemo(() => rawMessages || [], [rawMessages]);
    const currentChat = useSelector(state => state.chat.currentChat);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleNewChat = () => {
        dispatch(startNewChat());
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!currentChat) {
            dispatch(startNewChat());
        }
    }, [dispatch, currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const messageContent = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            if (!currentChat) {
                const newChatAction = await dispatch(startNewChat()).unwrap();
                if (newChatAction) {
                    const response = await dispatch(sendMessage({ 
                        content: messageContent,
                        chatId: newChatAction._id 
                    })).unwrap();
                    console.log('Message response in component:', response);
                }
            } else {
                const response = await dispatch(sendMessage({ 
                    content: messageContent,
                    chatId: currentChat._id 
                })).unwrap();
                console.log('Message response in component:', response);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessages = () => {
        if (!Array.isArray(messages)) return null;
        
        return messages.map((msg, index) => {
            if (!msg || !msg.role || !msg.content) return null;
            
            const isAssistant = msg.role === 'assistant';
            
            return (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        p: 3,
                        bgcolor: isAssistant 
                            ? theme.palette.mode === 'dark' ? '#444654' : '#f7f7f8'
                            : theme.palette.mode === 'dark' ? '#343541' : '#ffffff',
                        borderTop: 1,
                        borderBottom: 1,
                        borderColor: theme.palette.mode === 'dark' ? '#2A2B32' : '#d9d9e3',
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            maxWidth: '800px',
                            width: '100%',
                            mx: 'auto',
                            display: 'flex',
                            gap: 2
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 30,
                                height: 30,
                                bgcolor: 'transparent'
                            }}
                        >
                            {isAssistant ? (
                                <Box 
                                    component="div" 
                                    sx={{ 
                                        width: 24, 
                                        height: 24,
                                        '& svg': {
                                            width: '100%',
                                            height: '100%',
                                            fill: 'currentColor',
                                            color: theme.palette.mode === 'dark' ? '#7aa2f7' : '#2563eb'
                                        }
                                    }}
                                >
                                    <MapLogo />
                                </Box>
                            ) : (
                                <Box 
                                    component="div" 
                                    sx={{ 
                                        width: 24, 
                                        height: 24,
                                        '& svg': {
                                            width: '100%',
                                            height: '100%',
                                            fill: 'currentColor',
                                            color: theme.palette.mode === 'dark' ? '#9ece6a' : '#059669'
                                        }
                                    }}
                                >
                                    <UserAvatar />
                                </Box>
                            )}
                        </Avatar>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#d1d5db' : '#374151',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                lineHeight: 1.7
                            }}
                        >
                            {msg.content}
                        </Typography>
                    </Box>
                </Box>
            );
        });
    };

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: theme.palette.mode === 'dark' ? '#343541' : '#ffffff', 
            minHeight: '100vh',
            width: '100%'
        }}>
            <Navbar />
            {/* Main Chat Area */}
            <Box
                component="main"
                sx={{
                    width: '100%',
                    maxWidth: '800px',
                    minHeight: 'calc(100vh - 64px)',
                    display: 'flex',
                    flexDirection: 'column',
                    pt: '64px',
                    mx: 'auto'
                }}
            >
                {/* Messages Container */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        width: '100%',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.mode === 'dark' ? '#565869' : '#d9d9e3',
                            borderRadius: '3px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: theme.palette.mode === 'dark' ? '#666980' : '#c5c5d2'
                        }
                    }}
                >
                    {messages.length === 0 && (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '50vh',
                            flexDirection: 'column',
                            gap: 2,
                            color: theme.palette.mode === 'dark' ? '#c5c5d2' : '#6e6e80'
                        }}>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                AI Career Navigator
                            </Typography>
                            <Typography variant="body1">
                                How can I help with your career today?
                            </Typography>
                        </Box>
                    )}
                    {renderMessages()}
                    {isLoading && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                p: 3,
                                bgcolor: theme.palette.mode === 'dark' ? '#444654' : '#f7f7f8',
                                width: '100%',
                                borderTop: 1,
                                borderBottom: 1,
                                borderColor: theme.palette.mode === 'dark' ? '#2A2B32' : '#d9d9e3'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 30,
                                    height: 30,
                                    bgcolor: 'transparent'
                                }}
                            >
                                <Box 
                                    component="div" 
                                    sx={{ 
                                        width: 24, 
                                        height: 24,
                                        '& svg': {
                                            width: '100%',
                                            height: '100%',
                                            fill: 'currentColor',
                                            color: theme.palette.mode === 'dark' ? '#7aa2f7' : '#2563eb'
                                        }
                                    }}
                                >
                                    <MapLogo />
                                </Box>
                            </Avatar>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: theme.palette.mode === 'dark' ? '#c5c5d2' : '#6e6e80'
                            }}>
                                <CircularProgress size={16} thickness={6} sx={{ mr: 2 }} />
                                Thinking...
                            </Box>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input Container */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                        maxWidth: '800px',
                        mx: 'auto',
                        position: 'sticky',
                        bottom: 0,
                        pb: 4,
                        bgcolor: theme.palette.mode === 'dark' ? '#343541' : '#ffffff',
                        borderTop: 1,
                        borderColor: theme.palette.mode === 'dark' ? '#2A2B32' : '#d9d9e3'
                    }}
                >
                    <Box sx={{ 
                        display: 'flex',
                        gap: 2,
                        width: '100%',
                        alignItems: 'flex-start'
                    }}>
                        <Button
                            onClick={handleNewChat}
                            startIcon={<AddIcon />}
                            variant="outlined"
                            size="small"
                            sx={{
                                minWidth: 'auto',
                                height: '56px',
                                borderColor: theme.palette.mode === 'dark' ? '#565869' : '#d9d9e3',
                                color: theme.palette.mode === 'dark' ? '#d1d5db' : '#374151',
                                textTransform: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                '&:hover': {
                                    borderColor: theme.palette.mode === 'dark' ? '#666980' : '#c5c5d2',
                                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(86, 88, 105, 0.1)' : 'rgba(217, 217, 227, 0.1)'
                                }
                            }}
                        >
                            New
                        </Button>

                        <Box sx={{ 
                            display: 'flex',
                            gap: 1,
                            width: '100%',
                            position: 'relative'
                        }}>
                            <TextField
                                fullWidth
                                multiline
                                maxRows={4}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                                placeholder="Send a message..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        height: '56px',
                                        bgcolor: theme.palette.mode === 'dark' ? '#40414f' : '#ffffff',
                                        border: '1px solid',
                                        borderColor: theme.palette.mode === 'dark' ? '#565869' : '#d9d9e3',
                                        borderRadius: 2,
                                        boxShadow: '0 0 8px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            borderColor: theme.palette.mode === 'dark' ? '#666980' : '#c5c5d2'
                                        },
                                        '&.Mui-focused': {
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`
                                        }
                                    }
                                }}
                            />
                            <IconButton 
                                type="submit"
                                disabled={!userInput.trim() || isLoading}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    bottom: 8,
                                    color: theme.palette.mode === 'dark' ? '#c5c5d2' : '#6e6e80',
                                    '&:hover': {
                                        bgcolor: 'transparent',
                                        color: theme.palette.primary.main
                                    }
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                    </Box>
                    <Typography 
                        variant="caption" 
                        align="center"
                        sx={{ 
                            color: theme.palette.mode === 'dark' ? '#c5c5d2' : '#6e6e80',
                            mt: -1 
                        }}
                    >
                        Free Research Preview. Our goal is to help you navigate your career path effectively.
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatBot;
