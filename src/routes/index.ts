import {Request, Response, Router} from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {

    res.json({
        message: 'Welcome to node and MinIO S3',
    });
});

export default router;