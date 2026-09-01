import multer from "multer";

// Don't save the uploaded image as a file on my server. Keep it temporarily in memory.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

export default upload;