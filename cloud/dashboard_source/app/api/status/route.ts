import { NextResponse } from 'next/server';

export async function GET() {
    // TODO Phase 7: Connect to Firestore/Realtime DB where Akuma Heartbeats are stored.
    // For Day 2 "Glass Box", we mock this until the database is wired.
    // Since Akuma is running on the dev's machine, we can't easily ping it from Cloud Run without a tunnel or DB.

    // Simulation: 95% chance of being active
    const isActive = Math.random() > 0.05;

    return NextResponse.json({
        active: isActive,
        timestamp: Date.now()
    });
}
