import React, { useState } from 'react';
import {
    Box,
    IconButton,
    Menu,
    MenuItem,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    LinearProgress,
    Chip
} from '@mui/material';
import {
    AttachFile,
    Description,
    Image,
    Link as LinkIcon,
    Close,
    CloudUpload
} from '@mui/icons-material';
import { useChat } from '../../../contexts/ChatContext';

const AttachmentHandler = () => {
    const { attachments, addAttachment, removeAttachment } = useChat();
    const [anchorEl, setAnchorEl] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleFileSelect = async (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            setUploading(true);
            try {
                // Simulate file upload delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                Array.from(files).forEach(file => {
                    addAttachment({
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        url: URL.createObjectURL(file)
                    });
                });
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setUploading(false);
            }
        }
        handleClose();
    };

    const handleUrlAttachment = () => {
        const url = prompt('Enter URL:');
        if (url) {
            addAttachment({
                name: url,
                type: 'url',
                url: url
            });
        }
        handleClose();
    };

    const getFileIcon = (type) => {
        if (type.startsWith('image/')) return <Image />;
        if (type === 'url') return <LinkIcon />;
        return <Description />;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <AttachFile />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem>
                    <input
                        accept="image/*,.pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        id="attachment-file-input"
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                    />
                    <label htmlFor="attachment-file-input">
                        <ListItemIcon>
                            <CloudUpload />
                        </ListItemIcon>
                        <ListItemText primary="Upload File" />
                    </label>
                </MenuItem>
                <MenuItem onClick={handleUrlAttachment}>
                    <ListItemIcon>
                        <LinkIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add URL" />
                </MenuItem>
            </Menu>

            {uploading && (
                <Box sx={{ width: '100%', mt: 1 }}>
                    <LinearProgress />
                </Box>
            )}

            {attachments.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <List dense>
                        {attachments.map((attachment, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        size="small"
                                        onClick={() => removeAttachment(index)}
                                    >
                                        <Close />
                                    </IconButton>
                                }
                            >
                                <ListItemIcon>
                                    {getFileIcon(attachment.type)}
                                </ListItemIcon>
                                <ListItemText
                                    primary={attachment.name}
                                    secondary={
                                        attachment.size && formatFileSize(attachment.size)
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default AttachmentHandler;
