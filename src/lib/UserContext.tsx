"use client";

import { User } from '@/types/User';
import { ObjectId } from 'mongoose';
import React, { ReactNode, createContext, useContext, useState } from 'react';

interface UserContextType {
    followers: any,
    follow: any,
    userSuggestion: any,
    fetchDatas: (userId: ObjectId) => void,
    followUser: (userId: ObjectId, followId: ObjectId) => void,
    unfollowUser: (userId: ObjectId, followId: ObjectId) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [userSuggestion, setUserSuggestion] = useState<User[] | null>([])
    const [followers, setFollowers] = useState<User[] | null>([])
    const [follow, setFollow] = useState<User[] | null>([])

    const fetchDatas = async (userId: ObjectId) => {
        const res = await fetch(`/api/users/suggestion?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            const data = await res.json();
            setUserSuggestion(data.randomUsers)
            setFollow(data.friends)
            setFollowers(data.followers)
        } else {
            console.error('Error fetching user data');
        }
    };

    const followUser = async (userId: ObjectId, followId: ObjectId) => {
        try {
            const response = await fetch(`/api/relations/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ followerId: userId, followingId: followId }),
            });
            if (response.ok) {
                fetchDatas(userId);
            }
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const unfollowUser = async (userId: ObjectId, followId: ObjectId) => {
        try {
            const response = await fetch(`/api/relations/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId, followId: followId
                })
            });
            if (response.ok) {
                fetchDatas(userId);
            }
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <UserContext.Provider value={{ followers, follow, userSuggestion, fetchDatas, followUser, unfollowUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within an UserProvider');
    }
    return context;
}
