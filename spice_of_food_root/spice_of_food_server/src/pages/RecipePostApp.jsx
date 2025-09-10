import React from 'react';
import RecipePostEdit from '../components/recipePosts/RecipePostEdit';
import RecipePostForm from '../components/recipePosts/recipePostForm';
import RecipePostList from '../components/recipePosts/recipePostList';
import RecipePostView from '../components/recipePosts/RecipePostView';
import { Routes, Route } from 'react-router-dom';

export default function PostApp() {
    return (
        <div className='container'>
            <div className='row my-4'>
                <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
                    <Routes>
                        <Route path='/recipePostEdit/:id' element={<RecipePostEdit />} />
                        <Route path='/recipePostForm' element={<RecipePostForm />} />
                        <Route path='/recipePostView/:id' element={<RecipePostView />} />
                    </Routes>
                </div>
            </div>

            <div className='row my-4'>
                <div className='col-md-8 offset-md-2 col-sm-10 offset-sm-1'>
                    <RecipePostList />
                </div>
            </div>
        </div>
    );
}
