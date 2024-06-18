"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { Post } from "@/types/Post";
import { User } from "@/types/User";
import Cookies from 'js-cookie';
import { CirclePlus, MessageCircle, Share, ThumbsUp, Trash2 } from 'lucide-react';
import { ObjectId } from "mongoose";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [userSuggestion, setUserSuggestion] = useState<User[] | null>([])

  const [postValue, setPostValue] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [relationUpdated, setRelationUpdated] = useState(false);

  const [followers, setFollowers] = useState<User[] | null>([])
  const [follow, setFollow] = useState<User[] | null>([])

  // Recuperation données utilisateur 
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const res = await fetch(`/api/users/${user.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDataUser(data);
        } else {
          console.error('Error fetching user data');
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Recuperation des follow, followers, posts
  useEffect(() => {

    const fetchAllUserData = async () => {
      const res = await fetch(`/api/users/suggestion?userId=${dataUser?._id}`, {
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

    if (dataUser?._id) {
      fetchAllUserData();
    }
  }, [dataUser, relationUpdated]);

  // Recuperation des posts 
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        return;
      }

      const res = await fetch(`/api/posts/${user.userId}`, {
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
    };

    fetchPosts();
  }, [user, relationUpdated]);

  // Affichage section commentaire 
  const toggleComments = (postId: string) => {
    setPosts(posts.map(post =>
      post._id.toString() === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  // Créer post 
  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: dataUser?._id, text: postValue, images: [] }),
    });

    if (res.ok) {
      const data: Post = await res.json();
      setPosts([data, ...posts]);
      setIsDialogOpen(false);
      setPostValue('')
    } else {
      console.error('Error logging in');
    }
  };

  // Changement commentaire 
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>, postId: string) => {
    const { value } = e.target;
    setPosts(posts.map(post =>
      post._id.toString() === postId ? { ...post, textComment: value } : post
    ));
  };

  // Ajout ami
  const handleRelation = async (e: React.MouseEvent<HTMLButtonElement>, followingId: string) => {
    e.preventDefault();
    const res = await fetch('/api/relations/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ followerId: dataUser?._id, followingId: followingId }),
    });

    if (res.ok) {
      const data = await res.json();
      setRelationUpdated(prev => !prev)
    } else {
      console.error('Error logging in');
    }
  };

  // Ajout commentaire 
  const handleCommentPost = async (e: React.FormEvent<HTMLFormElement>, postId: string) => {
    e.preventDefault();
    const post = posts.find(post => post._id.toString() === postId);
    if (!post || !post.textComment.trim()) return;

    const res = await fetch('/api/comments/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: dataUser?._id,
        postId: postId,
        text: post.textComment,
        likes: []
      }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setPosts(posts.map(post =>
        post._id.toString() === postId ? { ...post, comments: [newComment, ...post.comments], textComment: '' } : post
      ));
    } else {
      console.error('Error submitting comment.')
    }
  }

  // Ajout like 
  const handleLikePost = async (e: React.MouseEvent<HTMLDivElement>, postId: string) => {
    e.preventDefault();

    if (!dataUser?._id) {
      console.error('User ID is undefined');
      return;
    }

    const postIndex = posts.findIndex(post => post._id.toString() === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];



    if (post.likes.includes(dataUser?._id)) {
      setPosts(posts.map(post =>
        post._id.toString() === postId ? {
          ...post,
          likes: post.likes.filter(userId => userId.toString() !== dataUser._id.toString())
        } : post
      ));
    } else {
      const updatedPosts = [...posts];
      updatedPosts[postIndex] = {
        ...post,
        likes: [...post.likes, dataUser._id]
      };
      setPosts(updatedPosts);
    }

    try {
      const res = await fetch('/api/posts/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: dataUser._id,
          postId: postId
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to like post');
      }

      const updatedPost = await res.json();

      setPosts(posts.map(post =>
        post._id.toString() === postId ? updatedPost : post
      ));
    } catch (error) {
      console.error('Error submitting like:', error);

      setPosts(posts.map(post =>
        post._id.toString() === postId ? {
          ...post,
          likes: post.likes.filter(userId => userId.toString() !== dataUser._id.toString())
        } : post
      ));
    }
  };

  // Suppression post 
  const handlePostDelete = async (e: React.MouseEvent<SVGSVGElement>, postId: string) => {

    e.preventDefault()
    const post = posts.find(post => post._id.toString() === postId);
    if (!post) return;
    const res = await fetch('/api/posts/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify({
        postId: postId,
        flag: false
      })
    })
    if (res.ok) {
      toast({
        title: "Suppression réussie."
      })
      setPosts(prev => prev.filter(post => post._id.toString() !== postId))
    } else {
      console.error('Error deleting post.')
    }
  }

  // Suppression commentaire 
  const handleCommentDelete = async (e: React.MouseEvent<HTMLButtonElement>, followId: ObjectId) => {

    e.preventDefault()
    const res = await fetch('/api/relations/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: dataUser?._id, followId: followId
      })
    })
    if (res.ok) {
      console.log('Unfollow sucessfully');
      setFollow(prev => prev && prev.filter(follow => follow._id.toString() !== followId.toString()))
      setRelationUpdated(prev => !prev)

    } else {
      console.error('Error deleting post.')
    }
  }

  function calculateHoursElapsed(timestamp: string): string {
    const pastDate = new Date(timestamp);
    const currentDate = new Date();
    const differenceInMilliseconds = currentDate.getTime() - pastDate.getTime();

    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    if (differenceInMinutes >= 60 * 48) {
      return Math.floor((differenceInMinutes) / (24 * 60)).toString() + " days ago";
    } else if (differenceInMinutes >= 60 * 24) {
      return Math.floor((differenceInMinutes) / (24 * 60)).toString() + " day ago";
    } else if (differenceInMinutes >= 60) {
      return Math.floor(differenceInMinutes / 60).toString() + " hours ago";
    } else if (differenceInMinutes >= 2) {
      return Math.floor(differenceInMinutes).toString() + " minutes ago";
    } else {
      return "Now";
    }
  }

  return (
    <section className="h-min flex justify-center">
      {/* Main card */}
      <div className=" w-11/12 my-10 h-min flex flex-col items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className=" rounded-full aspect-square h-14"><CirclePlus /></Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Say something to your friends.</DialogTitle>
              <DialogDescription>
                Add a post would be visible by all your followers.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePost}>
              <Textarea value={postValue} onChange={(e) => setPostValue(e.target.value)} className="w-full" placeholder="Your message here." />
              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <div className="flex gap-3 p-2 relative w-full">
          {/* Left card */}
          <Card className=" max-md:hidden w-1/5 h-min p-2 flex flex-col justify-center items-center gap-2 aspect-square">
            <div className="flex items-center flex-col gap-2">
              <img className=" h-16 rounded-full aspect-square object-cover" src={dataUser?.avatar} />
              <h2 className=" font-thin">@{dataUser?.username}</h2>
              <div className="flex gap-2">
                <p className="flex flex-col items-center">{followers ? followers.length : 0} <span className="text-xs">followers</span></p>
                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <p className="flex flex-col items-center">{follow ? follow.length : 0} <span className=" text-xs">follow</span></p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="md:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Your follows.</DialogTitle>
                      <DialogDescription className="flex flex-col">
                        {follow && follow.map((follow: User) => (
                          <div key={follow._id.toString()} className=" h-20 flex items-center justify-between border-b-2 p-2">
                            <div className="h-full flex items-center gap-2">
                              <img className="h-full rounded-full aspect-square object-cover" src={follow?.avatar} />
                              <span>@{follow?.username}</span>
                            </div>
                            <div className="group">
                              <Button className="group-hover:hidden w-24" variant={"secondary"}>Follow</Button>
                              <Button className="hidden group-hover:block w-24" variant={"secondary"} onClick={(e) => handleCommentDelete(e, follow?._id)}>Unfollow</Button>
                            </div>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
          {/* Middle card */}
          <div className="max-md:w-full z-10 w-3/5 h-full flex flex-col gap-4 overflow-auto">
            {/* <CardTitle className=" text-center py-2">Your friend's posts</CardTitle> */}
            {/* Card post */}
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card className="pt-6 relative" key={post._id.toString()}>
                    <CardTitle className="px-6">
                      {post.userId._id == dataUser?._id ?
                        <Trash2 onClick={(e) => handlePostDelete(e, post._id.toString())} className=" absolute right-10" />
                        : ''}
                      <div className="flex items-center gap-3">
                        <img className=" h-8 rounded-full aspect-square object-cover" src={post.userId.avatar} />
                        <div>
                          <p className=" text-sm">@{post.userId.username}</p>
                          <p className="text-sm font-thin">{calculateHoursElapsed(post.createdAt)}</p>
                        </div>
                      </div>
                    </CardTitle>
                    <CardContent className="p-0 px-6">
                      <p className="p-0 font-thin mt-3">{post.text}</p>
                      <div className="w-full flex justify-around border-t-2 py-3 mt-6">
                        <p className="flex items-center justify-center gap-2">
                          {post.likes.length}
                          <ThumbsUp />
                        </p>
                        <p className="flex items-center justify-center gap-2">
                          {post.comments.length}
                          <MessageCircle />
                        </p>
                        <p className="flex items-center justify-center gap-2">
                          4
                          <Share />
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col w-full p-0 border-t-2">
                      <div className="w-full flex justify-around px-0">
                        <div onClick={(e) => handleLikePost(e, post._id.toString())} className={`${dataUser && post.likes.includes(dataUser?._id) ? 'text-primary' : ''} hover:text-accent text-center w-1/3 p-3 flex items-center justify-center gap-2`} >
                          <ThumbsUp />
                          <p className="max-md:hidden">Like</p>
                        </div>
                        <div onClick={() => toggleComments(post._id.toString())} className=" hover:text-accent text-center w-1/3 p-3 flex items-center justify-center gap-2">
                          <MessageCircle />
                          <p className="max-md:hidden">Comment</p>
                        </div>
                        <div className=" hover:text-accent text-center w-1/3 p-3 flex items-center justify-center gap-2">
                          <Share />
                          <p className="max-md:hidden">Share</p>
                        </div>
                      </div>
                      <div className={`w-full ${post.showComments ? '' : 'hidden'}`}>
                        <form className="flex p-2 gap-2" onSubmit={(e) => handleCommentPost(e, post._id.toString())}>
                          <Input
                            className="w-5/6"
                            placeholder="Type your comment here..."
                            value={post.textComment}
                            onChange={(e) => handleCommentChange(e, post._id.toString())}
                          />
                          <Button className="w-1/6" type="submit">Send</Button>
                        </form>
                        <div>
                          {post.comments.map((comment, index) => (
                            <div className={`p-6 ${index < post.comments.length - 1 ? 'border-b-2' : ''}`} key={comment._id.toString()}>
                              <div className="flex items-center gap-3">
                                <img className=" h-8 rounded-full aspect-square object-cover" src={comment.userId.avatar} />
                                <div>
                                  <p className=" text-sm">@{comment.userId.username}</p>
                                  <p className="text-sm font-thin">{calculateHoursElapsed(comment.createdAt)}</p>
                                </div>
                              </div>
                              <p className="p-0 font-thin mt-3">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <>
                  <h2>Nothing there. Add friends or posts your first message!</h2>
                </>
              )}
            </>
          </div>
          {/* Right card */}
          <div className=" max-md:hidden w-1/5 h-min flex flex-col gap-2 items-center">
            {userSuggestion && userSuggestion.length > 0 ? (userSuggestion?.map((user: User) => (
              user._id !== dataUser?._id ? (
                <Card key={user._id.toString()} className=" w-full aspect-square flex justify-center p-2 flex-col items-center gap-4">
                  <div className="flex items-center flex-col">
                    <img className=" h-16 rounded-full aspect-square object-cover" src={user?.avatar} />
                    <h2 className=" font-thin">@{user.username}</h2>
                  </div>
                  <Button onClick={(e) => handleRelation(e, user._id.toString())}>Follow</Button>
                </Card>
              ) : ''
            ))) : ''}
          </div>
        </div>
      </div >
    </section >
  );
}
