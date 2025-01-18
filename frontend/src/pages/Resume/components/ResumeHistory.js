import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Divider,
    Button
} from '@mui/material';
import {
    Description,
    Delete,
    Download,
    History,
    TrendingUp
} from '@mui/icons-material';
import { getResumeHistory } from '../../../store/slices/resumeSlice';

const ResumeHistory = () => {
    const dispatch = useDispatch();
    const { history, loading } = useSelector((state) => state.resume);

    useEffect(() => {
        dispatch(getResumeHistory());
    }, [dispatch]);

    const handleDownload = (resumeId) => {
        // Implement download logic
    };

    const handleDelete = (resumeId) => {
        // Implement delete logic
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Card>
            <CardContent>
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                }}>
                    <Typography variant="h6">
                        Resume History
                    </Typography>
                    <Button
                        startIcon={<History />}
                        onClick={() => dispatch(getResumeHistory())}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </Box>

                <List>
                    {history.map((resume, index) => (
                        <React.Fragment key={resume.id}>
                            <ListItem>
                                <ListItemIcon>
                                    <Description />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography variant="subtitle1">
                                                {resume.filename}
                                            </Typography>
                                            <Chip
                                                size="small"
                                                label={`${resume.matchScore}% Match`}
                                                color={resume.matchScore > 80 ? "success" : "warning"}
                                                icon={<TrendingUp />}
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Uploaded on {formatDate(resume.uploadDate)}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                {resume.skills?.map((skill, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        label={skill}
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDownload(resume.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        <Download />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        onClick={() => handleDelete(resume.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            {index < history.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>

                {history.length === 0 && (
                    <Box sx={{ 
                        textAlign: 'center',
                        py: 4
                    }}>
                        <Typography variant="body1" color="text.secondary">
                            No resume history found
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ResumeHistory;
