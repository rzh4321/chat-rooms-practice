'use client';
import { useState, useEffect } from "react";
import useConversationMessages from '@/hooks/useConversationMessages';
// import { useSocket } from "@/components/Provider";


export default function ChatLog({ userId, socket, conversationId }) {
    const [newMessages, setNewMessages] = useState([]);
    // we couldve used useSocket instead of getting it from Chat.jsx
    // const {socket} = useSocket();
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
      } = useConversationMessages(conversationId);

    const loadMoreMessages = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        const receiveMsgListener = (data) => {
            setNewMessages((pre) => [{content: data.content, authorId: data.authorId}, ...pre]);
          };
        // set up socket.on()
        socket?.on('receive_msg', receiveMsgListener);
        // clean up function
        return () => {
            socket?.off("receive_msg", receiveMsgListener);
          };
    }, [socket]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'error') return <div>Error: {error.message}</div>;

    // console.log('data is ', data);
    // data returned from useConversationMessages is an array of messages from most recent to oldest
    let messages = [...newMessages, ...(data?.pages.flatMap((page) => page.messages) ?? [])];
    messages.reverse();

    return (
        <div className="flex flex-col gap-2 w-full p-3">
            <button className={`border-2 cursor-pointer hover:bg-slate-300 ${hasNextPage ? null : 'text-gray-300'}`} onClick={loadMoreMessages} disabled={!hasNextPage}>load more</button>
            {messages.map((message, ind) => <div key={ind} className={`rounded-md border-2 ${message.authorId === userId ? 'self-end bg-slate-500' : 'self-start'}`}>{message.content}</div>)}
        </div>
    )
}