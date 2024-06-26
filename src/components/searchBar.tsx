import { useAuth } from '@/lib/AuthContext';
import { usePostContext } from '@/lib/PostContext';
import { useUserContext } from '@/lib/UserContext';
import { User } from '@/types/User';
import { ObjectId, Schema } from 'mongoose';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

const SearchBar = () => {
    const { user } = useAuth();
    const { follow, followUser, unfollowUser } = useUserContext();
    const { fetchPosts } = usePostContext();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (query.length < 1) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const response = await fetch(`/api/users/searchUsers?query=${query}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
            setIsLoading(false);
        };

        const debounceFetch = setTimeout(fetchData, 300);
        return () => clearTimeout(debounceFetch);
    }, [query]);

    const handleFollow = async (e: React.MouseEvent<HTMLButtonElement>, userId: ObjectId) => {
        e.preventDefault();
        followUser(user?.userId, userId);
        fetchPosts(user?.userId)
    }

    const handleUnfollow = async (e: React.MouseEvent<HTMLButtonElement>, userId: ObjectId) => {
        e.preventDefault();
        unfollowUser(user?.userId, userId);
        fetchPosts(user?.userId)
    }

    return (
        <div className="relative w-full max-w-md mx-auto">
            <input
                type="text"
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && <div className="absolute top-full mt-2 w-full dark:bg-black bg-white shadow-md p-4">Loading...</div>}
            {results.length > 0 && (
                <ul className="absolute top-full mt-2 w-full dark:bg-black bg-white shadow-md z-20 rounded-md">
                    {results.map((searchedUser: User, index) => (
                        <li key={searchedUser._id.toString()} className={`p-2 ${results.length > index + 1 ? 'border-b' : 'rounded-b-md'} ${index == 0 ? 'rounded-t-md' : ''} dark:hover:bg-gray-900 hover:bg-gray-100 flex items-center justify-between`}>
                            <div className='flex items-center gap-4'>
                                <img className=" h-10 rounded-full aspect-square object-cover" src={searchedUser?.avatar} />
                                <p>@{searchedUser.username}</p>
                            </div>
                            {
                                follow.some((followItem: { _id: Schema.Types.ObjectId; }) => followItem._id === searchedUser?._id) ?
                                    <Button variant={'destructive'} onClick={(e) => handleUnfollow(e, searchedUser?._id)}>Unfollow</Button>
                                    :
                                    <Button disabled={user.userId == searchedUser._id} onClick={(e) => handleFollow(e, searchedUser?._id)}>Follow</Button>
                            }

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;