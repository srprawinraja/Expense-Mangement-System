require("dotenv").config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME 
const SIGNED_URL_EXPIRES = parseInt(process.env.SIGNED_URL_EXPIRES || "300", 10); 


async function uploadToS3(buffer, filename, mimetype) {
  // Generate a unique S3 key
  const key = `uploads/${Date.now()}-${filename}`;

  // Upload file to S3
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  // Generate a signed URL valid for SIGNED_URL_EXPIRES seconds
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: SIGNED_URL_EXPIRES });
  return signedUrl;
}

module.exports = { uploadToS3 };
