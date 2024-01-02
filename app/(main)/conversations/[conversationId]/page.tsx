import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { redirect } from "next/navigation";
import Chat from "@/components/Chat";

const prisma = new PrismaClient()

async function isUserInConversation(username : String, conversationId: Number) {
    // Find the user by the given username
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  
    // If the user doesn't exist, they can't be in the conversation
    if (!user) {
      return false;
    }
    // Check if the conversation exists that includes the user ID as either userOneId or userTwoId
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { userOneId: user.id },
          { userTwoId: user.id },
        ],
      },
    });
  
    // Return true if the conversation exists, otherwise, false
    return !!conversation;
  }

export default async function Page({ params } : { params: { conversationId: String } }) {
    const session = await getServerSession(authOptions);
    const username = session?.user?.username;
    const conversationId = params.conversationId;
    const inConversation = await isUserInConversation(username, +conversationId);
    if (!inConversation) {
        redirect('/home')
    }

    return (
        <div className="flex flex-col items-center">
            <Chat conversationId={conversationId} username={username} />
        </div>
    )
}