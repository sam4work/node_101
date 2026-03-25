import multer from 'multer';

export const uploadMiddleware = multer({
    storage: multer.memoryStorage(), // ← no disk I/O, just like Laravel
    limits: {fileSize: 100 * 1024 * 1024}, // 100 MB example
    fileFilter: (_req, file, cb) => {
        // optional: add your own mime-type filtering
        cb(null, true);
    },
}).single('file'); // change to .array() or .fields() if needed