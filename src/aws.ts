import { S3 } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_ENDPOINT,
});
export const uploadFile = async (fileName: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  console.log(fileName);
  const res = await s3
    .upload({
      Body: fileContent,
      Bucket: process.env.BUCKET_NAME as string,
      Key: fileName,
    })
    .promise();
  // console.log(res);
  return res;
};
