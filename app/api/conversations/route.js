import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function POST(req) {
    const { userOne, userTwo } = await req.json();
    const users = await prisma.user.findMany({
        where: {
          OR: [{ username: userOne }, { username: userTwo }],
        },
      });
    
      // Ensure both users exist
      if (users.length !== 2) {
        throw new Error("One or both users not found");
      }
    
      const userOneId = users.find(u => u.username.toLowerCase() === userOne.toLowerCase()).id;
      const userTwoId = users.find(u => u.username.toLowerCase() === userTwo.toLowerCase()).id;
    
      // Step 2: Check if a Conversation exists between the two users
      let conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { userOneId: userOneId, userTwoId: userTwoId },
            { userOneId: userTwoId, userTwoId: userOneId }, // Covering both possibilities of initiator and receiver
          ],
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc', // Sorting messages by createdAt in ascending order
            },
          },
        },
      });
    
      // Step 3: If Conversation exists, return it
      if (conversation) {
        return NextResponse.json({ conversation }, { status: 201 });
      }
    
      // Step 4: If it doesn't exist, create a new Conversation
      conversation = await prisma.conversation.create({
        data: {
          userOneId: userOneId,
          userTwoId: userTwoId,
        },
      });
    
      return NextResponse.json({ conversation }, { status: 201 });
    }