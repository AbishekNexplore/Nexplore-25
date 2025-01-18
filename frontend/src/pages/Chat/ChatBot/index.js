import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const { user } = useAuth();
  const {
    isTyping,
    setTyping,
    suggestions,
    updateSuggestions
  } = useChat();

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle sending message
  const handleSend = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = {
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setTyping(true);

    try {
      // TODO: Replace with actual API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({
          text: "I'm here to help with your career questions! What would you like to know?",
          suggestions: ['Tell me about software engineering', 'What skills should I learn?', 'How to prepare for interviews?']
        }), 1000)
      );

      const botMessage = {
        text: response.text,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };

      setChatHistory(prev => [...prev, botMessage]);
      updateSuggestions(response.suggestions);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        error: true
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setTyping(false);
    }
  };

  // Handle enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: '90vh', py: 4 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Chat Header */}
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">
            AI Career Assistant
          </Typography>
        </Box>

        {/* Chat Messages */}
        <Box 
          sx={{ 
            flexGrow: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: 'grey.50'
          }}
        >
          <List>
            {chatHistory.map((chat, index) => (
              <ListItem
                key={index}
                sx={{
                  flexDirection: 'column',
                  alignItems: chat.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: chat.sender === 'user' ? 'primary.main' : 'white',
                    color: chat.sender === 'user' ? 'white' : 'text.primary',
                    maxWidth: '80%'
                  }}
                >
                  <ListItemText 
                    primary={chat.text}
                    secondary={new Date(chat.timestamp).toLocaleTimeString()}
                    secondaryTypographyProps={{
                      color: chat.sender === 'user' ? 'grey.300' : 'text.secondary'
                    }}
                  />
                </Paper>
              </ListItem>
            ))}
            {isTyping && (
              <ListItem>
                <CircularProgress size={20} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  AI is typing...
                </Typography>
              </ListItem>
            )}
            <div ref={chatEndRef} />
          </List>
        </Box>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="subtitle2" gutterBottom>
              Suggested Questions:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {suggestions.map((suggestion, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={() => setMessage(suggestion)}
                >
                  {suggestion}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        {/* Message Input */}
        <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              multiline
              maxRows={4}
              size="small"
            />
            <IconButton 
              color="primary" 
              onClick={handleSend}
              disabled={!message.trim() || isTyping}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatBot;
