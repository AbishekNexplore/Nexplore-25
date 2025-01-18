import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Chip,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse
} from '@mui/material';
import {
    TrendingUp,
    School,
    Work,
    Timeline,
    Psychology
} from '@mui/icons-material';
import { useChat } from '../../../contexts/ChatContext';

const ContextualSuggestions = ({ userMessage }) => {
    const { contextualData, updateSuggestions } = useChat();

    useEffect(() => {
        if (userMessage) {
            // Analyze message and update suggestions
            analyzeMessageContext(userMessage);
        }
    }, [userMessage]);

    const analyzeMessageContext = (message) => {
        // This would typically be an API call to analyze the message
        // For now, we'll use mock data based on keywords
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
            updateSuggestions([
                {
                    type: 'skills',
                    suggestions: [
                        'What skills are trending in my field?',
                        'How can I improve my technical skills?',
                        'What certifications should I pursue?'
                    ]
                }
            ]);
        } else if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
            updateSuggestions([
                {
                    type: 'career',
                    suggestions: [
                        'What career paths match my skills?',
                        'How to transition to a new role?',
                        'What are the job market trends?'
                    ]
                }
            ]);
        }
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'skills':
                return <School />;
            case 'career':
                return <Work />;
            case 'trends':
                return <TrendingUp />;
            case 'path':
                return <Timeline />;
            default:
                return <Psychology />;
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Related Topics
                </Typography>

                {contextualData && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                            Based on your conversation
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {contextualData.topics?.map((topic, index) => (
                                <Chip
                                    key={index}
                                    label={topic}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                <List dense>
                    {contextualData?.suggestions?.map((category, index) => (
                        <React.Fragment key={index}>
                            <ListItem>
                                <ListItemIcon>
                                    {getIconForType(category.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={category.title}
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            {category.suggestions.map((suggestion, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={suggestion}
                                                    size="small"
                                                    onClick={() => {
                                                        // Handle suggestion click
                                                    }}
                                                    sx={{ mr: 1, mb: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    }
                                />
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>

                {contextualData?.resources && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Recommended Resources
                        </Typography>
                        <List dense>
                            {contextualData.resources.map((resource, index) => (
                                <ListItem key={index} button component="a" href={resource.url} target="_blank">
                                    <ListItemIcon>
                                        <School />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={resource.title}
                                        secondary={resource.source}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ContextualSuggestions;
