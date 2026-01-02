import multer, { memoryStorage } from 'multer';

const MAX_FILE_SIZE_MB = 8;

const storage = memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE_MB * 1024 * 1024
    }
});

export default upload;
