const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require("crypto");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.warn("Warning: AWS credentials not found in environment variables");
}

const s3Client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const generateUniqueFileName = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString("hex");
  const extension = originalName.split(".").pop();
  return `${timestamp}-${randomString}.${extension}`;
};

exports.uploadToS3 = async (fileBuffer, originalFilename, folder = 'userPhotos') => {
  const fileName = generateUniqueFileName(originalFilename);
  const s3Key = `${folder}/${fileName}`;

  const params = {
    Bucket: "dog-breed-id-ml-model",
    Key: s3Key,
    Body: fileBuffer,
    ContentType: "image/jpeg",
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    return `https://dog-breed-id-ml-model.s3.us-east-1.amazonaws.com/${s3Key}`;
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload image to S3");
  }
};