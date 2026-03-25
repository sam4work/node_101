import { Upload } from '@aws-sdk/lib-storage';
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/s3.js';
import { v4 as uuidv4 } from 'uuid'; // optional: npm i uuid @types/uuid

export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

class StorageService {
    private bucket = process.env.MINIO_BUCKET!;

    /**
     * Upload a file exactly like Laravel Storage::put()
     */
    async upload(file: MulterFile, customKey?: string): Promise<string> {
        const key = customKey ?? `${uuidv4()}-${file.originalname}`;

        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                // ACL: 'public-read', // only if you set a bucket policy to allow it
            },
        });

        await upload.done();
        return key; // returns the key (Laravel-style)
    }

    /**
     * Get public URL (if your bucket is public) – like Storage::url()
     */
    getPublicUrl(key: string): string {
        // MinIO path-style URL
        return `${process.env.MINIO_ENDPOINT}/${this.bucket}/${key}`;
    }

    /**
     * Get temporary signed URL (most common & secure) – like Storage::temporaryUrl()
     */
    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return await getSignedUrl(s3Client, command, { expiresIn });
    }

    /**
     * Delete file – like Storage::delete()
     */
    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        await s3Client.send(command);
    }
}

export const storage = new StorageService();