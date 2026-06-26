import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'analytics.json');

async function getAnalyticsData() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Check if we need to reset today's counts
    const today = new Date().toISOString().split('T')[0];
    if (data.lastUpdatedDate !== today) {
      data.todayVisitors = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
      data.todayClicks = Math.floor(Math.random() * (550 - 450 + 1)) + 450;
      data.lastUpdatedDate = today;
      await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    }
    return data;
  } catch (error) {
    console.error("Error reading analytics data:", error);
    // Return default if file missing or corrupted
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
    const { action, count = 1 } = body; // 'visit' or 'click', with optional count
    
    const data = await getAnalyticsData();
    const today = new Date().toISOString().split('T')[0];

    if (action === 'visit') {
      data.totalVisitors += count;
      data.todayVisitors += count;
    } else if (action === 'click') {
      data.totalClicks += count;
      data.todayClicks += count;
    }
    
    data.lastUpdatedDate = today;
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update analytics' }, { status: 500 });
  }
}
