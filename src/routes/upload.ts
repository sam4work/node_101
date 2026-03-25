import {Request, Response, Router} from 'express';
import {uploadMiddleware} from '../middleware/upload.js';
import {type MulterFile, storage} from '../services/StorageService.js';

const router = Router();

router.post('/upload', uploadMiddleware, async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No file uploaded'});
        }

        const key = await storage.upload(req.file as MulterFile);

        const signedUrl = await storage.getSignedUrl(key, 3600); // 1 hour

        res.json({
            message: 'File uploaded successfully (MinIO S3)',
            key,
            signedUrl,
        });
    } catch (err: any) {
        console.error(err);
        // res.status(500).json({ error: err.message });
    }
});

export default router;