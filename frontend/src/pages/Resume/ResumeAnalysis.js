import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
    IconButton,
    Alert,
    LinearProgress
} from '@mui/material';
import {
    Upload,
    Description,
    CheckCircle,
    Error,
    Delete,
    Refresh,
    TrendingUp,
    School,
    Work
} from '@mui/icons-material';
import { uploadResume, analyzeResume } from '../../store/slices/resumeSlice';

const ResumeAnalysis = () => {
    const dispatch = useDispatch();
    const { resume, analysis, loading, error } = useSelector((state) => state.resume);
    const [file, setFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === "application/pdf" || 
            droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
            setFile(droppedFile);
            await handleUpload(droppedFile);
        }
    };

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            await handleUpload(selectedFile);
        }
    };

    const handleUpload = async (fileToUpload) => {
        try {
            const formData = new FormData();
            formData.append('resume', fileToUpload);
            await dispatch(uploadResume(formData)).unwrap();
            await dispatch(analyzeResume()).unwrap();
        } catch (err) {
            console.error('Error uploading resume:', err);
        }
    };

    const handleDelete = () => {
        setFile(null);
        // Add logic to delete from server if needed
    };

    const handleReanalyze = async () => {
        if (resume?.id) {
            await dispatch(analyzeResume()).unwrap();
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Resume Analysis
            </Typography>

            <Grid container spacing={3}>
                {/* Upload Section */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Upload Resume
                            </Typography>

                            {!file ? (
                                <Box
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    sx={{
                                        border: '2px dashed',
                                        borderColor: dragActive ? 'primary.main' : 'grey.300',
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        bgcolor: dragActive ? 'action.hover' : 'background.paper',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept=".pdf,.docx"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                        id="resume-upload"
                                    />
                                    <label htmlFor="resume-upload">
                                        <Upload sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                                        <Typography variant="body1" gutterBottom>
                                            Drag and drop your resume here or click to browse
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Supported formats: PDF, DOCX
                                        </Typography>
                                    </label>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2 }}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Description sx={{ mr: 1 }} />
                                            <Typography variant="body2" noWrap>
                                                {file.name}
                                            </Typography>
                                        </Box>
                                        <IconButton onClick={handleDelete} size="small">
                                            <Delete />
                                        </IconButton>
                                    </Paper>
                                </Box>
                            )}

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {loading && (
                                <Box sx={{ width: '100%', mt: 2 }}>
                                    <LinearProgress />
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {analysis && (
                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2
                                }}>
                                    <Typography variant="h6">
                                        Analysis Summary
                                    </Typography>
                                    <IconButton onClick={handleReanalyze} disabled={loading}>
                                        <Refresh />
                                    </IconButton>
                                </Box>

                                <List dense>
                                    <ListItem>
                                        <ListItemIcon>
                                            <Work />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Experience"
                                            secondary={analysis.yearsOfExperience + " years"}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <School />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Education"
                                            secondary={analysis.highestEducation}
                                        />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon>
                                            <TrendingUp />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Match Score"
                                            secondary={analysis.matchScore + "%"}
                                        />
                                    </ListItem>
                                </List>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Analysis Results */}
                {analysis && (
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            {/* Skills Analysis */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Skills Analysis
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Strong Skills
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    {analysis.skills?.strong?.map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill}
                                                            color="success"
                                                            icon={<CheckCircle />}
                                                            sx={{ m: 0.5 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="subtitle2" gutterBottom>
                                                    Skills to Improve
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    {analysis.skills?.improve?.map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill}
                                                            color="warning"
                                                            icon={<Error />}
                                                            sx={{ m: 0.5 }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Improvement Suggestions */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Improvement Suggestions
                                        </Typography>
                                        <List>
                                            {analysis.suggestions?.map((suggestion, index) => (
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <Error color="warning" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={suggestion.title}
                                                        secondary={suggestion.description}
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Job Match Analysis */}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Job Match Analysis
                                        </Typography>
                                        <List>
                                            {analysis.jobMatches?.map((job, index) => (
                                                <ListItem key={index}>
                                                    <ListItemText
                                                        primary={
                                                            <Box sx={{ 
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                <Typography variant="subtitle1">
                                                                    {job.title}
                                                                </Typography>
                                                                <Chip
                                                                    label={`${job.matchScore}% Match`}
                                                                    color={job.matchScore > 80 ? "success" : "warning"}
                                                                    size="small"
                                                                />
                                                            </Box>
                                                        }
                                                        secondary={
                                                            <Box sx={{ mt: 1 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {job.company} • {job.location}
                                                                </Typography>
                                                                <Box sx={{ mt: 1 }}>
                                                                    {job.matchingSkills?.map((skill, idx) => (
                                                                        <Chip
                                                                            key={idx}
                                                                            label={skill}
                                                                            size="small"
                                                                            sx={{ mr: 0.5, mb: 0.5 }}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            </Box>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ResumeAnalysis;
