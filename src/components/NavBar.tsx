import Image from "next/image";
import ModeToggle from "./ModeToggle";
import SettingIcon from "./icons/SettingIcon";
import UserIcon from "./icons/UserIcon";
import { Input } from "./ui/input";

export default function NavBar() {

    return (
        <div className="w-screen bg-secondary h-14 flex items-center justify-around">
            <a href="/">
                <Image
                    src='/logo.svg'
                    width={50}
                    height={50}
                    alt="logo"
                />
            </a>
            <div className=" space-x-4">
                <a className=" hover:bg-slate-200 p-2 rounded-sm" href="/">Home</a>
                <a className=" hover:bg-slate-200 p-2 rounded-sm" href="/friends">Friends list</a>
            </div>
            <Input className="w-1/3 bg-primary border-0" placeholder="Search friend" />
            <div className="flex items-center space-x-4">
                <a href="/login">
                    <UserIcon />
                </a>
                <SettingIcon />
                <ModeToggle />
            </div>
        </div>
    )
}