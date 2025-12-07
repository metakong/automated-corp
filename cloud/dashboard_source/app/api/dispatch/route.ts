import { NextResponse } from 'next/server';
import { PubSub } from '@google-cloud/pubsub';

const pubsub = new PubSub();
const TOPIC_NAME = 'corp-task-dispatch';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, data } = body;

        const messageJson = {
            type: type || 'MANUAL_OVERRIDE',
            data: data || {},
            requester: 'CEO_DASHBOARD',
            created_at: Date.now() / 1000,
            task_id: `task_${Date.now()}`
        };

        const buffer = Buffer.from(JSON.stringify(messageJson));
        // The topic needs to be the full path or just the name if in the same project
        // But since we are deploying to the same project, simple name usually works with the client library 
        // if GOOGLE_CLOUD_PROJECT is set (which it is in Cloud Run).
        const messageId = await pubsub.topic(TOPIC_NAME).publishMessage({ data: buffer });

        return NextResponse.json({ success: true, messageId });
    } catch (error) {
        console.error('Dispatch Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to dispatch' }, { status: 500 });
    }
}
