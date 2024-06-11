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
import { useAuth } from "@/lib/AuthContext";
import { Post } from "@/types/Post";
import { User } from "@/types/User";
import Image from "next/image";
import { useEffect, useState } from "react";



export default function Home() {
  const { user } = useAuth();
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [allUser, setAllUser] = useState<User[] | null>([])

  const [postValue, setPostValue] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
          console.log(data);
        } else {
          console.error('Error fetching user data');
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchAllUserData = async () => {
      const res = await fetch(`/api/users/get`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        setAllUser(data);
        console.log(data);
      } else {
        console.error('Error fetching user data');
      }
    };

    fetchAllUserData();
  }, []);

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
          textComment: '',
        }));
        const sortedPosts = postsWithComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log(sortedPosts);
        setPosts(sortedPosts);
      } else {
        console.error('Error fetching posts');
      }
    };

    fetchPosts();
  }, [user]);

  const toggleComments = (postId: string) => {
    setPosts(posts.map(post =>
      post._id.toString() === postId ? { ...post, showComments: !post.showComments } : post
    ));
  };

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
    } else {
      console.error('Error logging in');
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>, postId: string) => {
    const { value } = e.target;
    setPosts(posts.map(post =>
      post._id.toString() === postId ? { ...post, textComment: value } : post
    ));
  };

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
      console.log("Relation add");
    } else {
      console.error('Error logging in');
    }
  };

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
            <Button className="w-3/5">Add Post</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
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
          <Card className="w-1/5 h-min p-2 flex flex-col justify-center items-center gap-2 aspect-square">
            <div className="flex items-center flex-col gap-2">
              <img className=" h-16 rounded-full aspect-square object-cover" src={dataUser?.avatar} />
              <h2 className=" font-thin">@{dataUser?.username}</h2>
              <div className="flex gap-2">
                <p className="flex flex-col items-center">5<span className=" text-xs">followers</span></p>
                <p className="flex flex-col items-center">5 <span className="text-xs">follow</span></p>
              </div>
            </div>
          </Card>
          {/* Middle card */}
          <Card className=" z-10 w-3/5 h-full flex flex-col gap-2 p-2 overflow-auto">
            <CardTitle className=" text-center py-2">Your friend's posts</CardTitle>
            {/* Card post */}
            <>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card className="pt-6" key={post._id.toString()}>
                    <CardTitle className="px-6">
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
                          4
                          <Image
                            src="/like.svg"
                            height={25}
                            width={25}
                            alt="like" />
                        </p>
                        <p className="flex items-center justify-center gap-2">
                          {post.comments.length}
                          <Image
                            src="/comment.svg"
                            height={25}
                            width={25}
                            alt="comment" />
                        </p>
                        <p className="flex items-center justify-center gap-2">
                          4
                          <Image
                            src="/share.svg"
                            height={25}
                            width={25}
                            alt="share" />
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col w-full p-0 border-t-2">
                      <div className="w-full flex justify-around px-0">
                        <div className=" hover:bg-slate-200 text-center w-1/3 p-3 flex items-center justify-center gap-2">
                          <Image
                            src="/like.svg"
                            height={25}
                            width={25}
                            alt="like" />
                          <p>Like</p>
                        </div>
                        <div onClick={() => toggleComments(post._id.toString())} className=" hover:bg-slate-200 text-center w-1/3 p-3 flex items-center justify-center gap-2">
                          <Image
                            src="/comment.svg"
                            height={25}
                            width={25}
                            alt="comment" />
                          <p>Comment</p>
                        </div>
                        <div className=" hover:bg-slate-200 text-center w-1/3 p-3 flex items-center justify-center gap-2">
                          <Image
                            src="/share.svg"
                            height={25}
                            width={25}
                            alt="share" />
                          <p>Share</p>
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
                          {post.comments.map((comment) => (
                            <div className="p-6 border-b-2" key={comment._id.toString()}>
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
                  <h1>Loading...</h1>
                </>
              )}
            </>
          </Card>
          {/* Right card */}
          <Card className="w-1/5 h-min p-2 flex flex-col gap-2 items-center">
            <CardTitle className=" text-center py-2">Friends requests</CardTitle>
            {allUser?.map((user: User) => (
              user._id !== dataUser?._id ? (
                <Card className=" w-full aspect-square flex justify-center p-2 flex-col items-center gap-4">
                  <div className="flex items-center flex-col">
                    <img className=" h-16 rounded-full aspect-square object-cover" src={user?.avatar} />
                    <h2 className=" font-thin">@{user.username}</h2>
                  </div>
                  <Button onClick={(e) => handleRelation(e, user._id.toString())}>Follow</Button>
                </Card>
              ) : ''
            ))}
          </Card>
        </div>
      </div>
    </section >
  );
}
