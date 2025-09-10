import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { useRecipePostFormStore } from '../../stores/recipePostFormStore';
import { useRecipePostStore } from '../../stores/recipePostStore';
import { apiCreatePostFileUp } from '../../api/recipePostApi';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function IngrePostForm() {
    const { formData, setFormData, resetFormData } = useRecipePostFormStore();
    const fetchPostList = useRecipePostStore((s) => s.fetchPostList);
    const authUser = useAuthStore((s) => s.authUser);

    useEffect(() => {
        if (authUser) {
            setFormData({ name: authUser.email });
        }
    }, [authUser]);

    const titleRef = useRef();
    const recipe_nameRef = useRef();
    const ingredientsRef = useRef();
    const navigate = useNavigate();

    const handleChange = (e) => {
        console.log('>>>', e.target.value);

        const { name, value } = e.target;
        setFormData({ [name]: value });
    };
    const handleFileChange = (e) => {
        //  첨부파일
        console.log(e.target.files); //FileList{0:File, length:1}
        if (e.target.files && e.target.files.length > 0) {
            setFormData({ file: e.target.files[0] }); //File객체로 할당
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!authUser || !formData.name) {
                alert('로그인해야 이용 가능합니다');
                return;
            }

            // const result = await apiCreatePost(formData); //파일업로드 하지 않는 경우
            //---------------------
            //파일업로드 하는 경우==> FormData객체에 데이터를 담아서 전송해야 한다
            const data = new FormData();
            data.append('name', formData.name);
            data.append('title', formData.title);
            data.append('recipe_name', formData.recipe_name);
            data.append('ingredients', formData.ingredients);
            data.append('content', formData.content);
            if (formData.file) {
                data.append('file', formData.file);
                console.log('formData.file: ', formData.file);
            }
            // for (let i = 0; i < 10; i++) {
            const result = await apiCreatePostFileUp(data);
            // }
            //alert(JSON.stringify(result));
            //전체 글목록 새로고침
            resetFormData();
            titleRef.current?.focus();

            navigate(`/recipePosts`);
            await fetchPostList();
        } catch (error) {
            console.error(error);
            alert('서버 요청 중 에러 발생: ' + error.message);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        name='name'
                        onChange={handleChange}
                        value={authUser?.email ?? ''}
                        placeholder={authUser?.email ?? '로그인해야 이용 가능해요'}
                    />
                </Form.Group>
                <Form.Group controlId='title'>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type='text'
                        name='title'
                        ref={titleRef}
                        onChange={handleChange}
                        value={formData.title}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='recipe_name'>
                    <Form.Label>레시피명</Form.Label>
                    <Form.Control
                        type='text'
                        name='recipe_name'
                        ref={recipe_nameRef}
                        onChange={handleChange}
                        value={formData.recipe_name}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='ingredients'>
                    <Form.Label>재료</Form.Label>
                    <Form.Control
                        type='text'
                        name='ingredients'
                        ref={ingredientsRef}
                        onChange={handleChange}
                        value={formData.ingredients}
                        required
                    />
                </Form.Group>
                <Form.Group controlId='content'>
                    <Form.Label>Content</Form.Label>
                    <Form.Control as='textarea' name='content' onChange={handleChange} value={formData.content} />
                </Form.Group>
                <Form.Group controlId='file'>
                    <Form.Label>File</Form.Label>
                    <Form.Control type='file' onChange={handleFileChange} />
                </Form.Group>
                <div className='text-center'>
                    <Button variant='primary' type='submit' className='my-2'>
                        글등록하기
                    </Button>
                </div>
            </Form>
        </>
    );
}
