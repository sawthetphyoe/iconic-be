import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ProductColorImage } from '@/interfaces';
import { DoSpacesServiceLib } from '@/doSpaces/doSpaces.provider';
import * as process from 'process';

// Typical nestJs service
@Injectable()
export class DoSpacesService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  async uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<ProductColorImage> {
    // Precaution to avoid having 2 files with the same name
    const fileId = `${Date.now()}-${fileName || file.originalname}`;

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
              color: file.fieldname,
              imageUrl: fileId,
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
}
