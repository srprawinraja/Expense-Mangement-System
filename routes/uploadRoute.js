const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const router = express.Router();

// Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// S3 configuration
const s3 = new S3Client({ region: "us-east-1" }); // adjust region
const BUCKET_NAME = "amzn-s3-img-url"; // replace with your bucket

// Helper: upload single file buffer to S3
async function uploadToS3(buffer, filename, mimetype) {
  const key = `uploads/${Date.now()}-${filename}`; // unique file name
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  }));

  return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}

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
