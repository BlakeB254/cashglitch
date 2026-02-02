import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sql, initializeDatabase } from "@/lib/db";
import { PAGINATION } from "@/lib/shared";
import type { SubscriberRow, PaginatedResponse, Subscriber } from "@/lib/shared";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initializeDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      PAGINATION.MAX_PAGE_SIZE,
      Math.max(1, parseInt(searchParams.get("pageSize") || String(PAGINATION.DEFAULT_PAGE_SIZE), 10))
    );
    const search = searchParams.get("search") || "";
    const responseFilter = searchParams.get("response"); // 'yes', 'no', or 'null'

    const offset = (page - 1) * pageSize;

    // Get total count
    let countResult;
    if (search && responseFilter === "null") {
      countResult = await sql`
        SELECT COUNT(*) as count FROM emails
        WHERE email ILIKE ${"%" + search + "%"} AND response IS NULL
      `;
    } else if (search && responseFilter) {
      countResult = await sql`
        SELECT COUNT(*) as count FROM emails
        WHERE email ILIKE ${"%" + search + "%"} AND response = ${responseFilter}
      `;
    } else if (search) {
      countResult = await sql`
        SELECT COUNT(*) as count FROM emails
        WHERE email ILIKE ${"%" + search + "%"}
      `;
    } else if (responseFilter === "null") {
      countResult = await sql`
        SELECT COUNT(*) as count FROM emails WHERE response IS NULL
      `;
    } else if (responseFilter) {
      countResult = await sql`
        SELECT COUNT(*) as count FROM emails WHERE response = ${responseFilter}
      `;
    } else {
      countResult = await sql`
        SELECT COUNT(*) as count FROM emails
      `;
    }

    const total = parseInt(countResult[0]?.count || "0", 10);

    // Get paginated data
    let rows: SubscriberRow[];
    if (search && responseFilter === "null") {
      rows = await sql`
        SELECT * FROM emails
        WHERE email ILIKE ${"%" + search + "%"} AND response IS NULL
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      ` as SubscriberRow[];
    } else if (search && responseFilter) {
      rows = await sql`
        SELECT * FROM emails
        WHERE email ILIKE ${"%" + search + "%"} AND response = ${responseFilter}
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      ` as SubscriberRow[];
    } else if (search) {
      rows = await sql`
        SELECT * FROM emails
        WHERE email ILIKE ${"%" + search + "%"}
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      ` as SubscriberRow[];
    } else if (responseFilter === "null") {
      rows = await sql`
        SELECT * FROM emails WHERE response IS NULL
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      ` as SubscriberRow[];
    } else if (responseFilter) {
      rows = await sql`
        SELECT * FROM emails WHERE response = ${responseFilter}
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      ` as SubscriberRow[];
    } else {
      rows = await sql`
        SELECT * FROM emails
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      ` as SubscriberRow[];
    }

    // Transform to camelCase
    const items: Subscriber[] = rows.map((row) => ({
      id: row.id,
      email: row.email,
      response: row.response as "yes" | "no" | null,
      createdAt: new Date(row.created_at),
      ipAddress: row.ip_address,
      userAgent: row.user_agent,
    }));

    const result: PaginatedResponse<Subscriber> = {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Subscribers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
