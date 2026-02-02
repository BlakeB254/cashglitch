import { NextResponse } from "next/server";
import {
  initializeAllTables,
  seedDefaultCategories,
  seedDefaultIntroScreens,
  seedDefaultSiteSettings,
  seedDefaultPageContent,
  seedDefaultPageItems,
} from "@/lib/db";

export async function POST() {
  try {
    // Initialize all tables
    await initializeAllTables();

    // Seed default data
    await seedDefaultCategories();
    await seedDefaultIntroScreens();
    await seedDefaultSiteSettings();
    await seedDefaultPageContent();
    await seedDefaultPageItems();

    return NextResponse.json({
      success: true,
      message: "Database initialized and seeded successfully",
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Allow GET for easy browser access during development
  return POST();
}
