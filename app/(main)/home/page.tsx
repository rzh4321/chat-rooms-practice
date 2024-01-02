'use client';
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useSocket } from "@/components/Provider";
import { useRouter } from "next/navigation";
import useUsernames from '@/hooks/useUsernames';

export default function Page() {
    const {data: session, status} = useSession();
    const {usernames, isLoading, isError} = useUsernames();
    const {socket, isConnected} = useSocket();
    const router = useRouter();

    const handleClick = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const res = await fetch('/api/conversations',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // session user is userOne since userOne is initiator
                body: JSON.stringify({ userOne: session?.user?.username, userTwo: e.target.textContent })
            })
        if (res.ok) {
            const data = await res.json();
            const conversationId = data.conversation.id;
            router.push(`/conversations/${conversationId}`);
        }
        else {
            throw new Error('post request to api/conversations went wrong')
        }
    }


    if (status === 'loading') {
        return <div>waitin for session to load...</div>
    }
    if (isLoading) return <div>loading other users...</div>
    if (isError) return <div>error fetching other users</div>
    return (
        <>
            <p>hi, {session?.user?.username}</p>
            <p>connected: {isConnected.toString()}</p>
            <div>
                {usernames?.map(username => session?.user?.username.toLowerCase() === username?.username.toLowerCase() ? null : <div className='hover:bg-slate-100 cursor-pointer' onClick={handleClick}>{username?.username}</div>)}
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })}>sign out</button>
        </>
        
    )
}