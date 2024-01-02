'use client';
import { useQuery, UseQueryResult } from "@tanstack/react-query";

type MessageType = {
    id: number;
    content: string;
    createdAt: Date;
    authorId: number;
    conversationId: number;
};

type ConversationType = {
    messages: MessageType[];
    id: number;
    userOneId: number;
    userTwoId: number;
    userOne: { username: string };
    userTwo: { username: string };
}

const get_conversation = async (conversationId : number) : Promise<ConversationType> => {
    const res = await fetch(`/api/conversations/${conversationId}`);
    const data = await res.json();
    return data.conversation as ConversationType;
}

export default function useConversation(conversationId : number) : UseQueryResult<ConversationType> {
    const queryResult = useQuery<ConversationType>({
      queryKey: ['conversations', conversationId],
      queryFn: () => get_conversation(conversationId),
    });
  
    return queryResult;
  }

// 'use client';
// import { useInfiniteQuery, UseInfiniteQueryResult } from "@tanstack/react-query";

// type MessageType = {
//     id: number;
//     content: string;
//     createdAt: Date;
//     authorId: number;
//     conversationId: number;
// };

// type ConversationType = {
//     messages: MessageType[];
//     id: number;
//     userOneId: number;
//     userTwoId: number;
//     userOne: { username: string };
//     userTwo: { username: string };
// }

// const fetchConversationMessages = async ({ conversationId, cursor }: { conversationId: number, cursor?: number }): Promise<{ conversation: ConversationType, nextCursor?: number }> => {
//     const res = await fetch(`/api/conversations/${conversationId}${cursor ? `?cursor=${cursor}` : '?cursor=1'}`);
//     if (!res.ok) {
//         throw new Error('Network response was not ok');
//     }
//     const data = await res.json();
//     return data;
// }

// export default function useConversation(conversationId : number): UseInfiniteQueryResult<ConversationType> {
//     const queryResult = useInfiniteQuery<ConversationType>({
//         queryKey: ['conversations', conversationId],
//         queryFn: ({ pageParam }) => fetchConversationMessages({ conversationId, cursor: pageParam }),
//         getNextPageParam: (lastPage) => lastPage.nextCursor,
//         // refetchInterval: 20000, // You might want to reconsider this with infinite queries
//     });

//     return queryResult;
// }