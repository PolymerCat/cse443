import { NextResponse } from 'next/server';
import Pusher from 'pusher';

// Initialize Pusher (You get these keys for free from pusher.com)
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export async function POST(request: Request) {
  try {
    const { licensePlate, location, type, amount } = await request.json();

    if (!licensePlate) {
      return NextResponse.json({ error: 'License plate required' }, { status: 400 });
    }

    // 1. Generate the Fine Data
    const newFine = {
      id: `FN-${Math.floor(Math.random() * 10000)}`,
      location: location ?? 'Lebuh Chulia',
      type: type ?? 'Illegal Parking',
      amount: typeof amount === 'number' ? amount : 50.00,
      status: 'Unpaid',
      plate: licensePlate
    };

    // 2. BROADCAST THE ALERT
    // We broadcast to a channel named after the license plate so only that user gets it.
    await pusher.trigger(`vehicle-${licensePlate}`, 'new-compound', newFine);

    return NextResponse.json({ success: true, fine: newFine }, { status: 200 });

  } catch (error) {
    console.error('Fine Error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
