import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";


// ✅ Cấu hình Cloudinary bằng biến môi trường
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Cấu hình storage cho multer + cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "user_avatars",
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: file.originalname.split(".")[0] + "_" + Date.now(), // đặt tên ảnh dễ quản lý
  }),
});

// ✅ Giới hạn dung lượng file & kiểm tra định dạng
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Chỉ chấp nhận file ảnh JPG hoặc PNG!");
      error.status = 400;
      return cb(error, false);
    }
    cb(null, true);
  },
});

// ✅ Xử lý lỗi upload (middleware)
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Lỗi của multer
    return res.status(400).json({ message: "Lỗi upload file: " + err.message });
  } else if (err) {
    // Lỗi khác
    return res.status(err.status || 500).json({ message: err.message });
  }
  next();
};

export default upload;
