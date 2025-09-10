import React from 'react';
import { useRecipePostStore } from '../../stores/recipePostStore';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function RecipePostList() {
    const postList = useRecipePostStore((s) => s.postList);
    const totalCount = useRecipePostStore((s) => s.totalCount);
    const fetchPostList = useRecipePostStore((s) => s.fetchPostList);
    const totalPages = useRecipePostStore((s) => s.totalPages);
    const setPage = useRecipePostStore((s) => s.setPage);
    const page = useRecipePostStore((s) => s.page);

    useEffect(() => {
        fetchPostList();
    }, [page]);

    const blockSize = 5;
    const startPage = Math.floor((page - 1) / blockSize) * blockSize + 1;
    const endPage = Math.min(startPage + (blockSize - 1), totalPages);

    return (
        <div className='post-list'>
            <div className='text-end mb-3'>
                <Button
                    as={Link}
                    to={`/recipePosts/recipePostForm`}
                    variant='outline-dark' // 테두리와 글자는 검정, 배경은 투명(흰색)
                    size='sm' // 버튼 크기 작게
                >
                    글쓰기
                </Button>
            </div>

            <div className='text-center my-4'>{postList.length === 0 && <div>자료가 없습니다</div>}</div>
            {postList.length > 0 &&
                postList.map((post, index) => (
                    <div
                        className='my-3'
                        key={post.id ?? index}
                        style={{ backgroundColor: '#efefef', borderRadius: '10px', display: 'flex' }}
                    >
                        <div style={{ width: '30%' }} className='text-center'>
                            {post.file ? (
                                <img
                                    src={`http://localhost:7777/uploads/recipePost/${post.file}`}
                                    alt={post.file}
                                    style={{ width: '90%' }}
                                    className='img-thumbnail'
                                />
                            ) : (
                                <img
                                    src={`http://localhost:7777/uploads/recipePost/noimage.jpg`}
                                    alt={post.file ?? 'noimage'}
                                    style={{ width: '90%' }}
                                    className='img-thumbnail'
                                />
                            )}
                        </div>
                        <div style={{ width: '70%' }} className='p-3'>
                            <h5>
                                {post.name} {'   '}
                                <small>
                                    <i className='text-muted'>Posted on {post.wdate}</i>
                                </small>
                            </h5>
                            <Link to={`/recipePosts/recipePostView/${post.id}`} style={{ textDecoration: 'none' }}>
                                <h3>{post.title}</h3>
                            </Link>

                            {/* <p>{post.content}</p> */}
                            {/* <div className="d-flex justify-content-center">
                                <button className="btn btn-outline-info mx-1">Edit</button>
                                <button className="btn btn-outline-danger" onClick={() => handleDelete(post.id)}>
                                    Delete
                                </button>
                            </div> */}
                        </div>
                    </div>
                ))}
            {/* 페이지네이션 */}
            <div className='text-center'>
                {startPage > 1 && (
                    <button className='btn btn-outline-primary' onClick={() => setPage(startPage - 1)}>
                        Prev
                    </button>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((n) => (
                    <button
                        className={`mx-1 btn ${n === page ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPage(n)}
                    >
                        {n}
                    </button>
                ))}
                {endPage < totalPages && (
                    <button className='btn btn-outline-primary' onClick={() => setPage(endPage + 1)}>
                        Next
                    </button>
                )}
            </div>
            <h6 className='my-3 text-center'>
                {' '}
                총 게시글 수: {totalCount} 개 {'     '} {page} page / {totalPages} pages
            </h6>
        </div>
    );
}
