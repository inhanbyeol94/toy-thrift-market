import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as process from 'process';
@Injectable()
export class UploadService {
  private readonly s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
    region: process.env.AWS_REGION,
  });

  async uploadFile(file: Express.Multer.File) {
    const AWS_S3_BUCKET = 'najunge';

    const params = {
      Bucket: AWS_S3_BUCKET,
      Key: String(file.originalname),
      Body: file.buffer,
    };
    try {
      const response = await this.s3.upload(params).promise();
      return response;
    } catch (e) {
      console.log(e);
      throw new HttpException('Failed to upload file.', 403);
    }
  }
}
