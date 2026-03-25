import {Upload} from '@aws-sdk/lib-storage';
import {DeleteObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import {getSignedUrl} from '@aws-sdk/s3-request-presigner';
import {s3Client} from '../config/s3.js';
import {v4 as uuidv4} from 'uuid'; // optional: npm i uuid @types/uuid

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


    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        return await getSignedUrl(s3Client, command, {expiresIn});
    }


    async delete(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });
        await s3Client.send(command);
    }
}

export const storage = new StorageService();