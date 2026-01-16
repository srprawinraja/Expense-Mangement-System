const express = require("express");
const multer = require("multer");
const { uploadToS3 } = require('../utils/s3Upload');


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


// Route: upload multiple files
router.post("/", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    if (!files || !files.length) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Upload all files in parallel to S3
    const urls = await Promise.all(
      files.map(file =>
        uploadToS3(file.buffer, file.originalname, file.mimetype)
      )
    );

    res.json({ urls }); // return array of file URLs
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
