"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export interface User {
  userId: string;
  email: string;
  username: string;
}

export default function Home() {

  const [commentState, setCommentState] = useState(false)
  const { user } = useAuth();
  const [dataUser, setDataUser] = useState<User | null>(null);
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

  return (
    <section className="h-min flex justify-center">
      {/* Main card */}
      <div className=" w-11/12 my-10 h-min flex flex-col items-center">
        <Button className="w-3/5">Add Post</Button>
        <div className="flex gap-3 p-2 relative">
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
            <Card className="pt-6">
              <CardTitle className="px-6">
                <div className="flex items-center gap-3">
                  <img className=" h-8 rounded-full aspect-square object-cover" src="/pp.jpg" />
                  <div>
                    <p className=" text-sm">froteel</p>
                    <p className="text-sm font-thin">5 hours ago</p>
                  </div>
                </div>
              </CardTitle>
              <CardContent className="p-0 px-6">
                <p className="p-0 font-thin mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, neque id. Facere expedita quod ipsam enim. Repellendus, voluptas sapiente. Doloribus earum minima officia expedita ea velit suscipit deserunt quam dicta?</p>
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
                  <div onClick={() => setCommentState(!commentState)} className=" hover:bg-slate-200 text-center w-1/3 p-3 flex items-center justify-center gap-2">
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
                <div className={`w-full ${commentState ? '' : 'hidden'}`}>
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
            {/* Card post */}
            <Card className="pt-6">
              <CardTitle className="px-6">
                <div className="flex items-center gap-3">
                  <img className=" h-8 rounded-full aspect-square object-cover" src="/pp.jpg" />
                  <div>
                    <p className=" text-sm">froteel</p>
                    <p className="text-sm font-thin">5 hours ago</p>
                  </div>
                </div>
              </CardTitle>
              <CardContent className="p-0 px-6">
                <p className="p-0 font-thin mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, neque id. Facere expedita quod ipsam enim. Repellendus, voluptas sapiente. Doloribus earum minima officia expedita ea velit suscipit deserunt quam dicta?</p>
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
                  <div onClick={() => setCommentState(!commentState)} className=" hover:bg-slate-200 text-center w-1/3 p-3 flex items-center justify-center gap-2">
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
                <div className={`w-full ${commentState ? '' : 'hidden'}`}>
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
