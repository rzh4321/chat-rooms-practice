import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()


// returns conversation object with all the messages populated
export async function GET(req, context) {
    const conversationId = +context.params.conversationId;
    const conversationWithMessages = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            userOne: {
                select: {
                    username: true, // Only select the username of userOne
                }
            },
            userTwo: {
                select: {
                    username: true, // Only select the username of userTwo
                }
            },
            messages: {
                orderBy: {
                    createdAt: 'asc', // Sort messages by createdAt in ascending order
                },
            },
        },
    });

    return NextResponse.json({ conversation: conversationWithMessages }, { status: 201 });


    // const messagesArgs = {
    //     take: 10,
    //     orderBy: {
    //         createdAt: 'asc',
    //     },
    //     ...(cursor && {
    //         skip: 1, // Skip the cursor itself
    //         cursor: {
    //             id: cursor,
    //         },
    //     }),
    // };

    // const conversationWithMessages = await prisma.conversation.findUnique({
    //     where: {
    //         id: conversationId,
    //     },
    //     include: {
    //         userOne: {
    //             select: {
    //                 username: true,
    //             },
    //         },
    //         userTwo: {
    //             select: {
    //                 username: true,
    //             },
    //         },
    //         messages: messagesArgs,
    //     },
    // });
    
    // // Determine if there is a next cursor
    // let nextCursor = null;
    // if (conversationWithMessages && conversationWithMessages.messages.length >= 10) {
    //     nextCursor = conversationWithMessages.messages[9].id;
    // }

    // return NextResponse.json({
    //     conversation: {
    //         ...conversationWithMessages,
    //         messages: conversationWithMessages.messages.slice(0, 10), // Return only 10 messages
    //     },
    //     nextCursor: nextCursor
    // }, { status: 201 });
        }