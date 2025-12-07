import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { action, docId, status, type, payload } = body;

        // 1. Create New Request (From Dispatch Console)
        if (action === "CREATE") {
            const docRef = firestore.collection('inbox').doc();
            await docRef.set({
                task_type: type,
                payload: JSON.stringify(payload),
                status: "PENDING",
                created_at: Date.now(),
                requester: "CEO_MANUAL_OVERRIDE"
            });
            return NextResponse.json({ success: true, id: docRef.id });
        }

        // 2. Update Status (Approve/Reject)
        if (action === "UPDATE" && docId) {
            await firestore.collection('inbox').doc(docId).update({
                status: status
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid Action" }, { status: 400 });

    } catch (e: any) {
        console.log(`[INBOX_ERROR] POST Failed: ${e.message}`, e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        console.log("[INBOX_DEBUG] Fetching items...");
        // Fetch Pending Items
        const snapshot = await firestore.collection('inbox')
            .where('status', '==', 'PENDING')
            .orderBy('created_at', 'desc')
            .get();

        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(`[INBOX_DEBUG] Found ${items.length} items`);
        return NextResponse.json({ items });
    } catch (e: any) {
        console.log(`[INBOX_ERROR] GET Failed: ${e.message}`, e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
