import React from 'react';
import IngrePostEdit from '../components/ingrePosts/IngrePostEdit';
import IngrePostForm from '../components/ingrePosts/IngrePostForm';
import IngrePostList from '../components/ingrePosts/IngrePostList';
import IngrePostView from '../components/ingrePosts/IngrePostView';
import { Routes, Route } from 'react-router-dom';

export default function PostApp() {
    return (
        <div className='container'>
            <div className='row my-4'>
                <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
                    <Routes>
                        <Route path='/ingrePostEdit' element={<IngrePostEdit />} />
                        <Route path='/ingrePostForm' element={<IngrePostForm />} />
                        <Route path='/ingrePostView' element={<IngrePostView />} />
                    </Routes>
                </div>
            </div>

            <div className='row my-4'>
                <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
                    <IngrePostList />
                </div>
            </div>
        </div>
    );
}
