import { ProductColorImage } from '@/interfaces';
import { Injectable } from '@nestjs/common';
import { Client, Storage } from 'appwrite';

@Injectable()
export class AppwriteService {
  private client: Client;
  private storage: Storage;

  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);

    // Initialize the Appwrite client
    this.client
      .setEndpoint(process.env.APPWRITE_ENDPOINT) // API Endpoint
      .setProject(process.env.APPWRITE_PROJECT_ID); // Project ID
  }

  // Upload a file to the Appwrite bucket
  async uploadFile(
    file: Express.Multer.File,
    fileName?: string,
  ): Promise<ProductColorImage> {
    const [color, colorCode] = file.fieldname.split('#');
    // Precaution to avoid having 2 files with the same name
    const originalFilename = file.originalname.replaceAll(' ', '_');
    const fileType = file.mimetype.split('/')[1];
    const fileId = `${Date.now()}-${fileName || originalFilename}.${fileType}`;
    try {
      const result = await this.storage.createFile(
        process.env.APPWRITE_STORAGE_BUCKET_ID,
        fileId,
        new File([file.buffer], file.originalname, { type: file.mimetype }), // Convert Multer file to File object
      );
      return {
        color,
        colorCode: colorCode ? `#${colorCode}` : '',
        imageId: `${result.$id}`,
      };
    } catch (error) {
      throw new Error(`File upload failed: ${error.message}`);
    }
  }

  // Delete a file from the Appwrite bucket
  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.storage.deleteFile(process.env.APPWRITE_BUCKET_ID, fileId);
    } catch (error) {
      throw new Error(`File deletion failed: ${error.message}`);
    }
  }
}
