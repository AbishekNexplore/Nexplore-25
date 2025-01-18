import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Chip,
    Button,
    Rating,
    TextField,
    InputAdornment,
    IconButton,
    Stack,
    Divider
} from '@mui/material';
import {
    Work,
    LocationOn,
    AttachMoney,
    Search,
    FilterList,
    BookmarkBorder,
    Bookmark
} from '@mui/icons-material';

const JobList = ({ recommendations }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [savedJobs, setSavedJobs] = useState([]);

    const handleSaveJob = (jobId) => {
        if (savedJobs.includes(jobId)) {
            setSavedJobs(savedJobs.filter(id => id !== jobId));
        } else {
            setSavedJobs([...savedJobs, jobId]);
        }
    };

    const filteredJobs = recommendations?.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <Box>
            {/* Search and Filter Bar */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <TextField
                                fullWidth
                                placeholder="Search jobs by title or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<FilterList />}
                            >
                                Filter Results
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Job Cards */}
            <Grid container spacing={2}>
                {filteredJobs.map((job) => (
                    <Grid item xs={12} key={job.id}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={9}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Typography variant="h6" gutterBottom>
                                                {job.title}
                                            </Typography>
                                            <IconButton
                                                onClick={() => handleSaveJob(job.id)}
                                                color={savedJobs.includes(job.id) ? "primary" : "default"}
                                            >
                                                {savedJobs.includes(job.id) ? <Bookmark /> : <BookmarkBorder />}
                                            </IconButton>
                                        </Box>

                                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Work sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2">
                                                    {job.company}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2">
                                                    {job.location}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <AttachMoney sx={{ fontSize: 18, mr: 0.5 }} />
                                                <Typography variant="body2">
                                                    {job.salary}
                                                </Typography>
                                            </Box>
                                        </Stack>

                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            {job.description}
                                        </Typography>

                                        <Box sx={{ mb: 2 }}>
                                            {job.skills.map((skill, index) => (
                                                <Chip
                                                    key={index}
                                                    label={skill}
                                                    size="small"
                                                    sx={{ mr: 1, mb: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={3}>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Match Score
                                            </Typography>
                                            <Rating
                                                value={job.matchScore / 20}
                                                readOnly
                                                precision={0.5}
                                                sx={{ mb: 2 }}
                                            />
                                            <Typography
                                                variant="h6"
                                                color="primary"
                                                gutterBottom
                                            >
                                                {job.matchScore}%
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                sx={{ mb: 1 }}
                                            >
                                                Apply Now
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={8}>
                                        <Typography variant="caption" color="text.secondary">
                                            Posted {job.postedDate} • {job.applicants} applicants
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            Source: {job.source}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default JobList;
