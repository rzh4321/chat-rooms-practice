'use client';

import ChatLog from './ChatLog';
import ChatInput from './ChatInput';
import { useSocket } from './Provider';
import useConversation from '@/hooks/useConversation';

export default function Chat({ conversationId, username }) {
    const {socket} = useSocket();
    const {data : conversation, isLoading } = useConversation(conversationId);
    if (isLoading) return <>loading...</>
    const userId = username === conversation?.userOne.username ? conversation?.userOneId : conversation?.userTwoId;
    return (
        <>
            <div>conversation id {conversationId} between {conversation?.userOne.username}, the initiator, and {conversation?.userTwo.username}</div>
            <div>you are {username}</div>
            <ChatLog userId={userId} conversationId={conversationId} socket={socket} />
            <ChatInput conversationId={conversationId} userId={userId} socket={socket}  />
        </>
    )
}