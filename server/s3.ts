import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || process.env.AWS_API_KEY || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const bucket = process.env.AWS_S3_BUCKET || "";

export async function getUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; objectKey: string; publicUrl: string }> {
  const ext = fileName.split(".").pop() || "jpg";
  const objectKey = `uploads/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;

  return { uploadUrl, objectKey, publicUrl };
}

export async function getDownloadUrl(objectKey: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 3600 });
}
