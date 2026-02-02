import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initializeDatabase, initializeBlogPosts, initializeCategories, seedDefaultCategories } from "@/lib/db";
import type { DashboardStats } from "@/lib/shared";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();
    await initializeBlogPosts();
    await initializeCategories();
    await seedDefaultCategories();

    // Get total subscribers
    const totalResult = await sql`
      SELECT COUNT(*) as count FROM emails
    `;
    const totalSubscribers = parseInt(totalResult[0]?.count || "0", 10);

    // Get recent signups (last 7 days)
    const recentResult = await sql`
      SELECT COUNT(*) as count FROM emails
      WHERE created_at > NOW() - INTERVAL '7 days'
    `;
    const recentSignups = parseInt(recentResult[0]?.count || "0", 10);

    // Get response breakdown
    const yesResult = await sql`
      SELECT COUNT(*) as count FROM emails WHERE response = 'yes'
    `;
    const noResult = await sql`
      SELECT COUNT(*) as count FROM emails WHERE response = 'no'
    `;
    const nullResult = await sql`
      SELECT COUNT(*) as count FROM emails WHERE response IS NULL
    `;

    // Get blog stats
    const totalPostsResult = await sql`
      SELECT COUNT(*) as count FROM blog_posts
    `;
    const publishedPostsResult = await sql`
      SELECT COUNT(*) as count FROM blog_posts WHERE published = true
    `;

    // Get category stats
    const totalCategoriesResult = await sql`
      SELECT COUNT(*) as count FROM categories
    `;
    const activeCategoriesResult = await sql`
      SELECT COUNT(*) as count FROM categories WHERE is_active = true
    `;

    const stats: DashboardStats = {
      totalSubscribers,
      recentSignups,
      responseBreakdown: {
        yes: parseInt(yesResult[0]?.count || "0", 10),
        no: parseInt(noResult[0]?.count || "0", 10),
        noResponse: parseInt(nullResult[0]?.count || "0", 10),
      },
      totalPosts: parseInt(totalPostsResult[0]?.count || "0", 10),
      publishedPosts: parseInt(publishedPostsResult[0]?.count || "0", 10),
      totalCategories: parseInt(totalCategoriesResult[0]?.count || "0", 10),
      activeCategories: parseInt(activeCategoriesResult[0]?.count || "0", 10),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
