require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const mongoose = require('mongoose');
const Image = require('./models/image');
// const Image = mongoose.model('image');


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads'),
    filename: (req, file, cb) => cb(null, `${uuidv4()}.${mime.extension(file.mimetype)}`)
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // 이미지 파일만 허용
        if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true);
        else cb(new Error('invalid file type.'), false);
    },
    limits: {
        // 5MB
        fileSize: 5 * 1024 * 1024
    }
});


const app = express();
const PORT = 5000;

mongoose.connect(
    process.env.MONGO_URI
).then(() => {
    // 외부로 노출시켜줄 폴더를 지정해준다.
    app.use('/uploads', express.static('uploads'));

    // upload.single("imageTest") : imageTest라는 이름의 파일을 하나만 업로드 할 수 있도록 한다.
    app.post('/images', upload.single("image"), async (req, res) => {
        const image = await new Image({
            key: req.file.filename,
            originalFileName: req.file.originalname
        }).save()
        res.json(image)
    });

    app.get('/images', async (req, res) => {
        const images = await Image.find();
        res.json(images);
    });

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}).catch((err) => console.error(err.message))


