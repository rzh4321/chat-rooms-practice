'use client';
import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';

type MessageType = {
  id: number;
  content: string;
  createdAt: Date;
  authorId: number;
  conversationId: number;
};

type MessagesPage = {
  messages: MessageType[];
  nextCursor: number | null;
};

const fetchMessagesPage = async ({
  pageParam,
  conversationId,
}: {
  pageParam?: number;
  conversationId: number;
}): Promise<MessagesPage> => {
  const res = await fetch(`/api/conversations/${conversationId}/messages?cursor=${pageParam}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export default function useConversationMessages(conversationId: number): UseInfiniteQueryResult<MessagesPage> {
  return useInfiniteQuery<MessagesPage>({
    queryKey: ['conversationMessages', conversationId],
    queryFn: ({ pageParam }) => fetchMessagesPage({ pageParam, conversationId }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,  });
}