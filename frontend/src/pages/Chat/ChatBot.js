import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Avatar,
    CircularProgress
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
            
            return (
                <Box
                    key={index}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        bgcolor: msg.role === 'assistant'
                            ? theme.palette.mode === 'dark' ? '#24283b' : '#f8fafc'
                            : 'transparent',
                        width: '100%',
                        borderRadius: 2,
                        mb: 2
                    }}
                >
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'transparent'
                        }}
                    >
                        {msg.role === 'assistant' ? (
                            <Box 
                                component="div" 
                                sx={{ 
                                    width: 40, 
                                    height: 40,
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
                                    width: 32, 
                                    height: 32,
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
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="body1"
                            sx={{
                                color: theme.palette.mode === 'dark' ? '#c0caf5' : '#334155',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
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
            bgcolor: theme.palette.mode === 'dark' ? '#1a1b26' : '#f0f4f8', 
            height: '100%' 
        }}>
            <Navbar />
            {/* Main Chat Area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    pt: '64px'
                }}
            >
                {/* Messages Container */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        p: 2,
                        width: '100%',
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: theme.palette.mode === 'dark' ? '#1a1b26' : '#f1f5f9'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: theme.palette.mode === 'dark' ? '#24283b' : '#cbd5e1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: theme.palette.mode === 'dark' ? '#414868' : '#94a3b8'
                        }
                    }}
                >
                    {renderMessages()}
                    {isLoading && (
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                p: 2,
                                bgcolor: theme.palette.mode === 'dark' ? '#24283b' : '#f8fafc',
                                width: '100%',
                                borderRadius: 2,
                                mb: 2
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: 'transparent'
                                }}
                            >
                                <Box 
                                    component="div" 
                                    sx={{ 
                                        width: 40, 
                                        height: 40,
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
                                color: theme.palette.mode === 'dark' ? '#c0caf5' : '#334155'
                            }}>
                                <CircularProgress size={20} thickness={4} sx={{ mr: 2 }} />
                                Thinking...
                            </Box>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>

                {/* Input Container */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        bgcolor: theme.palette.mode === 'dark' ? '#1a1b26' : '#ffffff',
                        borderTop: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                    }}
                >
                    <IconButton
                        onClick={handleNewChat}
                        sx={{
                            color: theme.palette.mode === 'dark' ? '#c0caf5' : '#334155',
                            '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' ? '#24283b' : '#f8fafc'
                            }
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            display: 'flex',
                            gap: 1,
                            flexGrow: 1,
                        }}
                    >
                        <TextField
                            fullWidth
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Type your message here..."
                            multiline
                            maxRows={5}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: theme.palette.mode === 'dark' ? '#24283b' : '#ffffff',
                                    '& fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                                    },
                                    '& textarea': {
                                        color: theme.palette.mode === 'dark' ? '#c0caf5' : '#2c4257'
                                    }
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton 
                                        type="submit"
                                        disabled={!userInput.trim() || isLoading}
                                        sx={{ 
                                            color: theme.palette.mode === 'dark' ? '#c0caf5' : '#334155',
                                            '&:hover': {
                                                bgcolor: theme.palette.mode === 'dark' ? '#24283b' : '#f8fafc'
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ChatBot;
