import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <svg className="animate-spin h-10 w-10" viewBox="0 0 24 24">
                <LoaderCircle />
            </svg>
        </div>
    )
}