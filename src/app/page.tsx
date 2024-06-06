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
import Image from "next/image";
import { useEffect, useState } from "react";

export interface User {
  _id: string;
  email: string;
  username: string;
}

export default function Home() {

  const { user } = useAuth();
  const [dataUser, setDataUser] = useState<User | null>(null);
  const [postValue, setPostValue] = useState('')
  const [posts, setPosts] = useState<Post[]>([]);

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
          setDataUser(data)
          console.log(data);
        } else {
          console.error('Error fetching user data');
        }
      }
    };

    fetchUserData();
  }, [user]);

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
        const postsWithComments = data.map(post => ({
          ...post,
          showComments: false
        }));
        const sortedPosts = postsWithComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(sortedPosts);
        console.log(sortedPosts);

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

    console.log(JSON.stringify({ userId: dataUser?._id, text: postValue, images: [] }));

    e.preventDefault();
    const res = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: dataUser?._id, text: postValue, images: [] }),
    });

    if (res.ok) {
      console.log('Post add');
    } else {
      console.error('Error logging in');
    }
  };

  return (
    <section className="h-min flex justify-center">
      {/* Main card */}
      <div className=" w-11/12 my-10 h-min flex flex-col items-center">
        <Dialog>
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
              <img className=" h-16 rounded-full aspect-square object-cover" src="/pp.jpg" />
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
                posts.map((post) => {
                  return (
                    <Card className="pt-6" key={post._id.toString()}>
                      <CardTitle className="px-6">
                        <div className="flex items-center gap-3">
                          <img className=" h-8 rounded-full aspect-square object-cover" src="/pp.jpg" />
                          <div>
                            <p className=" text-sm">@{post.userId.username}</p>
                            <p className="text-sm font-thin">{post.createdAt} hours ago</p>
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
                            4
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
                          <div className="flex p-2 gap-2 ">
                            <Input className="w-5/6" placeholder="Type your comment here..." />
                            <Button className="w-1/6">Send</Button>
                          </div>
                          <div>
                            <div className="p-6 border-b-2">
                              <div className="flex items-center gap-3">
                                <img className=" h-8 rounded-full aspect-square object-cover" src="/pp.jpg" />
                                <div>
                                  <p className=" text-sm">froteel</p>
                                  <p className="text-sm font-thin">3 minutes ago</p>
                                </div>
                              </div>
                              <p className="p-0 font-thin mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, neque id. Facere expedita quod ipsam enim. Repellendus, voluptas sapiente. Doloribus earum minima officia expedita ea velit suscipit deserunt quam dicta?</p>
                            </div>
                            <div className="p-6 border-b-2">
                              <div className="flex items-center gap-3">
                                <img className=" h-8 rounded-full aspect-square object-cover" src="/pp.jpg" />
                                <div>
                                  <p className=" text-sm">froteel</p>
                                  <p className="text-sm font-thin">5 hours ago</p>
                                </div>
                              </div>
                              <p className="p-0 font-thin mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, neque id. Facere expedita quod ipsam enim. Repellendus, voluptas sapiente. Doloribus earum minima officia expedita ea velit suscipit deserunt quam dicta?</p>
                            </div>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  )
                })
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
            <Card className=" w-full aspect-square flex justify-center p-2 flex-col items-center gap-4">
              <div className="flex items-center flex-col">
                <img className=" h-16 rounded-full aspect-square object-cover" src="/pp.jpg" />
                <h2 className=" font-thin">@frosteel</h2>
              </div>
              <Button>Follow</Button>
            </Card>
            <Card className=" w-full aspect-square flex justify-center p-2 flex-col items-center gap-4">
              <div className="flex items-center flex-col">
                <img className=" h-16 rounded-full aspect-square object-cover" src="/pp.jpg" />
                <h2 className=" font-thin">@frosteel</h2>
              </div>
              <Button>Follow</Button>
            </Card>
            <Card className=" w-full aspect-square flex justify-center p-2 flex-col items-center gap-4">
              <div className="flex items-center flex-col">
                <img className=" h-16 rounded-full aspect-square object-cover" src="/pp.jpg" />
                <h2 className=" font-thin">@frosteel</h2>
              </div>
              <Button>Follow</Button>
            </Card>
            <Card className=" w-full aspect-square flex justify-center p-2 flex-col items-center gap-4">
              <div className="flex items-center flex-col">
                <img className=" h-16 rounded-full aspect-square object-cover" src="/pp.jpg" />
                <h2 className=" font-thin">@frosteel</h2>
              </div>
              <Button>Follow</Button>
            </Card>
          </Card>
        </div>
      </div>
    </section>
  );
}
