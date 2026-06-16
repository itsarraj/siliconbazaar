import multer from "multer";

// This is for local storage file saving in uploads folder
//
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, req.user.id + "-" + Date.now() + "-" + file.originalname);
//   },
// });

// This is for memory storage where image is saved in memory
//
const storage = multer.memoryStorage();

// Remove image filter to allow svg and other file format to be uploaded
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  // fileFilter: fileFilter,
});

export default upload;
