const express = require('express');
const { addComment } = require('../Controllers/commentController'); // Adjust the path to your controller file

const router = express.Router();

router.post('/comment', addComment);

module.exports = router;