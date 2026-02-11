import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL!);

// Initialize the emails table if it doesn't exist
export async function initializeDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      response VARCHAR(10),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(45),
      user_agent TEXT
    )
  `;
}

// Initialize auth_tokens table for magic link authentication
export async function initializeAuthTokens() {
  await sql`
    CREATE TABLE IF NOT EXISTS auth_tokens (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      token VARCHAR(64) NOT NULL UNIQUE,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used_at TIMESTAMP WITH TIME ZONE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_tokens(token)
  `;
}

// Initialize sessions table for authenticated users
export async function initializeSessions() {
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      session_token VARCHAR(64) NOT NULL UNIQUE,
      is_admin BOOLEAN DEFAULT FALSE,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token)
  `;
}

// Initialize blog_posts table
export async function initializeBlogPosts() {
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      published BOOLEAN DEFAULT FALSE,
      author_email VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug)
  `;
}

// Initialize site_settings table (key-value store)
export async function initializeSiteSettings() {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key VARCHAR(255) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Initialize categories table for homepage items
export async function initializeCategories() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      href VARCHAR(255) NOT NULL,
      icon VARCHAR(50) NOT NULL DEFAULT 'Gift',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Initialize intro_screens table for customizable intro sequence
export async function initializeIntroScreens() {
  await sql`
    CREATE TABLE IF NOT EXISTS intro_screens (
      id SERIAL PRIMARY KEY,
      screen_type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      subtitle TEXT,
      options JSONB,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

// Initialize donations table for tracking Stripe payments
export async function initializeDonations() {
  await sql`
    CREATE TABLE IF NOT EXISTS donations (
      id SERIAL PRIMARY KEY,
      stripe_session_id VARCHAR(255) NOT NULL UNIQUE,
      stripe_payment_intent VARCHAR(255),
      amount_cents INTEGER NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'usd',
      donor_email VARCHAR(255),
      donor_name VARCHAR(255),
      status VARCHAR(50) NOT NULL DEFAULT 'completed',
      donation_type VARCHAR(50) NOT NULL DEFAULT 'one_time',
      metadata JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_donations_created ON donations(created_at)
  `;
}

// Initialize all tables
export async function initializeAllTables() {
  await initializeDatabase();
  await initializeAuthTokens();
  await initializeSessions();
  await initializeBlogPosts();
  await initializeSiteSettings();
  await initializeCategories();
  await initializeIntroScreens();
  await initializePageContent();
  await initializePageItems();
  await initializeDonations();
}

// Seed default categories if none exist
export async function seedDefaultCategories() {
  await initializeCategories();

  const existing = await sql`
    SELECT COUNT(*) as count FROM categories
  `;

  if (parseInt(existing[0]?.count || "0", 10) === 0) {
    const defaultCategories = [
      { title: "NPO Directory", description: "Non-profit organizations creating systemic change", href: "/npo", icon: "Heart", sort_order: 0 },
      { title: "Sweepstakes", description: "Win prizes, grants & opportunities", href: "/sweepstakes", icon: "Trophy", sort_order: 1 },
      { title: "Free Travel", description: "Travel programs & cultural exchanges", href: "/free-travel", icon: "Plane", sort_order: 2 },
      { title: "Jobs", description: "Career opportunities with equity-focused orgs", href: "/jobs", icon: "Briefcase", sort_order: 3 },
      { title: "Partner", description: "Partner or advertise with us", href: "/partner", icon: "Handshake", sort_order: 4 },
      { title: "Donate PC", description: "Give the gift of technology", href: "/donate-computer", icon: "Laptop", sort_order: 5 },
      { title: "Get Free PC", description: "Apply for a free computer", href: "/get-computer", icon: "Monitor", sort_order: 6 },
    ];

    for (const cat of defaultCategories) {
      await sql`
        INSERT INTO categories (title, description, href, icon, sort_order)
        VALUES (${cat.title}, ${cat.description}, ${cat.href}, ${cat.icon}, ${cat.sort_order})
      `;
    }
  }
}

// Seed default intro screens if none exist
export async function seedDefaultIntroScreens() {
  await initializeIntroScreens();

  const existing = await sql`
    SELECT COUNT(*) as count FROM intro_screens
  `;

  if (parseInt(existing[0]?.count || "0", 10) === 0) {
    // Default question screen
    await sql`
      INSERT INTO intro_screens (screen_type, title, subtitle, options, sort_order)
      VALUES (
        'question',
        'Are you ok?',
        '// SYSTEM CHECK REQUIRED',
        ${JSON.stringify([
          { label: "YES", value: "yes", style: "primary" },
          { label: "NO", value: "no", style: "secondary" }
        ])},
        0
      )
    `;

    // Email capture screen
    await sql`
      INSERT INTO intro_screens (screen_type, title, subtitle, options, sort_order)
      VALUES (
        'email',
        'The only Glitch is how much help you''ll find',
        '// WE''LL SEND YOU AN ACCESS LINK',
        ${JSON.stringify({ showSkipButton: true, skipButtonText: "no email" })},
        1
      )
    `;
  }
}

// Seed default site settings if none exist
export async function seedDefaultSiteSettings() {
  await initializeSiteSettings();

  const defaults = {
    site_title: "CashGlitch",
    site_tagline: "The only Glitch is how much help you'll find",
    site_description: "CashGlitch connects you with free resources, grants, scholarships, reparations initiatives, and opportunities. Unlock abundance and fix the system for generational wealth.",
    twitter_url: "https://twitter.com/cashglitch",
    instagram_url: "",
    feature_blog: "true",
    feature_access_gate: "true",
    og_title: "CashGlitch - The System is Broken. Fix It.",
    og_description: "Unlock free resources, grants, scholarships, and opportunities. The abundance matrix is active.",
    meta_keywords: "free money,grants,scholarships,reparations,free resources,abundance,free travel,job opportunities,free computer,community resources,generational wealth,financial freedom,cash glitch",
  };

  for (const [key, value] of Object.entries(defaults)) {
    await sql`
      INSERT INTO site_settings (key, value)
      VALUES (${key}, ${value})
      ON CONFLICT (key) DO NOTHING
    `;
  }
}

// Seed default page content if none exists
export async function seedDefaultPageContent() {
  await initializePageContent();
  await initializePageItems();

  const existing = await sql`
    SELECT COUNT(*) as count FROM page_content
  `;

  if (parseInt(existing[0]?.count || "0", 10) === 0) {
    const defaultPages = [
      {
        page_slug: "npo",
        hero_title: "Non-Profit Organizations",
        hero_subtitle: "NPO Directory",
        hero_description: "Discover organizations driving reparations initiatives and creating systemic change. These nonprofits are at the forefront of building a more equitable future for our communities.",
        hero_badge_text: "NPO Directory",
        cta_title: "Know an Organization We Should Feature?",
        cta_description: "Help us grow our directory by suggesting nonprofits that are making a difference in their communities.",
        cta_button_text: "Submit an Organization",
        cta_button_link: "/contact",
        meta_title: "Non-Profit Organizations | CashGlitch",
        meta_description: "Discover non-profit organizations driving reparations initiatives and creating systemic change in communities across the nation.",
        meta_keywords: "reparations,nonprofit organizations,community development,social justice,equity initiatives,systemic change",
      },
      {
        page_slug: "sweepstakes",
        hero_title: "Sweepstakes & Opportunities",
        hero_subtitle: "Sweepstakes & Prizes",
        hero_description: "Enter sweepstakes, win prizes, access grants, scholarships, and business opportunities designed to create pathways to generational wealth. All entries are free.",
        hero_badge_text: "Sweepstakes & Prizes",
        cta_title: "Tips for Entering",
        cta_description: "Check deadlines, be authentic, and enter often.",
        cta_button_text: "View All",
        cta_button_link: "#",
        meta_title: "Sweepstakes & Opportunities | CashGlitch",
        meta_description: "Enter sweepstakes, win prizes, access grants, scholarships, and opportunities designed to build generational wealth and prosperity.",
        meta_keywords: "sweepstakes,free grants,scholarships,FAFSA,Pell Grant,win prizes,free money,financial aid,contests",
      },
      {
        page_slug: "free-travel",
        hero_title: "Free Travel Programs",
        hero_subtitle: "Travel Opportunities",
        hero_description: "Discover cultural exchange programs, educational travel opportunities, and free travel experiences that expand horizons and create connections.",
        hero_badge_text: "Free Travel",
        cta_title: "Ready to Explore?",
        cta_description: "Apply for travel opportunities and start your journey.",
        cta_button_text: "Contact Us",
        cta_button_link: "/contact",
        meta_title: "Free Travel Programs | CashGlitch",
        meta_description: "Discover free travel programs, cultural exchanges, and educational travel opportunities.",
        meta_keywords: "free travel,cultural exchange,educational travel,travel programs,study abroad",
      },
      {
        page_slug: "jobs",
        hero_title: "Career Opportunities",
        hero_subtitle: "Jobs & Careers",
        hero_description: "Find career opportunities with equity-focused organizations committed to creating meaningful change and building community wealth.",
        hero_badge_text: "Jobs & Careers",
        cta_title: "Post a Job?",
        cta_description: "Organizations can post job opportunities to reach our community.",
        cta_button_text: "Contact Us",
        cta_button_link: "/contact",
        meta_title: "Career Opportunities | CashGlitch",
        meta_description: "Find career opportunities with equity-focused organizations committed to creating meaningful change.",
        meta_keywords: "jobs,careers,employment,equity organizations,nonprofit jobs",
      },
      {
        page_slug: "partner",
        hero_title: "Partner With Us",
        hero_subtitle: "Partnerships",
        hero_description: "Join forces with CashGlitch to amplify your impact. Partner or advertise with us to reach communities seeking resources and opportunities.",
        hero_badge_text: "Partnerships",
        cta_title: "Ready to Partner?",
        cta_description: "Let's discuss how we can work together to create impact.",
        cta_button_text: "Contact Us",
        cta_button_link: "/contact",
        meta_title: "Partner With Us | CashGlitch",
        meta_description: "Partner or advertise with CashGlitch to reach communities seeking resources and opportunities.",
        meta_keywords: "partner,advertise,sponsorship,collaboration",
      },
      {
        page_slug: "donate-computer",
        hero_title: "Donate a Computer",
        hero_subtitle: "Give Technology",
        hero_description: "Give the gift of technology. Your donated computer can help bridge the digital divide and provide opportunities for education and employment.",
        hero_badge_text: "Donate PC",
        cta_title: "Ready to Donate?",
        cta_description: "Your donation makes a real difference in someone's life.",
        cta_button_text: "Start Donation",
        cta_button_link: "/contact",
        meta_title: "Donate a Computer | CashGlitch",
        meta_description: "Donate your computer to help bridge the digital divide and provide opportunities.",
        meta_keywords: "donate computer,technology donation,digital divide,pc donation",
      },
      {
        page_slug: "get-computer",
        hero_title: "Get a Free Computer",
        hero_subtitle: "Free Technology",
        hero_description: "Apply for a free computer to support your education, job search, or personal development. Technology should be accessible to everyone.",
        hero_badge_text: "Get Free PC",
        cta_title: "Apply Today",
        cta_description: "Complete our application to be considered for a free computer.",
        cta_button_text: "Apply Now",
        cta_button_link: "/contact",
        meta_title: "Get a Free Computer | CashGlitch",
        meta_description: "Apply for a free computer to support your education, job search, or personal development.",
        meta_keywords: "free computer,technology access,pc giveaway,digital access",
      },
    ];

    for (const page of defaultPages) {
      await sql`
        INSERT INTO page_content (
          page_slug, hero_title, hero_subtitle, hero_description, hero_badge_text,
          cta_title, cta_description, cta_button_text, cta_button_link,
          meta_title, meta_description, meta_keywords
        ) VALUES (
          ${page.page_slug}, ${page.hero_title}, ${page.hero_subtitle}, ${page.hero_description}, ${page.hero_badge_text},
          ${page.cta_title}, ${page.cta_description}, ${page.cta_button_text}, ${page.cta_button_link},
          ${page.meta_title}, ${page.meta_description}, ${page.meta_keywords}
        )
      `;
    }
  }
}

// Seed default page items (individual cards/records)
export async function seedDefaultPageItems() {
  await initializePageItems();

  const existing = await sql`
    SELECT COUNT(*) as count FROM page_items
  `;

  if (parseInt(existing[0]?.count || "0", 10) === 0) {
    // NPO Organizations
    const npoItems = [
      { title: "National African American Reparations Commission", description: "Working to develop a comprehensive reparations program that addresses the historic and continuing harms of slavery and discrimination.", location: "National", tags: ["Reparations", "Policy", "Advocacy"], is_featured: true },
      { title: "NAACP", description: "The nation's largest civil rights organization, working to ensure the political, educational, social, and economic equality of all persons.", location: "National", tags: ["Civil Rights", "Education", "Voting"], is_featured: true },
      { title: "National Urban League", description: "Empowering African Americans and other underserved urban residents to enter the economic and social mainstream.", location: "National", tags: ["Economic Empowerment", "Jobs", "Education"], is_featured: false },
      { title: "Black Lives Matter Global Network", description: "Building local power and intervening in violence inflicted on Black communities by the state and vigilantes.", location: "Global", tags: ["Justice", "Community", "Advocacy"], is_featured: false },
      { title: "Thurgood Marshall College Fund", description: "Supporting and representing nearly 300,000 students attending publicly-supported Historically Black Colleges and Universities.", location: "National", tags: ["Education", "Scholarships", "HBCUs"], is_featured: true },
      { title: "National Black Child Development Institute", description: "Improving and advancing the quality of life for Black children and their families through education and advocacy.", location: "National", tags: ["Children", "Education", "Family"], is_featured: false },
      { title: "Color of Change", description: "The nation's largest online racial justice organization helping people respond effectively to injustice in the world.", location: "National", tags: ["Racial Justice", "Digital Advocacy", "Corporate Accountability"], is_featured: false },
      { title: "Equal Justice Initiative", description: "Committed to ending mass incarceration and excessive punishment, challenging racial and economic injustice.", location: "Montgomery, AL", tags: ["Criminal Justice", "History", "Racial Justice"], is_featured: true },
    ];

    for (let i = 0; i < npoItems.length; i++) {
      const item = npoItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, location, tags, is_featured, sort_order) VALUES ('npo', ${item.title}, ${item.description}, ${item.location}, ${JSON.stringify(item.tags)}, ${item.is_featured}, ${i})`;
    }

    // Sweepstakes
    const sweepstakesItems = [
      { title: "FAFSA - Federal Student Aid", description: "Apply for free federal student aid including grants, work-study, and loans for college or career school.", category: "Scholarships", deadline: "Ongoing", value: "Up to $7,395/year", is_featured: true },
      { title: "Pell Grant Program", description: "Federal grant for undergraduate students with exceptional financial need. Does not need to be repaid.", category: "Grants", deadline: "Ongoing", value: "Up to $7,395/year", is_featured: true },
      { title: "Section 8 Housing Choice Voucher", description: "Federal program helping very low-income families, the elderly, and disabled afford safe housing.", category: "Housing", deadline: "Waitlist Open", value: "Varies by area", is_featured: false },
      { title: "LIHEAP - Energy Assistance", description: "Help paying heating and cooling bills for low-income households. Also covers weatherization.", category: "Housing", deadline: "Ongoing", value: "Varies", is_featured: false },
      { title: "SBA 8(a) Business Development", description: "Program helping small disadvantaged businesses compete in the marketplace with training and assistance.", category: "Business", deadline: "Ongoing", value: "Contracts & Training", is_featured: true },
      { title: "Gates Millennium Scholars Program", description: "Scholarship program for outstanding minority students with significant financial need.", category: "Scholarships", deadline: "January 2025", value: "Full Tuition", is_featured: true },
      { title: "SNAP Benefits (Food Stamps)", description: "Nutrition assistance for low-income individuals and families to buy food at authorized retailers.", category: "Grants", deadline: "Ongoing", value: "Up to $234/month", is_featured: false },
      { title: "United Negro College Fund Scholarships", description: "Multiple scholarship programs for African American students attending HBCUs and other institutions.", category: "Scholarships", deadline: "Various", value: "Up to $10,000", is_featured: false },
      { title: "Community Development Block Grants", description: "Federal funding for community development activities benefiting low and moderate-income persons.", category: "Business", deadline: "Varies by location", value: "Project-based", is_featured: false },
      { title: "Minority Business Development Agency Grants", description: "Programs supporting the growth and competitiveness of minority-owned businesses.", category: "Business", deadline: "Rolling", value: "Varies", is_featured: false },
    ];

    for (let i = 0; i < sweepstakesItems.length; i++) {
      const item = sweepstakesItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, category, deadline, value, is_featured, sort_order) VALUES ('sweepstakes', ${item.title}, ${item.description}, ${item.category}, ${item.deadline}, ${item.value}, ${item.is_featured}, ${i})`;
    }

    // Free Travel
    const travelItems = [
      { title: "Fulbright Program", description: "The flagship international educational exchange program sponsored by the U.S. government. Offers grants for study, research, and teaching abroad.", category: "Educational Exchange", location: "150+ Countries", deadline: "October 2025", value: "1 Academic Year", is_featured: true },
      { title: "Peace Corps", description: "Volunteer abroad for 27 months helping communities with education, health, environment, and economic development projects.", category: "Volunteer Service", location: "60+ Countries", deadline: "Rolling", value: "27 Months", is_featured: true },
      { title: "Gilman Scholarship", description: "Provides scholarships for undergraduate students of limited financial means to study or intern abroad.", category: "Study Abroad", location: "Worldwide", deadline: "March/October", value: "Varies", is_featured: true },
      { title: "CIEE Study Abroad Scholarships", description: "Multiple scholarships for students looking to study abroad including need-based and diversity grants.", category: "Study Abroad", location: "40+ Countries", deadline: "Varies", value: "Semester/Year", is_featured: false },
      { title: "Congress-Bundestag Youth Exchange", description: "Year-long exchange program for high school students and young professionals to live and study in Germany.", category: "Cultural Exchange", location: "Germany", deadline: "December", value: "1 Year", is_featured: false },
      { title: "NSLI-Y - Youth Language Learning", description: "Free summer and academic year programs for high school students to learn critical languages abroad.", category: "Language Immersion", location: "Various Countries", deadline: "November", value: "6 weeks - 1 year", is_featured: false },
      { title: "AmeriCorps VISTA", description: "Domestic service program that provides living allowance and education award for community work.", category: "Domestic Service", location: "United States", deadline: "Rolling", value: "1 Year", is_featured: false },
      { title: "Rotary Youth Exchange", description: "Cultural exchange program for high school students to spend a year living with host families abroad.", category: "Cultural Exchange", location: "100+ Countries", deadline: "Varies by district", value: "1 Year", is_featured: false },
    ];

    for (let i = 0; i < travelItems.length; i++) {
      const item = travelItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, category, location, deadline, value, is_featured, sort_order) VALUES ('free-travel', ${item.title}, ${item.description}, ${item.category}, ${item.location}, ${item.deadline}, ${item.value}, ${item.is_featured}, ${i})`;
    }

    // Jobs
    const jobItems = [
      { title: "Community Outreach Coordinator", description: "Urban League of Greater Atlanta", category: "Full-time", location: "Atlanta, GA", value: "$45,000 - $55,000", deadline: "2 days ago", is_featured: true },
      { title: "Program Director", description: "Black Girls CODE", category: "Full-time", location: "San Francisco, CA (Remote)", value: "$75,000 - $95,000", deadline: "1 week ago", is_featured: true },
      { title: "Grant Writer", description: "NAACP Legal Defense Fund", category: "Full-time", location: "New York, NY (Remote)", value: "$60,000 - $75,000", deadline: "3 days ago", is_featured: true },
      { title: "Social Media Manager", description: "Color of Change", category: "Full-time", location: "Remote", value: "$55,000 - $65,000", deadline: "5 days ago", is_featured: false },
      { title: "Youth Program Facilitator", description: "Boys & Girls Clubs of America", category: "Part-time", location: "Chicago, IL", value: "$20 - $25/hour", deadline: "1 day ago", is_featured: false },
      { title: "Development Associate", description: "United Negro College Fund", category: "Full-time", location: "Washington, DC", value: "$50,000 - $60,000", deadline: "4 days ago", is_featured: false },
      { title: "Policy Analyst", description: "National Urban League", category: "Full-time", location: "New York, NY (Remote)", value: "$65,000 - $80,000", deadline: "2 weeks ago", is_featured: false },
      { title: "Communications Specialist", description: "Equal Justice Initiative", category: "Full-time", location: "Montgomery, AL", value: "$55,000 - $70,000", deadline: "1 week ago", is_featured: false },
    ];

    for (let i = 0; i < jobItems.length; i++) {
      const item = jobItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, category, location, value, deadline, is_featured, sort_order) VALUES ('jobs', ${item.title}, ${item.description}, ${item.category}, ${item.location}, ${item.value}, ${item.deadline}, ${item.is_featured}, ${i})`;
    }

    // Partner types
    const partnerItems = [
      { title: "Community Partner", description: "Join our network of organizations committed to creating pathways to prosperity. Get featured in our directory and reach people actively seeking resources.", category: "Partnership", tags: ["Featured listing in NPO directory", "Cross-promotion on social media", "Access to partnership events", "Collaboration opportunities"], is_featured: true },
      { title: "Corporate Sponsor", description: "Align your brand with our mission of abundance and equity. Sponsor programs, events, or specific initiatives that create lasting impact.", category: "Sponsorship", tags: ["Brand visibility on our platform", "Sponsorship recognition", "CSR reporting support", "Community engagement opportunities"], is_featured: true },
      { title: "Advertiser", description: "Reach our engaged audience of people actively seeking opportunities for advancement. Ethical advertising that serves our community.", category: "Advertising", tags: ["Targeted reach to motivated audience", "Banner and sponsored content options", "Newsletter placements", "Category-specific advertising"], is_featured: true },
    ];

    for (let i = 0; i < partnerItems.length; i++) {
      const item = partnerItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, category, tags, is_featured, sort_order) VALUES ('partner', ${item.title}, ${item.description}, ${item.category}, ${JSON.stringify(item.tags)}, ${item.is_featured}, ${i})`;
    }

    // Donate Computer - Accepted devices
    const donateItems = [
      { title: "Laptops", description: "5 years old or newer, working condition", category: "Accepted Device", is_featured: true },
      { title: "Desktop Computers", description: "5 years old or newer, working condition", category: "Accepted Device", is_featured: true },
      { title: "Tablets", description: "3 years old or newer, working condition", category: "Accepted Device", is_featured: false },
      { title: "Monitors", description: "Working condition, no CRT monitors", category: "Accepted Device", is_featured: false },
    ];

    for (let i = 0; i < donateItems.length; i++) {
      const item = donateItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, category, is_featured, sort_order) VALUES ('donate-computer', ${item.title}, ${item.description}, ${item.category}, ${item.is_featured}, ${i})`;
    }

    // Get Computer - Eligibility criteria
    const getItems = [
      { title: "Students", description: "Currently enrolled students at any level who need a computer for coursework and studies.", category: "Eligibility", is_featured: true },
      { title: "Job Seekers", description: "Individuals actively searching for employment who need technology to apply for jobs.", category: "Eligibility", is_featured: true },
      { title: "Low-Income Families", description: "Families who cannot afford to purchase a computer for their household.", category: "Eligibility", is_featured: true },
      { title: "Nonprofit Workers", description: "Staff at qualifying nonprofits who need equipment to serve their communities.", category: "Eligibility", is_featured: true },
    ];

    for (let i = 0; i < getItems.length; i++) {
      const item = getItems[i];
      await sql`INSERT INTO page_items (page_slug, title, description, category, is_featured, sort_order) VALUES ('get-computer', ${item.title}, ${item.description}, ${item.category}, ${item.is_featured}, ${i})`;
    }
  }
}

// Initialize page_content table for editable page sections
export async function initializePageContent() {
  await sql`
    CREATE TABLE IF NOT EXISTS page_content (
      id SERIAL PRIMARY KEY,
      page_slug VARCHAR(50) NOT NULL UNIQUE,
      hero_title VARCHAR(255) NOT NULL,
      hero_subtitle TEXT,
      hero_description TEXT,
      hero_badge_text VARCHAR(100),
      cta_title VARCHAR(255),
      cta_description TEXT,
      cta_button_text VARCHAR(100),
      cta_button_link VARCHAR(255),
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(page_slug)
  `;
}

// Initialize page_items table for list items on each page
export async function initializePageItems() {
  await sql`
    CREATE TABLE IF NOT EXISTS page_items (
      id SERIAL PRIMARY KEY,
      page_slug VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      location VARCHAR(255),
      deadline VARCHAR(100),
      value VARCHAR(100),
      website VARCHAR(500),
      tags JSONB,
      is_featured BOOLEAN DEFAULT FALSE,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_page_items_slug ON page_items(page_slug)
  `;
}

// Utility: Clean up expired tokens and sessions
export async function cleanupExpiredRecords() {
  await sql`DELETE FROM auth_tokens WHERE expires_at < NOW()`;
  await sql`DELETE FROM sessions WHERE expires_at < NOW()`;
}
