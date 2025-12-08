import { NextRequest, NextResponse } from 'next/server';

// TODO: Move to environment variable
const BOARDROOM_URL = "https://us-central1-veiled-vector-core.cloudfunctions.net/boardroom-orchestrator";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Forward the entire body or specific fields needed by V2 Orchestrator
        // V2 adds 'selected_agents' for GROUP/BROADCAST modes
        const { message, target_agent, selected_agents } = body;

        const response = await fetch(BOARDROOM_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message, target_agent, selected_agents }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Boardroom Proxy Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
