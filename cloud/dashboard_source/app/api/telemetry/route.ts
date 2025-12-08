import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'veiled-vector-core'
});

export async function GET() {
    try {
        // In V5, we fetch the specific node. In future V6, we list all nodes.
        // Assuming the hostname in the daemon is the machine name. 
        // We will query the collection to find the most recently updated node.

        const snapshot = await firestore.collection('swarms').get();

        if (snapshot.empty) {
            return NextResponse.json({ error: "No Agents Online" }, { status: 404 });
        }

        // Just take the first one for now (V5 MVP)
        const doc = snapshot.docs[0];
        const stats = doc.data();

        return NextResponse.json({ stats });
    } catch (e: any) {
        console.log(`[TELEMETRY_ERROR] GET Failed: ${e.message}`, e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
