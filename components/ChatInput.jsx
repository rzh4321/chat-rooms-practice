'use client';
import { useState, useEffect } from "react";
// import { useSocket } from "@/components/Provider";


export default function ChatInput({ conversationId, userId, socket }) {
    const [content, setContent] = useState('');
    // we couldve used useSocket instead of getting it from Chat.jsx
    // const {socket} = useSocket();
    useEffect(() => {
        socket?.emit("join_room", conversationId);
    }, [socket]);

    const handleSend = async (e) => {
        e.preventDefault();
        const res = await fetch(`/api/conversations/${conversationId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content, authorId: userId })
            })
            // emit event
        if (res.ok) {
            const data = {
                content,
                roomId: conversationId,
                authorId: userId
            }
            socket.emit('send_msg', data);
            setContent('');
        }
    }

    return (
        <div className="fixed bottom-0 left-0 flex gap-2">
            <form onSubmit={handleSend}>
                <input type="text" value={content} onChange={(e) => setContent(e.target.value)} className='bg-slate-400' />
                <button type="submit">send</button>
            </form>
        </div>
    )
}