import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ProductColorImage } from '@/interfaces';
import { DoSpacesServiceLib } from '@/doSpaces/doSpaces.provider';

// Typical nestJs service
@Injectable()
export class DoSpacesService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  async uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<ProductColorImage> {
    const [color, colorCode] = file.fieldname.split('#');
    // Precaution to avoid having 2 files with the same name
    const fileId = `${Date.now()}-${fileName || file.originalname.replaceAll(' ', '_')}.${file.mimetype.split('/')[1]}`;

    // Return a promise that resolves only when the file upload is complete
    return new Promise((resolve, reject) => {
      this.s3.putObject(
        {
          Bucket: 'iconic',
          Key: fileId,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve({
              color,
              colorCode: colorCode ? `#${colorCode}` : '',
              imageId: `${fileId}`,
            });
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`,
              ),
            );
          }
        },
      );
    });
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const fileName = fileUrl.split('/').pop();
    return new Promise((resolve, reject) => {
      this.s3.deleteObject(
        {
          Bucket: 'iconic',
          Key: fileName,
        },
        (error: AWS.AWSError) => {
          if (!error) {
            resolve();
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${error.message || 'Something went wrong'}`,
              ),
            );
          }
        },
      );
    });
  }
}
