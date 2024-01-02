import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient()


export async function GET() {
    const usernames = await prisma.user.findMany({
        select: {
          username: true
        }
      });
    
    return NextResponse.json({ usernames }, { status: 201 });
}