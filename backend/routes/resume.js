const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { auth } = require('../middleware/auth');
const Resume = require('../models/Resume');
const resumeProcessor = require('../utils/resumeProcessor');
const jobMatcher = require('../utils/jobMatcher');
const dataProcessor = require('../utils/dataProcessor');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create uploads directory if it doesn't exist
        fs.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch(err => cb(err));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Upload and analyze resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileType = path.extname(req.file.originalname).substring(1);
        
        // Get required skills from the dataset
        const requiredSkills = await dataProcessor.getCommonSkills();

        // Analyze resume
        const analysis = await resumeProcessor.analyzeResume(
            req.file.path,
            fileType,
            requiredSkills
        );

        // Find matching job roles
        const resume = new Resume({
            userId: req.user._id,
            fileName: req.file.originalname,
            fileType: fileType,
            filePath: req.file.path,
            personalInfo: analysis.personalInfo,
            analysis: analysis
        });

        // Generate embeddings and find matching roles
        const suggestedRoles = await jobMatcher.findMatchingRoles(resume);
        resume.suggestedRoles = suggestedRoles;

        await resume.save();

        res.json({
            message: 'Resume uploaded and analyzed successfully',
            resume: resume
        });
    } catch (error) {
        // Clean up uploaded file if there's an error
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ error: error.message });
    }
});

// Get user's resume analysis
router.get('/analysis', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id })
            .sort({ uploadDate: -1 })
            .populate('suggestedRoles.roleId');

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        res.json({
            analysis: resume.analysis,
            personalInfo: resume.personalInfo,
            suggestedRoles: resume.suggestedRoles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get suggested job roles
router.get('/suggested-roles', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id })
            .sort({ uploadDate: -1 })
            .populate('suggestedRoles.roleId');

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        res.json(resume.suggestedRoles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update resume analysis
router.post('/reanalyze', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id })
            .sort({ uploadDate: -1 });

        if (!resume) {
            return res.status(404).json({ error: 'No resume found' });
        }

        const requiredSkills = await dataProcessor.getCommonSkills();
        
        // Re-analyze resume
        const analysis = await resumeProcessor.analyzeResume(
            resume.filePath,
            resume.fileType,
            requiredSkills
        );

        // Update analysis and find new matching roles
        resume.analysis = analysis;
        resume.suggestedRoles = await jobMatcher.findMatchingRoles(resume);
        
        await resume.save();

        res.json({
            message: 'Resume reanalyzed successfully',
            resume: resume
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }

        // Delete file from storage
        await fs.unlink(resume.filePath);

        // Delete from database
        await resume.remove();

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
