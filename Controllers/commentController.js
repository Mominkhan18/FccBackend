const Comment = require('../Models/commentModel'); // Adjust the path to your model file
const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, 'uploads/');
    // },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage }).single('receipt');

// Controller function to handle adding a new comment
const addComment = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error uploading file' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Image file is required' });
        }

        const receiptUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        try {
            const newComment = new Comment({ receipt: receiptUrl });
            await newComment.save();
            res.status(201).json({ message: 'Comment added successfully', comment: newComment });
        } catch (error) {
            res.status(500).json({ error: 'Error saving comment' });
        }
    });
};

module.exports = { addComment };
