import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()

export async function GET(req, context) {
  const searchParams = req.nextUrl.searchParams
  const cursor = +searchParams.get('cursor')
  // console.log('cursor is ', cursor);
  const conversationId = +context.params.conversationId;

  // if cursor exists (its not the first page), skip the cursor since it was included in prev batch
  const skipCount = cursor ? 1 : 0;

  const messages = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
    },
    take: 11, // Fetch one extra record to determine if there's a next page
    skip: skipCount, // Skip the message thats equal to cursor
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      id: 'desc', // order by descending to get newer messages first
      // setting it to desc also gets messages with ids <= cursor
    },
  });

  let nextCursor = null;
  if (messages.length > 10) {
    // If we have more than 10 messages, set the next cursor as the id of the 10th message
    nextCursor = messages[9].id;
    messages.pop(); // Remove the extra record. We only included it to see if we reached end
  }

  return NextResponse.json({
    messages: messages,
    nextCursor: nextCursor,
  });
}


export async function POST(req, context) {
    const { content, authorId } = await req.json();
    const conversationId = context.params.conversationId;
    const newMessage = await prisma.message.create({
        data: {
          content: content,
          authorId: authorId,
          conversationId: +conversationId,
        },
      });
    
      return NextResponse.json({ newMessage }, { status: 201 });
    }