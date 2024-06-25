import React from 'react';
import {
    BrowserRouter,
    Route,
    Routes
} from 'react-router-dom';

import Navbar from './app/navbar';
import AddPostForm from './features/posts/addPostForm';
import PostsList from './features/posts/postsList';
import EditPostForm from './features/posts/editPostForm';
import SinglePostPage from './features/posts/singlePostPage';

function Root() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/"
                    element = {
                        <React.Fragment>
                            <AddPostForm />
                            <PostsList />
                        </React.Fragment>
                    }
                />
                <Route path="/editPost/:postId" element={<EditPostForm />} />
                <Route path="/posts/:postId" element={<SinglePostPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Root;