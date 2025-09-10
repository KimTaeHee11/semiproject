const express = require('express');
const ingrePostController = require('../controllers/ingrePostController');
const multer = require('multer'); //파일업로드 모듈
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const upPath = path.join(__dirname, '..', '..', 'public', 'uploads', 'ingrePost', '');
        callback(null, upPath);
        //콜백함수에 업로드할 디렉토리 경로 전달
    },
    filename: function (req, file, callback) {
        //한글 파일 깨짐
        const encode_filename = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const filename = Date.now() + '_' + encode_filename;

        //업로드할 파일명=업로드한날짜시간정보_원본파일명
        callback(null, filename);
    },
});
const upMulter = multer({ storage });

router.post('/', upMulter.single('file'), ingrePostController.createPost);

//모든 포스트 목록 조회
router.get('/', ingrePostController.listPost);

router.get('/:id', ingrePostController.getPostById);

//글 번호로 삭제 처리
router.delete('/:id', ingrePostController.deletePost);

//글 수정 처리
router.put('/:id', upMulter.single('file'), ingrePostController.updatePost);

module.exports = router;
