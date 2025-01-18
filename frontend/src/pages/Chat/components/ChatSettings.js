import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Switch,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { useChat } from '../../../contexts/ChatContext';

const ChatSettings = ({ open, onClose }) => {
    const { preferences, updatePreferences } = useChat();

    const handleToggle = (key) => {
        updatePreferences({ [key]: !preferences[key] });
    };

    const handleLanguageChange = (event) => {
        updatePreferences({ language: event.target.value });
    };

    const handleToneChange = (event) => {
        updatePreferences({ conversationTone: event.target.value });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chat Settings</DialogTitle>
            <DialogContent>
                <List>
                    {/* Notification Settings */}
                    <ListItem>
                        <ListItemText
                            primary="Chat Notifications"
                            secondary="Receive notifications for new messages"
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={preferences.notifications}
                                onChange={() => handleToggle('notifications')}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    {/* History Settings */}
                    <ListItem>
                        <ListItemText
                            primary="Save Chat History"
                            secondary="Keep record of your conversations"
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={preferences.saveHistory}
                                onChange={() => handleToggle('saveHistory')}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    {/* Auto Suggestions */}
                    <ListItem>
                        <ListItemText
                            primary="Smart Suggestions"
                            secondary="Show AI-powered conversation suggestions"
                        />
                        <ListItemSecondaryAction>
                            <Switch
                                edge="end"
                                checked={preferences.autoSuggestions}
                                onChange={() => handleToggle('autoSuggestions')}
                            />
                        </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />

                    {/* Language Settings */}
                    <ListItem>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Conversation Language</InputLabel>
                            <Select
                                value={preferences.language || 'en'}
                                onChange={handleLanguageChange}
                                label="Conversation Language"
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                                <MenuItem value="de">German</MenuItem>
                                <MenuItem value="zh">Chinese</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    <Divider />

                    {/* Conversation Tone */}
                    <ListItem>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Conversation Tone</InputLabel>
                            <Select
                                value={preferences.conversationTone || 'professional'}
                                onChange={handleToneChange}
                                label="Conversation Tone"
                            >
                                <MenuItem value="professional">Professional</MenuItem>
                                <MenuItem value="casual">Casual</MenuItem>
                                <MenuItem value="friendly">Friendly</MenuItem>
                                <MenuItem value="technical">Technical</MenuItem>
                            </Select>
                        </FormControl>
                    </ListItem>
                    <Divider />

                    {/* Context Settings */}
                    <ListItem>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Career Goals"
                                multiline
                                rows={2}
                                value={preferences.careerGoals || ''}
                                onChange={(e) => updatePreferences({ careerGoals: e.target.value })}
                                placeholder="Describe your career goals to get more relevant advice"
                            />
                        </FormControl>
                    </ListItem>
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={onClose} color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChatSettings;
