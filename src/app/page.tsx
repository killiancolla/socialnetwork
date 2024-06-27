"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import { usePostContext } from "@/lib/PostContext";
import { useUserContext } from "@/lib/UserContext";
import { Post } from "@/types/Post";
import { User } from "@/types/User";
import Cookies from 'js-cookie';
import { ChevronDown, MessageCircle, Minus, Plus, ThumbsUp, Trash2 } from 'lucide-react';
import { ObjectId } from "mongoose";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const { user } = useAuth();
  const { posts, setPosts, fetchPosts } = usePostContext();
  const { followers, follow, userSuggestion, fetchDatas, followUser, unfollowUser } = useUserContext();

  const [dataUser, setDataUser] = useState<User | null>(null);

  const [postValue, setPostValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [relationUpdated, setRelationUpdated] = useState(false);
  const [isDropDown, setIsDropDown] = useState(false);

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingFriends, setIsLoadingFriends] = useState(true);


  // Recuperation données utilisateur 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/users/${user.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setDataUser(data);
        setIsLoadingUser(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      try {
        fetchDatas(user?.userId).then(() => {
          setIsLoadingFriends(false)
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [relationUpdated, user])

  // Recuperation des posts 
  useEffect(() => {
    if (user) {
      try {
        fetchPosts(user?.userId).then(() => {
          setIsLoadingPost(false);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [user, relationUpdated]);

  // Affichage section commentaire 
  const toggleComments = (postId: string) => {
    setPosts(posts.map(post =>
      post._id.toString() === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

  // Créer post 
  const handlePost = async (e: React.FormEvent<HTMLButtonElement>) => {
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
  const handleRelation = async (e: React.MouseEvent<HTMLButtonElement>, followingId: ObjectId) => {
    e.preventDefault();
    followUser(user?.userId, followingId);
    setRelationUpdated(prev => !prev)
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
      setPosts(posts.filter(post => post._id.toString() !== postId))
    } else {
      console.error('Error deleting post.')
    }
  }

  // Suppression relation 
  const handleRelationDelete = async (e: React.MouseEvent<HTMLButtonElement>, followId: ObjectId) => {

    e.preventDefault()
    unfollowUser(user?.userId, followId);
    setRelationUpdated(prev => !prev)
  }

  // Suppression commentaire
  const handleCommentDelete = async (e: React.MouseEvent<SVGSVGElement>, postId: ObjectId, commentId: ObjectId) => {

    e.preventDefault()
    const res = await fetch('/api/comments/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Cookies.get('token')}`
      },
      body: JSON.stringify({
        commentId: commentId, flag: false
      })
    })
    if (res.ok) {
      setPosts(posts.map(post =>
        post._id.toString() === postId.toString()
          ? { ...post, comments: post.comments.filter(comment => comment._id.toString() !== commentId.toString()) }
          : post
      ));
    } else {
      console.error('Error deleting comment.')
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

  if (isLoadingFriends || isLoadingPost || isLoadingUser) {
    return (
      <Loading />
    )
  }

  return (
    <section className="h-min flex justify-center">
      {/* Main card */}
      <div className=" w-11/12 my-10 h-min flex flex-col items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} defaultOpen>
          <DialogTrigger asChild>
            <Button variant="outline"><Plus className="mr-2" />Add Post</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Post</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="What's on your mind?"
                className="resize-none"
                value={postValue}
                onChange={(e) => setPostValue(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePost}>Post</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="max-md:flex-col flex gap-4 p-2 w-full relative">
          {/* Left card */}
          <div className="max-md:w-full w-1/3 h-min flex flex-col gap-4">
            <Card className={`md:hidden max-md:${isDropDown ? 'hidden' : ''} p-4 flex flex-row justify-around items-center gap-2 md:aspect-square`}>
              <Image
                height={1000}
                width={1000}
                alt="logo"
                priority={true}
                className=" h-20 w-20 rounded-full object-cover"
                src={dataUser?.avatar ?? ""}
              />
              <div className="flex flex-col">
                <h2 className="mt-2 font-medium">{dataUser?.name} {dataUser?.surname}</h2>
                <h2 className=" font-thin">@{dataUser?.username}</h2>
              </div>
              <ChevronDown onClick={() => setIsDropDown(true)} />
            </Card>
            <Card className={`relative max-md:${isDropDown ? '' : 'hidden'} p-10 flex flex-col justify-center items-center gap-2 md:aspect-square`}>
              <Minus onClick={() => setIsDropDown(false)} className="absolute top-5 right-5 md:hidden" />
              <div className="flex items-center flex-col">
                <Image
                  height={1000}
                  width={1000}
                  alt="logo"
                  priority={true}
                  className=" rounded-full object-cover aspect-square w-3/5"
                  src={dataUser?.avatar ?? ""}
                />
                <h2 className="mt-2 font-medium">{dataUser?.name} {dataUser?.surname}</h2>
                <h2 className=" font-thin">@{dataUser?.username}</h2>
                <div className="flex gap-10 mt-6">
                  <Dialog modal={!(followers.length == 0)}>
                    <DialogTrigger asChild>
                      <div>
                        <p className={`flex flex-col items-center ${followers.length == 0 ? '' : 'hover:text-slate-500'}`}><span className=" text-2xl font-bold">{followers ? followers.length : 0}</span><span className="font-thin">Followers</span></p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className={`md:max-w-[425px] ${followers.length == 0 ? 'hidden' : ''}`}>
                      <DialogHeader>
                        <DialogTitle>Your followers</DialogTitle>
                        <DialogDescription className="flex flex-col">
                          {followers && followers.map((follower: User) => (
                            <div key={follower._id.toString()} className=" h-20 flex items-center justify-between border-b-2 p-2">
                              <div className="h-full flex items-center gap-2">
                                <Image alt="logo" height={40} width={40} className=" rounded-full aspect-square object-cover" src={follower?.avatar} />
                                <span>@{follower?.username}</span>
                              </div>
                            </div>
                          ))}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                  <Dialog modal={!(follow.length == 0)}>
                    <DialogTrigger asChild>
                      <div>
                        <p className={`flex flex-col items-center ${follow.length == 0 ? '' : 'hover:text-slate-500'}`}><span className=" text-2xl font-bold">{follow ? follow.length : 0}</span><span className="font-thin">Follow</span></p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className={`md:max-w-[425px] ${follow.length == 0 ? 'hidden' : ''}`}>
                      <DialogHeader>
                        <DialogTitle>Your follows</DialogTitle>
                        <DialogDescription className="flex flex-col">
                          {follow && follow.map((follow: User) => (
                            <div key={follow._id.toString()} className=" h-20 flex items-center justify-between border-b-2 p-2">
                              <div className="h-full flex items-center gap-2">
                                <Image height={40} width={40} alt="logo" className="rounded-full aspect-square object-cover" src={follow?.avatar} />
                                <span>@{follow?.username}</span>
                              </div>
                              <div className="group">
                                <Button className="group-hover:hidden w-24" variant={"secondary"}>Follow</Button>
                                <Button className="hidden group-hover:block w-24" variant={"secondary"} onClick={(e) => handleRelationDelete(e, follow?._id)}>Unfollow</Button>
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
            {userSuggestion.length > 0 && (
              <Card className=" pb-6 w-full h-min flex flex-col gap-2 items-center">
                <CardHeader className="flex items-center justify-between">
                  <div className="text-lg font-bold">Friend Suggestions</div>
                </CardHeader>
                {userSuggestion && userSuggestion.length > 0 ? (userSuggestion?.map((user: User) => (
                  user._id !== dataUser?._id ? (
                    <div key={user._id.toString()} className=" w-full flex px-8 flex-row items-center justify-between gap-4">
                      <div className="flex items-center flex-row gap-4">
                        <Image height={50} width={50} alt="logo" className="rounded-full aspect-square object-cover" src={user?.avatar} />
                        <div>
                          <h2 className=" font-thin">@{user.username}</h2>
                          <p className="font-thin text-xs">{calculateHoursElapsed(user.createdAt)}</p>
                        </div>
                      </div>
                      <Button onClick={(e) => handleRelation(e, user._id)}>Follow</Button>
                    </div>
                  ) : ''
                ))) : ''}
              </Card>
            )}
          </div>
          {/* Middle card */}
          <div className="max-md:w-full z-10 w-2/3 h-full flex flex-col gap-4 overflow-auto">
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
                        <Image height={100} width={100} alt="logo" className=" h-12 w-12 rounded-full object-cover" src={post.userId.avatar} />
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
                        {/* <div className=" hover:text-accent text-center w-1/3 p-3 flex items-center justify-center gap-2">
                          <Share />
                          <p className="max-md:hidden">Share</p>
                        </div> */}
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
                          {post.comments.filter((comment) => comment.flag = true).map((comment, index) => (
                            <div className={`p-6 ${index < post.comments.length - 1 ? 'border-b-2' : ''}`} key={comment._id.toString()}>
                              {comment.userId._id == dataUser?._id ?
                                <Trash2 onClick={(e) => handleCommentDelete(e, post._id, comment._id)} className=" absolute right-10" />
                                : ''}
                              <div className="flex items-center gap-3">
                                <Image width={40} height={40} alt="logo" className="rounded-full aspect-square object-cover" src={comment.userId.avatar} />
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
        </div >
      </div >
    </section >
  );
}
