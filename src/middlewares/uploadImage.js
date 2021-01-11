import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, __dirname + "../../../public/images/avatars/")
    },
    filename: (request, file, callback) => {
        const extension = path.extname(file.originalname)
        const fileName = Date.now() + extension
        // obj.fileName = fileName
        callback(null, fileName)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (request, file, callback) => {
        if (!file.originalname.match(/\.(jpg|png|JPG|PNG|JPEG|jpeg)$/)) {
            request.error = 'Invalid Image format'
            return callback(null, false, new Error("Only images are allowed"))
        }
        callback(null, true)
    }
})

export default upload