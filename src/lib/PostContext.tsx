"use client";

import { Post } from '@/types/Post';
import { ObjectId } from 'mongoose';
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface PostContextType {
    posts: Post[],
    fetchPosts: (userId: ObjectId) => Promise<void>,
    setPosts: (posts: Post[]) => void
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async (userId: ObjectId): Promise<void> => {

        try {
            const res = await fetch(`/api/posts/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (res.ok) {
                const data: Post[] = await res.json();
                const postsWithComments: Post[] = data.map(post => ({
                    ...post,
                    showComments: false,
                    textComment: ''
                }));
                const sortedPosts = postsWithComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(sortedPosts);
            } else {
                console.error('Error fetching posts');
            }
        } catch (error) {
            console.error("Error fetching posts", error)
        }
    };

    return (
        <PostContext.Provider value={{ posts, setPosts, fetchPosts }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePostContext must be used within an PostProvider');
    }
    return context;
};