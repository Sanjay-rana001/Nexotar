import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

const docRef = doc(db, 'analytics', 'data');

async function getAnalyticsData() {
  try {
    const docSnap = await getDoc(docRef);
    let data;

    const today = new Date().toISOString().split('T')[0];

    if (!docSnap.exists()) {
      data = {
        totalVisitors: 146805,
        todayVisitors: Math.floor(Math.random() * (70 - 50 + 1)) + 50,
        totalClicks: 805709,
        todayClicks: Math.floor(Math.random() * (550 - 450 + 1)) + 450,
        lastUpdatedDate: today
      };
      await setDoc(docRef, data);
    } else {
      data = docSnap.data();
      
      // Check if we need to reset today's counts
      if (data.lastUpdatedDate !== today) {
        data.todayVisitors = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
        data.todayClicks = Math.floor(Math.random() * (550 - 450 + 1)) + 450;
        data.lastUpdatedDate = today;
        await updateDoc(docRef, {
          todayVisitors: data.todayVisitors,
          todayClicks: data.todayClicks,
          lastUpdatedDate: today
        });
      }
    }
    return data;
  } catch (error) {
    console.error("Error reading analytics data from Firestore:", error);
    // Return default if DB fails
    return {
      totalVisitors: 146805,
      todayVisitors: Math.floor(Math.random() * (70 - 50 + 1)) + 50,
      totalClicks: 805709,
      todayClicks: Math.floor(Math.random() * (550 - 450 + 1)) + 450,
      lastUpdatedDate: new Date().toISOString().split('T')[0]
    };
  }
}

export async function GET() {
  const data = await getAnalyticsData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, count = 1 } = body;
    
    // Ensure document exists and date is correct before we increment
    const currentData = await getAnalyticsData();
    
    if (action === 'visit') {
      await updateDoc(docRef, {
        totalVisitors: increment(count),
        todayVisitors: increment(count)
      });
      currentData.totalVisitors += count;
      currentData.todayVisitors += count;
    } else if (action === 'click') {
      await updateDoc(docRef, {
        totalClicks: increment(count),
        todayClicks: increment(count)
      });
      currentData.totalClicks += count;
      currentData.todayClicks += count;
    }
    
    return NextResponse.json(currentData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update analytics' }, { status: 500 });
  }
}
