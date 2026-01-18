const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION, // must match your bucket
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.BUCKET_NAME;

async function uploadToS3(buffer, filename, mimetype) {
  const key = `uploads/${Date.now()}-${filename}`;

  // Upload file
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  }));

  // Generate signed URL
  const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });

  return key;
}
async function getSignedUrlFromKey(key) {
  if (!key) throw new Error("Missing S3 key");

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return signedUrl;
}

module.exports = { uploadToS3, getSignedUrlFromKey };
