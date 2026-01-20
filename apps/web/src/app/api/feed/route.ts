import { createClient } from "@/lib/supabase/server";
import { getFeedPosts, createFeedPost, getActivityFeed } from "@kaitif/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    // Determine what to fetch based on page
    // For page 1, we might want to interleave activity items
    // For simplicity in this iteration, we'll just fetch posts and append activity if it's page 1
    
    const { posts, nextCursor } = await getFeedPosts(supabase, {
      page,
      limit,
      userId: user.id
    });

    let items = [...posts.map(p => ({ type: 'POST', data: p }))];

    // If page 1, mix in activity feed
    if (page === 1) {
      const activity = await getActivityFeed(supabase, 10);
      const activityItems = activity.map(a => ({ type: 'ACTIVITY', data: a }));
      
      // Simple merge: insert activity item every 3 posts
      // Note: This is a simple implementation. A real feed algorithm would be more complex.
      let mixedItems = [];
      let postIdx = 0;
      let activityIdx = 0;
      
      while (postIdx < items.length || activityIdx < activityItems.length) {
        // Add up to 3 posts
        for (let i = 0; i < 3 && postIdx < items.length; i++) {
          mixedItems.push(items[postIdx++]);
        }
        
        // Add 1 activity item
        if (activityIdx < activityItems.length) {
          mixedItems.push(activityItems[activityIdx++]);
        }
      }
      
      items = mixedItems;
    }

    return NextResponse.json({ 
      items,
      nextCursor 
    });
  } catch (error) {
    console.error("Feed error:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await request.json();
    const { content, mediaUrl, type, trickTag } = json;

    if (!content && !mediaUrl) {
      return NextResponse.json({ error: "Content or media required" }, { status: 400 });
    }

    const post = await createFeedPost(supabase, user.id, {
      content,
      mediaUrl,
      type: type || "TEXT",
      trickTag
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
