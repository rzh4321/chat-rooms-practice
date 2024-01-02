'use client';
import { useRouter } from "next/navigation";
import { revalidatePath } from 'next/cache'


export default function Button() {

    const router = useRouter();
    function handleClick() {
        router.refresh();
    }
    return (
        <>
            <button onClick={handleClick}>refresh</button>
        </>
    )
}