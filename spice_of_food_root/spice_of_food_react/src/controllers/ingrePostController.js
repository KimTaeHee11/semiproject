const pool = require('../config/dbPool');
const fs = require('fs');
const path = require('path');

// 글 등록
exports.createPost = async (req, res) => {
    const { name, title, ingredient_category, ingredient, content } = req.body;
    const file = req.file;
    console.log('file: ', file);
    let fileName = null;
    if (file) {
        fileName = file.filename; //실제 업로드된 파일명 => DB 저장
    }

    if (!name || !title || !ingredient_category || !ingredient) {
        return res.status(400).json({ result: 'fail', message: '필수 항목을 입력해야 해요' });
    }
    try {
        const sql = `insert into recipePosts(name,title,ingredient_category,ingredient,content,attach)
                    values(?,?,?,?,?,?)`;

        const [result] = await pool.query(sql, [name, title, content, ingredient_category, ingredient, fileName]);
        if (result.affectedRows > 0) {
            return res.status(201).json({ result: 'success', message: `글 등록 성공 글번호: ${result.insertId}` });
        }
        res.json({ result: 'fail', message: '글 등록 실패' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
    }
};
// 리스트
exports.listPost = async (req, res) => {
    let page = parseInt(req.query.page) || 1; //현재 보여줄 페이지 번호
    const size = parseInt(req.query.size) || 3; //한 페이지 당 보여줄 목록 개수
    console.log('page: ', page, 'size: ', size);

    try {
        //1. 전체 게시글 수 가져오기
        const sql = `select count(id) count from ingrePosts`;
        const [[{ count }]] = await pool.query(sql);
        // console.log('result: ', result[0][0].count); //result=[ [ { count: 9 } ], [ `count` BIGINT(21) NOT NULL ] ]
        console.log('count: ', count);

        // 1_2. 총 페이지 수 구하기
        let totalPages = Math.ceil(count / size);
        if (totalPages === 0) totalPages = 1; //////////////////추가 부분

        if (page < 1) {
            page = 1; //디폴트 페이지: 1페이지로 설정
        }
        if (page > totalPages) {
            page = totalPages; //마지막 페이지 보여주도록 설정
        }

        const offset = (page - 1) * size; //DB에서 데이터 끊어올 때 시작값

        //2. 전체 게시목록 가져오기
        const sql2 = `select id,name,title,ingredient_category,ingredient,content,
        attach as file, date_format(wdate,'%Y-%m-%d') as wdate
        from ingrePosts order by id desc limit ? offset ?`; //limit ?,? ==> [offset, size]
        const [posts] = await pool.query(sql2, [size, offset]);
        console.log('posts: ', posts);

        //응답 { data:[{},{}], totalCount:10}
        res.json({ data: posts, totalCount: count, totalPages, page, size });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
    }
};

// 글 조회
exports.getPostById = async (req, res) => {
    const { id } = req.params;
    console.log('id: ', id);
    try {
        const sql = `select id,title,ingredient_category,ingredient,content,name, attach as file,
            date_format(wdate,'%Y-%m-%d %H:%i:%s') wdate
            from ingrePosts where id=?`;

        const [rows] = await pool.query(sql, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ result: 'fail', message: '해당 Post글이 존재하지 않습니다' });
        }
        console.log('rows: ', rows);

        res.json({ data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
    }
};

// 글 삭제
exports.deletePost = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ result: 'fail', message: '잘못된 요청입니다' });
    }
    try {
        //1. 해당 게시글의 첨부파일명을 가져와서
        const sql = `select attach as file from ingrePosts where id=?`;
        const [result] = await pool.query(sql, [id]);
        if (result.length === 0) {
            return res.status(404).json({ result: 'fail', message: '해당 글은 존재하지 않습니다' });
        }
        const data = result[0];
        let filePath = null;
        if (data.file) {
            filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'ingrePost', data.file);
        }
        console.log('filePath: ', filePath);

        //2. DB에서 해당 글 삭제 처리
        const sql2 = `delete from ingrePosts where id=?`;
        const [result2] = await pool.query(sql2, [id]);
        if (result2.affectedRows === 0) {
            return res.status(404).json({ result: 'fail', message: '해당 글은 존재하지 않습니다' });
        }
        //3. 첨부파일이 있다면 서버 uploads폴더에서 해당 파일 삭제 처리
        if (fs.existsSync(filePath)) {
            console.log('***********');
            fs.unlinkSync(filePath); //파일을 동기방식으로 삭제하는 함수. 비동기: fs.unlik()
        }
        res.json({ result: 'success', message: `${id}번 글을 삭제했습니다` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
    }
};

// 글 수정
exports.updatePost = async (req, res) => {
    const { id } = req.params;
    //수정할 글 내용
    const { name, title, ingredient, ingredient_category, content } = req.body;
    const file = req.file; //새로 수정처리할 첨부파일
    let fileName = file?.filename; //새로 업로드한 파일명: 시간정보_파일명

    let filePath = null; //예전 첨부파일 경로 담을 예정
    try {
        //1.새로 업로드한 파일이 있다면 글번호로 예전에 첨부했던 파일명 가져오기
        if (file) {
            const sql = `select attach as file from ingrePosts where id=?`;

            const [result] = await pool.query(sql, [id]);
            if (result.length === 0) {
                return res.status(404).json({ result: 'fail', message: '해당 글은 없습니다' });
            }
            const data = result[0];

            if (data.file) {
                filePath = path.join(__dirname, '..', '..', 'public', 'uploads', 'ingrePost', data.file);
                //예전에 첨부했던 파일이름을 절대경로로 만들자
            }
        } //if----------------
        //2. DB에서 해당 글 수정 처리-update문 수행
        let sql2 = `update ingrePosts set name=?,title=?,ingredient_category=?,ingredient=?,content=? `;

        const params = [name, title, ingredient_category, ingredient, content];

        if (file) {
            sql2 += `, attach=? `;
            params.push(fileName);
        }
        sql2 += ` where id=?`;
        params.push(id);
        console.log('sql2: ', sql2);
        console.log('params: ', params);
        const [result2] = await pool.query(sql2, params);
        if (result2.affectedRows === 0) {
            return res.status(404).json({ result: 'fail', message: '해당 글이 없습니다' });
        }

        //3. 1번에서 가져온 예전 첨부파일명이 있다면 => 삭제 처리
        if (filePath && fs.existsSync(filePath)) {
            console.log('>>>파일 삭제 처리 중<<<');
            fs.unlinkSync(filePath); //기존 첨부파일 삭제 처리
        }
        res.json({ result: 'success', message: `${id}번 Post글 수정처리 완료` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: 'error', message: error.message });
    }
};

// 레시피 데이터로 부터 관련된 재료 정보 검색
// 레시피의 재료로부터 재료 카테고리 검색
// 재료 전체로 부터 세부 재료 카테고리 seach -> 재료 카테고리 search -> join 실행
