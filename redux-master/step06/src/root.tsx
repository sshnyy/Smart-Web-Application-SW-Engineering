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
import NotificationsList from './features/notifications/notificationsList';
import SinglePostPage from './features/posts/singlePostPage';
import UsersList from './features/users/usersList';
import UserPage from './features/users/userPage';

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
                <Route path="/notifications" element={<NotificationsList />} />
                <Route path="/posts/:postId" element={<SinglePostPage />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/users/:userId" element={<UserPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Root;