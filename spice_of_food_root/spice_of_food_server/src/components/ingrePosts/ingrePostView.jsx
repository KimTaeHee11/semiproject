import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIngrePostStore } from '../../stores/ingrePostStore';
import { useAuthStore } from '../../stores/authStore';
import { useEffect } from 'react';
import { apiFetchPostList } from '../../api/ingrePostApi'

export default function IngrePostView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const authUser = useAuthStore((s) => s.authUser);

    const deletePost = useIngrePostStore((s) => s.deletePost);

    const post = useIngrePostStore((s) => s.post);
    const fetchPostById = useIngrePostStore((s) => s.fetchPostById);
    const postErr = useIngrePostStore((s) => s.postErr);
    const resetPostErr = useIngrePostStore((s) => s.resetPostErr);

    const fetchPostList = useIngrePostStore((s) => s.fetchPostList);

    useEffect(() => {
        if (id) fetchPostList (id);
    }, []);

    useEffect(() => {
        if (postErr) {
            alert(postErr);
            resetPostErr();
            navigate('/ingrePosts');
        }
    }, [postErr]);

    const handleDelete = async (pid, e) => {
        //alert(pid + '/' + e);
        if (authUser?.email !== post.name) {
            e.preventDefault();
            alert('작성자만 삭제 가능합니다');
            return;
        }

        // ////////////// 인증용 pw 입력 로직 추가 고려{ 해당페이지 말고 수정/ 삭제 페이지에서 수행
        //     alert('인증 실패');
        //     return;
        // }

        const yn = confirm(`${pid}번 글을 정말 삭제할까요?`);
        if (!yn) return;
        //
        const result = await deletePost(pid);
        if (result) {
            alert('글이 삭제되었습니다');
            // await fetchPostList();
            navigate('/ingrePosts');
        } else {
            alert('글 삭제 실패');
        }
        // await fetchPostList();
    };

    const go = (e) => {
        if (authUser?.email !== post.name) {
            e.preventDefault();
            alert('작성자만 수정 가능합니다');
        }
    };

    if (!post)
        return (
            <div className='text-center'>
                <h3>Loading ....</h3>
            </div>
        );

    return (
        <div className='post-view'>
            <div className='row my-3'>
                <div className='col-md-10 offset-md-1 px-3'>
                    <h1 className='my-5 text-center'>Post View [No. {id}] </h1>

                    <div className='text-end my-2'>
                        <Link to={`/ingrePosts/ingrePostEdit/${id}`} onClick={go}>
                            <button className='btn btn-info mx-2'>수정</button>
                        </Link>

                        <button className='btn btn-danger' onClick={(e) => handleDelete(id, e)}>
                            삭제
                        </button>
                    </div>

                    <div className='card'>
                        <div className='card-body'>
                            <h5>
                                [{post.id}] {post.title}{' '}
                            </h5>
                            <hr />
                            <div style={{ marginBottom: '1rem' }} className='text-center'>
                                <img
                                    src={`http://localhost:7777/uploads/ingrePost/${post.file ?? 'noimage.jpg'}`}
                                    alt={`${post.file ?? 'noimage'}`}
                                    style={{ maxWidth: '100%', borderRadius: '0.5rem' }}
                                />
                            </div>
                            <div>
                                <h6>{post.ingredient_category}</h6>
                                <p>{post.ingredient}</p>
                            </div>
                            <div className='cArea px-5'>
                                {post.content}
                                <br />
                                {/* <span>♡</span> <span>👎</span> */}
                            </div>
                        </div>
                        <div className='card-footer'>
                            Created on [{post.wdate}] by {post.name}
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className='row my-5'>
                <div className='col px-5 text-center'>
                    <button className='btn mt-4 btn-secondary' onClick={() => navigate('/ingrePosts')}>
                        Post List 전체 출력
                    </button>
                    <h3 className='mt-5'>댓글영역</h3>
                </div>
            </div>

            <div className='row my-5'>
                <div className='col px-5'>
                    <h3 className='mt-4'>댓글추가</h3>
                </div>
            </div>

            <div className='row my-5'>
                <div className='col px-5'>댓글 수정 폼</div>
            </div> */}
        </div>
    );
}
