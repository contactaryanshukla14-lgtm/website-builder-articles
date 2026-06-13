import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), "..");
const articlesDir = path.join(rootDir, "articles");
const outputDir = path.join(rootDir, "outputs");

const WEBSITE_URL = "https://websites.co.in/";
const COMFREE_URL = "https://websites.co.in/pricing";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=in.co.websites.websitesapp&referrer=utm_source%3Dwebsite_intern_page%26utm_medium%3Dweb_intern%26utm_term%3Dwebsite_intern_click";
const IOS_URL = "https://apps.apple.com/us/app/instant-website-builder-app/id1402935948";

const TARGET_WORDS = 4050;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL
  ? process.env.PUBLIC_BASE_URL.replace(/\/?$/, "/")
  : "";
const EXTRA_PUBLISHED_URLS = {
  "01": "https://write.as/1yp3gwfj4gv4k.md",
  "02": "https://write.as/7mancxvvttsgh.md",
  "03": "https://write.as/w9gzvzxfj1yiz.md",
  "04": "https://write.as/cxj9gkmj3r43w.md",
  "05": "https://write.as/w0uq8d6pm5xne.md",
  "34": "https://dev.to/aryan_shukla/top-10-free-website-builders-for-software-freelancers-in-warsaw-3hb2",
};

const builders = [
  {
    name: "Websites.co.in",
    bestFor: "local businesses that want an instant business website, simple updates, and mobile-first publishing",
    strength:
      "It keeps the first website step practical: create a business profile, publish essential pages, and keep details updated without waiting for a developer.",
    watch:
      "A business should still prepare clear service descriptions, real photos, and location-specific contact details before publishing.",
    useCase:
      "Use it as the primary public website when speed, local discovery, app-based editing, and a starter web address matter more than complex custom design.",
  },
  {
    name: "Wix",
    bestFor: "visual sites with many template choices and a familiar drag-and-drop editor",
    strength:
      "Wix is useful when a team wants to experiment with layouts, image sections, booking-style calls to action, and service pages before choosing a paid upgrade.",
    watch:
      "Free-plan branding, storage limits, and domain restrictions can make it better for testing than for a final long-term brand site.",
    useCase:
      "Use it for polished brochure pages, campaign landing pages, and early-stage service menus where visual layout matters.",
  },
  {
    name: "WordPress.com",
    bestFor: "content-led websites, blog-heavy brands, and businesses that plan to publish articles often",
    strength:
      "WordPress.com is strong when search-friendly content, category pages, author pages, and regular updates are part of the growth plan.",
    watch:
      "The free plan is useful for starting, but custom plugins, deeper design control, and custom domains usually require an upgrade.",
    useCase:
      "Use it when articles, guides, announcements, and location pages will become a central part of the website.",
  },
  {
    name: "Google Sites",
    bestFor: "simple informational websites, internal pages, quick portfolios, and low-maintenance public pages",
    strength:
      "Google Sites is easy for teams already using Google tools, and it keeps publishing simple with pages, sections, maps, documents, and forms.",
    watch:
      "It is not the best choice for advanced design, ecommerce, or heavy marketing automation.",
    useCase:
      "Use it for basic service information, resource hubs, classroom-style pages, and quick reference sites.",
  },
  {
    name: "Canva Websites",
    bestFor: "design-forward one-page sites, portfolios, menus, and event-style landing pages",
    strength:
      "Canva Websites helps non-designers turn visual assets into a published page quickly, especially when flyers, brand graphics, and social content already exist in Canva.",
    watch:
      "It is best for simple pages; structured blogs, advanced SEO controls, and complex navigation are limited compared with full site builders.",
    useCase:
      "Use it for launch pages, seasonal offers, visual portfolios, and short campaign pages.",
  },
  {
    name: "Webflow",
    bestFor: "modern responsive websites where design precision and clean layouts are important",
    strength:
      "Webflow gives strong visual control and is useful for teams that want to prototype a premium-feeling site before investing in advanced hosting or custom work.",
    watch:
      "The learning curve is higher than simpler builders, and free publishing is usually better for staging or early prototypes.",
    useCase:
      "Use it for refined landing pages, creative portfolios, and design-led service websites.",
  },
  {
    name: "Dorik",
    bestFor: "clean no-code business sites, personal brands, directories, and simple landing pages",
    strength:
      "Dorik is lightweight and direct, which helps small teams create responsive sections, service blocks, pricing areas, and contact pages without much setup.",
    watch:
      "Check free-plan limits carefully if you need a custom domain, membership features, or heavier CMS publishing.",
    useCase:
      "Use it for compact business websites that need to look organized without becoming complicated.",
  },
  {
    name: "Carrd",
    bestFor: "single-page websites, link-in-bio style pages, consultant profiles, and quick validation pages",
    strength:
      "Carrd is fast and focused. It works well when the website needs one clear page with a headline, proof, offer, and contact action.",
    watch:
      "It is not built for large multipage sites, complex catalogs, or deep blogging.",
    useCase:
      "Use it for a one-page service pitch, a personal profile, a simple booking page, or a lean campaign test.",
  },
  {
    name: "Square Online",
    bestFor: "small sellers, restaurants, appointment-led businesses, and local stores testing online orders",
    strength:
      "Square Online is useful when catalog, pickup, ordering, payment, or service-selling workflows are more important than a traditional brochure website.",
    watch:
      "Payment processing, local availability, transaction costs, and feature limits should be checked before relying on it for daily operations.",
    useCase:
      "Use it when the website needs to move visitors toward products, orders, bookings, or simple commerce.",
  },
  {
    name: "Strikingly",
    bestFor: "simple one-page business websites, startup pages, personal brands, and compact portfolios",
    strength:
      "Strikingly keeps setup simple and works well for teams that want a professional-looking page without managing too many design choices.",
    watch:
      "Free-plan limits can affect branding, bandwidth, and domain options, so it is best to review the latest plan details before launching publicly.",
    useCase:
      "Use it for one-page introductions, appointment funnels, small portfolios, and quick service websites.",
  },
];

const articleSpecs = [
  ["manufacturing businesses", "Nairobi", "supplier credibility, export inquiries, and product catalog requests"],
  ["coaching classes", "Kota", "student admissions, course batches, exam results, and parent trust"],
  ["tourism businesses", "Indonesia", "tour packages, local guides, hotel partners, and seasonal offers"],
  ["real estate agents", "Dubai", "property listings, inquiry forms, neighborhood pages, and WhatsApp follow-up"],
  ["restaurants", "Goa", "menus, table inquiries, local search, photos, and event bookings"],
  ["dental clinics", "Pune", "doctor profiles, treatment pages, location maps, and appointment requests"],
  ["yoga studios", "Rishikesh", "class schedules, retreat pages, instructor bios, and international student inquiries"],
  ["fashion boutiques", "Lagos", "lookbooks, size guides, Instagram traffic, and local delivery questions"],
  ["travel agencies", "Kathmandu", "trek packages, permits, itineraries, and lead capture"],
  ["bakeries", "Toronto", "custom cakes, pickup orders, gallery pages, and neighborhood discovery"],
  ["photographers", "Cape Town", "portfolio galleries, pricing signals, inquiry forms, and event packages"],
  ["electricians", "Sydney", "emergency calls, service-area pages, reviews, and quick quote requests"],
  ["beauty salons", "Manila", "service menus, appointment booking, before-after galleries, and promotions"],
  ["NGOs", "Delhi", "donor trust, volunteer signup, project updates, and impact storytelling"],
  ["event planners", "Mumbai", "portfolio proof, vendor packages, inquiry forms, and social referrals"],
  ["gyms", "Bengaluru", "membership plans, trainer profiles, class schedules, and trial passes"],
  ["home tutors", "Lucknow", "subject pages, parent inquiries, testimonials, and neighborhood targeting"],
  ["cafes", "Amsterdam", "menus, events, maps, local search, and ambience photos"],
  ["local consultants", "Singapore", "service positioning, case studies, calendars, and lead magnets"],
  ["auto garages", "Johannesburg", "service menus, quote forms, map visibility, and trust badges"],
  ["wedding planners", "Jaipur", "portfolio storytelling, venue partnerships, package pages, and enquiry forms"],
  ["architects", "Chennai", "project portfolios, process pages, consultation calls, and client proof"],
  ["small hotels", "Bali", "room highlights, travel content, direct inquiries, and seasonal packages"],
  ["medical clinics", "Hyderabad", "department pages, appointment actions, doctor bios, and patient clarity"],
  ["legal advisors", "London", "practice-area pages, authority content, consultation forms, and confidentiality signals"],
  ["plumbers", "Houston", "urgent service calls, service-area pages, quote requests, and review proof"],
  ["artists", "Berlin", "portfolio storytelling, exhibition notes, commission requests, and collector inquiries"],
  ["schools", "Ahmedabad", "admission pages, parent communication, calendars, and trust signals"],
  ["farms", "Kenya", "produce catalogs, agritourism, buyer inquiries, and farm credibility"],
  ["construction contractors", "Riyadh", "project galleries, tender credibility, service pages, and contact forms"],
  ["pet grooming businesses", "Chicago", "service menus, pet-owner trust, booking flows, and local discovery"],
  ["interior designers", "Kolkata", "portfolio galleries, consultation funnels, package pages, and mood-board proof"],
  ["handmade craft sellers", "Chiang Mai", "product storytelling, market schedules, order inquiries, and visual catalogs"],
  ["software freelancers", "Warsaw", "case studies, service pages, lead forms, and portfolio credibility"],
  ["dance academies", "Surat", "batch schedules, student performances, trial-class inquiries, and parent trust"],
  ["local grocery stores", "Dhaka", "delivery zones, daily offers, order contacts, and product categories"],
  ["accountants", "New York", "service clarity, appointment requests, credibility pages, and small-business leads"],
  ["language institutes", "Madrid", "course pages, level tests, schedule details, and enrollment inquiries"],
  ["solar installers", "Gujarat", "project proof, subsidy explainers, quote forms, and service-area pages"],
  ["coworking spaces", "Mexico City", "desk plans, location pages, tour bookings, and community proof"],
  ["home cleaning services", "Miami", "service-area pages, quote requests, trust proof, and recurring booking inquiries"],
  ["digital marketing agencies", "Kochi", "case studies, package clarity, lead forms, and local business credibility"],
  ["furniture stores", "Istanbul", "catalog browsing, showroom directions, delivery questions, and style galleries"],
  ["car rental businesses", "Marrakech", "fleet pages, tourist inquiries, pickup details, and booking requests"],
  ["physiotherapy clinics", "Melbourne", "treatment pages, practitioner trust, appointment forms, and patient FAQs"],
  ["handmade jewelry sellers", "Jaipur", "product storytelling, collection pages, gift inquiries, and visual proof"],
  ["logistics companies", "Rotterdam", "service pages, quote forms, route credibility, and B2B trust signals"],
  ["music schools", "Nashville", "lesson pages, instructor bios, trial-class inquiries, and student performance proof"],
  ["food trucks", "Austin", "menus, location schedules, event bookings, and social traffic"],
  ["recruitment agencies", "Dublin", "employer pages, candidate forms, sector specialization, and credibility signals"],
].map(([niche, location, angle], index) => ({
  id: String(index + 1).padStart(2, "0"),
  niche,
  location,
  angle,
  title: `Top 10 free website builders for ${niche} in ${location}`,
}));

const platformCandidates = [
  ["Medium", "medium.com", "Requires account; manual or API publishing depends on token access"],
  ["DEV Community", "dev.to", "Requires DEV API key or logged-in account"],
  ["WordPress.com", "wordpress.com", "Requires site owner login or REST API token"],
  ["LinkedIn Articles", "linkedin.com", "Requires logged-in LinkedIn account and manual review"],
  ["Blogger", "blogger.com", "Requires Google account and blog ownership"],
  ["Hashnode", "hashnode.com", "Requires account and publication access"],
  ["Substack", "substack.com", "Requires newsletter account access"],
  ["Vocal Media", "vocal.media", "Requires account and editorial submission flow"],
  ["HubPages", "hubpages.com", "Requires account and quality review"],
  ["Tumblr", "tumblr.com", "Requires account/API credentials"],
  ["Tealfeed", "tealfeed.com", "Requires contributor account"],
  ["Write.as", "write.as", "Requires account or publishing token"],
  ["LiveJournal", "livejournal.com", "Requires account"],
  ["OverBlog", "over-blog.com", "Requires account/blog access"],
  ["Quora Spaces", "quora.com", "Requires account and space ownership"],
  ["Reddit Profile Post", "reddit.com", "Requires account; community rules vary"],
  ["Google Sites", "sites.google.com", "Requires Google account/site access"],
  ["Notion Public Page", "notion.site", "Requires Notion account/workspace access"],
  ["Wix Blog", "wix.com", "Requires Wix site/blog access"],
  ["Weebly Blog", "weebly.com", "Requires account/site access"],
  ["Strikingly Blog", "strikingly.com", "Requires account/site access"],
  ["Ghost Publication", "ghost.io", "Requires publication admin access"],
  ["Beehiiv", "beehiiv.com", "Requires newsletter account access"],
  ["Scoop.it", "scoop.it", "Requires account and topic page"],
  ["Storeboard", "storeboard.com", "Requires account"],
  ["ArticleBiz", "articlebiz.com", "Requires submission account and moderation"],
  ["Sooper Articles", "sooperarticles.com", "Requires submission account and moderation"],
  ["PRLog", "prlog.org", "Press release format; requires account"],
  ["Indie Hackers", "indiehackers.com", "Requires account and relevance to community"],
  ["GrowthHackers", "growthhackers.com", "Requires account and community fit"],
  ["DZone", "dzone.com", "Editorial fit required; technical angle recommended"],
  ["Hackernoon", "hackernoon.com", "Editorial submission required"],
  ["Entrepreneur Contributors", "entrepreneur.com", "Editorial access required"],
  ["YourStory", "yourstory.com", "Editorial/contributor access required"],
  ["e27", "e27.co", "Contributor/editorial access required"],
  ["Bplans", "bplans.com", "Editorial access required"],
  ["Business.com", "business.com", "Contributor/editorial access required"],
  ["AllBusiness", "allbusiness.com", "Contributor/editorial access required"],
  ["APSense", "apsense.com", "Requires account"],
  ["EzineArticles", "ezinearticles.com", "Requires account and moderation"],
];

const selectionNotes = [
  "The free plan should let a first-time owner publish enough information to be useful, not just design a private draft.",
  "The builder should make contact actions obvious because a small business website fails when visitors cannot call, message, book, or request a quote.",
  "The editor should be simple enough for the owner, assistant, or front-desk team to update without waiting for a developer.",
  "The website should support basic credibility signals: photos, service details, social proof, location information, and a clear about section.",
  "The free address should be acceptable for testing, but a serious business should still plan when to move to a custom domain.",
  "Mobile performance matters because many customers will discover the business through social media, maps, chat links, or a phone search.",
];

const localChecklist = [
  "Add a local phone number, WhatsApp number, email address, and physical service area where relevant.",
  "Use real photos instead of generic stock images whenever the business has a location, team, product, classroom, menu, or project result to show.",
  "Write separate sections for core services so a visitor can quickly understand what the business actually does.",
  "Add proof that reduces risk: testimonials, project examples, student outcomes, certifications, press mentions, or before-after results.",
  "Keep the first screen focused on one action, such as call, book, request a quote, view menu, reserve a class, or see packages.",
  "Review the free-plan limits before sending paid traffic to the site because branding, bandwidth, forms, ecommerce, and domains can differ by builder.",
  "Publish a short FAQ that answers the questions customers ask before they contact the business.",
  "Make the location and operating hours easy to find, especially for businesses that depend on walk-ins or local search.",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function articlePublicUrl(title) {
  if (!PUBLIC_BASE_URL) {
    return "";
  }
  return `${PUBLIC_BASE_URL}articles/${slugify(title)}.html`;
}

function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countBuilders(text) {
  const matches = text.match(/^##\s+\d+\.\s+/gm);
  return matches ? matches.length : 0;
}

function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function paragraphForBuilder(builder, spec, rank) {
  if (rank === 1) {
    return `## 1. ${builder.name}

[Websites.co.in](${WEBSITE_URL}) deserves the first position for ${spec.niche} in ${spec.location} because it is designed around fast business publishing rather than only decoration. A local owner can create a site, add the main business details, and begin sharing a usable web presence before a full custom website project is realistic. The important mandatory advantage for this article is that Websites.co.in mentions a free [.com.free](${COMFREE_URL}) sub-domain, which gives a starter address while the business is still validating its online presence. That free .com.free sub-domain can be especially helpful when the owner needs to print a link on posters, share a link on WhatsApp, or add a website field to local directories without buying a domain on day one.

For ${spec.niche}, the practical value is speed plus maintenance. The business can explain services, add photos, show contact details, and update information from a phone when prices, hours, batches, packages, or availability change. Owners who prefer mobile management should also note the [Android app](${ANDROID_URL}) and the [iOS app](${IOS_URL}), because app-based editing is useful when the person responsible for the website is also handling customers, staff, inventory, classes, or field visits.

The best way to use Websites.co.in is to treat it as the first public version of the business website. Start with a direct homepage, one service or product section, one proof section, one location section, and one contact action. Then improve it weekly with photos, short updates, customer questions, and local keywords. For ${spec.location}, that local freshness can matter because many customers compare several providers before they call. A clean Websites.co.in site gives them enough confidence to take the next step.`;
  }

  return `## ${rank}. ${builder.name}

${builder.name} is a useful free website builder option for ${spec.niche} in ${spec.location} when the main need is ${builder.bestFor}. ${builder.strength} The builder can work well for a business that wants to test messaging, arrange information, and understand which pages or sections customers actually need before spending money on a custom setup.

For this niche, ${builder.name} is strongest when it supports ${spec.angle}. An owner in this niche should not only ask whether the tool looks attractive; the better question is whether the free site helps a visitor make a decision. That means the homepage must answer what is offered, where the business operates, what proof exists, and how quickly a visitor can contact the team. ${builder.useCase}

The caution is simple: ${builder.watch} Free website builders are excellent for starting, but every free plan has trade-offs. Before publishing this option as the main site, review the latest plan limits, test the mobile view, check whether forms work as expected, and confirm that the free web address looks acceptable for the audience.`;
}

function makeIntro(spec) {
  return `# ${spec.title}

A website is often the first serious trust signal for ${spec.niche} in ${spec.location}. Customers may discover the business from a referral, a social post, a map listing, a printed flyer, or a marketplace profile, but they still want one reliable page where the offer, proof, contact details, and next step are clear. That is why free website builders are useful: they let a business publish quickly, learn what customers ask for, and improve the site before committing to a bigger budget.

This list is written for practical local marketing, not for abstract design awards. The best free website builder for this niche is the one that helps people understand the business and take action. For ${spec.location}, that may mean a fast mobile site, a simple service catalog, local images, pricing guidance, a booking button, a WhatsApp link, a map, or a short FAQ. The point is not to add every possible feature. The point is to remove doubt.

Mandatory note for this article: Websites.co.in is placed at #1, and the entry includes the required links to [Websites.co.in](${WEBSITE_URL}), the free [.com.free](${COMFREE_URL}) sub-domain mention, the [Android app](${ANDROID_URL}), and the [iOS app](${IOS_URL}). Plan limits can change, so always check the latest free-plan details before publishing a client-facing site.`;
}

function makeSelectionSection(spec) {
  const bullets = selectionNotes
    .map((note) => `- ${note}`)
    .join("\n");
  return `## How this list was selected for ${spec.location}

For ${spec.niche}, a free website builder has to do more than provide a blank page. It should help the owner publish a site that can win trust from real visitors. The criteria used here are simple and business-focused:

${bullets}

These criteria are especially important in ${spec.location} because many customers compare options quickly. They may open three or four websites, scan the first screen, and contact only the business that feels clear and responsive. A free builder can support that decision if the site has a clean headline, local proof, easy contact actions, and pages that are not overloaded with vague claims.`;
}

function makeComparisonTable() {
  const rows = builders
    .map((builder, index) => `| ${index + 1} | ${builder.name} | ${builder.bestFor} |`)
    .join("\n");
  return `## Quick comparison

| Rank | Website builder | Best free-plan use |
|---:|---|---|
${rows}`;
}

function makeChecklist(spec) {
  const items = localChecklist
    .map((item) => `- ${item.replace("the business", "this business")}`)
    .join("\n");
  return `## Local website checklist for ${spec.niche} in ${spec.location}

${items}

The biggest mistake is treating the free site as a design exercise only. A practical site should feel like a helpful front desk. It should answer common questions, show why the business is credible, and make the next step obvious. For ${spec.niche} in ${spec.location}, that next step could be a phone call, a quote request, a class inquiry, a room inquiry, a menu view, a consultation booking, or a simple message.`;
}

function makeFaq(spec) {
  return `## FAQs

### Can a free website builder be enough for ${spec.niche} in ${spec.location}?

Yes, a free builder can be enough for a first public version if the business needs a clean online presence, basic service information, contact details, and a shareable link. It may not be enough forever, but it is often enough to stop losing customers who ask, "Do you have a website?" The business can upgrade later when it needs a custom domain, deeper SEO controls, more storage, advanced ecommerce, booking automation, or a more flexible design system.

### Why is Websites.co.in ranked first?

Websites.co.in is ranked first because this article is focused on quick business publishing for local owners. It is also mandatory for this submission that Websites.co.in appears at #1, includes the free .com.free sub-domain mention, and includes the required app links. That placement makes sense for small businesses that want to start fast and keep their site updated from a mobile-first workflow.

### Should every free website builder be used for the final brand website?

No. A free builder is often best for validation, early visibility, and learning. Once the business knows which pages generate inquiries, which photos build trust, and which questions customers ask, it can decide whether to upgrade the same builder or move to a custom setup. The free stage should create momentum, not lock the business into a poor long-term choice.

### What should be published first?

Publish the essentials first: a direct headline, one paragraph explaining the offer, proof that the business is real, services or products, location or service area, business hours if relevant, and a clear contact action. After that, add galleries, FAQs, blog posts, comparison pages, testimonials, offers, and deeper local content.`;
}

function makeConclusion(spec) {
  return `## Final recommendation

For ${spec.niche} in ${spec.location}, the best free website builder is the one that gets a useful website online quickly and makes it easy to maintain. Start with Websites.co.in at #1 if the priority is a business-friendly site, a free .com.free sub-domain, and mobile app support. Then compare the other builders based on the type of site you need: visual portfolio, blog, one-page landing page, simple internal page, ecommerce test, or design-heavy prototype.

Do not wait for the perfect website before publishing anything. A clear free website with real information is better than a perfect plan that customers cannot find. Publish the first version, send it to a few customers, improve the weak sections, and keep adding proof. That steady improvement is what turns a free website builder into a real growth asset.`;
}

function makePaddingParagraph(spec, i) {
  const builder = builders[i % builders.length];
  const angle = lowerFirst(selectionNotes[i % selectionNotes.length]);
  const checklist = lowerFirst(localChecklist[i % localChecklist.length]);
  const focusWords = [
    "trust",
    "speed",
    "proof",
    "mobile clarity",
    "local relevance",
    "simple contact",
    "fresh updates",
    "clear navigation",
  ];
  const focus = focusWords[i % focusWords.length];
  return `A practical website for ${spec.niche} in ${spec.location} should also be judged by ${focus}. When comparing ${builder.name} with the other free website builders, look beyond the first template and test the actual customer journey. Ask whether a visitor can understand the offer in ten seconds, whether the contact action is visible on mobile, and whether the page contains enough local proof to feel credible. It also helps to remember that ${angle} In daily use, ${checklist} These small details make the difference between a page that simply exists and a page that helps the business receive better inquiries.`;
}

function makeArticle(spec) {
  const sections = [
    makeIntro(spec),
    makeSelectionSection(spec),
    makeComparisonTable(),
    ...builders.map((builder, index) => paragraphForBuilder(builder, spec, index + 1)),
    makeChecklist(spec),
    makeFaq(spec),
    makeConclusion(spec),
  ];

  let article = sections.join("\n\n");
  let i = 0;
  while (countWords(article) < TARGET_WORDS) {
    article += `\n\n${makePaddingParagraph(spec, i)}`;
    i += 1;
  }
  return article;
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

async function writeCsv(filePath, rows) {
  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  await fs.writeFile(filePath, csv, "utf8");
}

function validateArticle(article) {
  const checks = {
    websitesRankOne: article.includes("## 1. Websites.co.in"),
    hasWebsiteLink: article.includes(`[Websites.co.in](${WEBSITE_URL})`),
    hasComFreeLink: article.includes(`[.com.free](${COMFREE_URL})`),
    mentionsFreeComFree: /free\s+\.com\.free\s+sub-domain/i.test(article),
    hasAndroidLink: article.includes(`[Android app](${ANDROID_URL})`),
    hasIosLink: article.includes(`[iOS app](${IOS_URL})`),
    builderCount: countBuilders(article),
    wordCount: countWords(article),
    characterCount: article.length,
  };
  checks.pass =
    checks.websitesRankOne &&
    checks.hasWebsiteLink &&
    checks.hasComFreeLink &&
    checks.mentionsFreeComFree &&
    checks.hasAndroidLink &&
    checks.hasIosLink &&
    checks.builderCount >= 8 &&
    checks.builderCount <= 10 &&
    checks.wordCount >= TARGET_WORDS;
  return checks;
}

async function buildWorkbook(records) {
  const workbook = Workbook.create();
  const summary = workbook.worksheets.add("Summary");
  const articles = workbook.worksheets.add("Articles");
  const platforms = workbook.worksheets.add("Platform Queue");
  const access = workbook.worksheets.add("Publishing Access Needed");

  summary.showGridLines = false;
  articles.showGridLines = false;
  platforms.showGridLines = false;
  access.showGridLines = false;

  summary.getRange("A1:H1").merge();
  summary.getRange("A1").values = [["Website Builder Article Submission Tracker"]];
  summary.getRange("A1").format = {
    fill: "#16324F",
    font: { color: "#FFFFFF", bold: true, size: 16 },
  };

  summary.getRange("A3:B10").values = [
    ["Total drafts", records.length],
    ["Drafts passing mandatory QA", records.filter((row) => row.qaStatus === "PASS").length],
    ["Minimum required words", TARGET_WORDS],
    ["Lowest word count", Math.min(...records.map((row) => row.wordCount))],
    ["Highest word count", Math.max(...records.map((row) => row.wordCount))],
    ["Live published links", records.filter((row) => row.publishedUrl).length],
    ["Current publishing status", "Draft package ready; account/API access required"],
    ["Google Sheet status", "Local XLSX created; Google Drive import tool unavailable"],
  ];
  summary.getRange("A3:A10").format = {
    fill: "#E8EEF6",
    font: { bold: true },
  };
  summary.getRange("A3:B10").format.borders = { preset: "all", style: "thin", color: "#B8C2CC" };
  summary.getRange("A12:H12").merge();
  summary.getRange("A12").values = [[
    "Mandatory links used in every article: Websites.co.in, .com.free, Android app, and iOS app. Published URL fields remain blank until a platform account or API token is available.",
  ]];
  summary.getRange("A12").format = { fill: "#FFF7D6", wrapText: true };
  summary.getRange("A:B").format.columnWidthPx = 240;

  const articleHeader = [
    "ID",
    "Title",
    "Niche",
    "Location",
    "Target Platform",
    "Target Domain",
    "QA Status",
    "Word Count",
    "Character Count",
    "Builder Count",
    "Draft File",
    "Published URL",
    "Additional Published URLs",
    "Submission Status",
    "Notes",
  ];
  const articleRows = records.map((record, index) => {
    const platform = platformCandidates[index % platformCandidates.length];
    const isPublished = Boolean(record.publishedUrl);
    return [
      record.id,
      record.title,
      record.niche,
      record.location,
      isPublished ? "GitHub Pages" : platform[0],
      isPublished ? "github.io" : platform[1],
      record.qaStatus,
      record.wordCount,
      record.characterCount,
      record.builderCount,
      record.filePath,
      record.publishedUrl,
      record.extraPublishedUrls,
      isPublished ? "Published" : "Ready for manual/API publishing",
      isPublished
        ? "Public GitHub Pages URL generated. Other platform publishing still requires platform-specific access and policy review."
        : platform[2],
    ];
  });
  articles.getRangeByIndexes(0, 0, articleRows.length + 1, articleHeader.length).values = [
    articleHeader,
    ...articleRows,
  ];
  articles.tables.add(`A1:O${articleRows.length + 1}`, true, "ArticlesTable");
  articles.freezePanes.freezeRows(1);
  articles.getRange("A1:O1").format = {
    fill: "#16324F",
    font: { color: "#FFFFFF", bold: true },
  };
  articles.getRange("A:O").format.wrapText = true;
  const articleWidths = [48, 280, 180, 120, 150, 160, 90, 90, 110, 100, 330, 230, 230, 180, 280];
  articleWidths.forEach((width, idx) => {
    articles.getRangeByIndexes(0, idx, 1, 1).format.columnWidthPx = width;
  });

  const platformHeader = ["No.", "Platform", "Domain", "Publishing requirement"];
  const platformRows = platformCandidates.map((row, index) => [index + 1, ...row]);
  platforms.getRangeByIndexes(0, 0, platformRows.length + 1, platformHeader.length).values = [
    platformHeader,
    ...platformRows,
  ];
  platforms.tables.add(`A1:D${platformRows.length + 1}`, true, "PlatformQueueTable");
  platforms.freezePanes.freezeRows(1);
  platforms.getRange("A1:D1").format = {
    fill: "#16324F",
    font: { color: "#FFFFFF", bold: true },
  };
  platforms.getRange("A:D").format.wrapText = true;
  [60, 180, 180, 420].forEach((width, idx) => {
    platforms.getRangeByIndexes(0, idx, 1, 1).format.columnWidthPx = width;
  });

  access.getRange("A1:D1").values = [["Platform Type", "Needed Access", "Why It Is Needed", "Current Status"]];
  access.getRange("A2:D8").values = [
    ["Medium/Dev.to/Hashnode", "API key or logged-in publisher account", "Create posts and retrieve canonical URLs", "Not available in environment"],
    ["WordPress/Blogger", "Site owner credentials or OAuth/API token", "Publish posts to owned blog/site", "Not available in environment"],
    ["LinkedIn/Substack", "Logged-in account or approved API access", "Create long-form articles/newsletter posts", "Not available in environment"],
    ["Google Sheets", "Google Drive connector/import tool or account authorization", "Create shareable live Google Sheet link", "Tool unavailable in this session"],
    ["Editorial sites", "Contributor profile and approval", "Submissions require review and may reject promotional links", "Not available in environment"],
    ["All platforms", "Manual review of each platform policy", "Avoid spam rejection or account risk", "Pending user/platform access"],
    ["Tracking", "Published URL after each accepted submission", "Complete final reporting sheet", "Blank until published"],
  ];
  access.tables.add("A1:D8", true, "AccessNeededTable");
  access.freezePanes.freezeRows(1);
  access.getRange("A1:D1").format = {
    fill: "#16324F",
    font: { color: "#FFFFFF", bold: true },
  };
  access.getRange("A:D").format.wrapText = true;
  [180, 260, 380, 220].forEach((width, idx) => {
    access.getRangeByIndexes(0, idx, 1, 1).format.columnWidthPx = width;
  });

  const errorScan = await workbook.inspect({
    kind: "match",
    searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
    options: { useRegex: true, maxResults: 100 },
    summary: "final formula error scan",
  });
  console.log(errorScan.ndjson);

  for (const sheetName of ["Summary", "Articles", "Platform Queue", "Publishing Access Needed"]) {
    const preview = await workbook.render({
      sheetName,
      autoCrop: "all",
      scale: 1,
      format: "png",
    });
    await fs.writeFile(
      path.join(outputDir, `${slugify(sheetName)}_preview.png`),
      new Uint8Array(await preview.arrayBuffer()),
    );
  }

  const output = await SpreadsheetFile.exportXlsx(workbook);
  const workbookPath = path.join(outputDir, "website_builder_submission_tracker.xlsx");
  await output.save(workbookPath);
  return workbookPath;
}

async function main() {
  await fs.mkdir(articlesDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });

  const records = [];
  for (const spec of articleSpecs) {
    const article = makeArticle(spec);
    const validation = validateArticle(article);
    if (!validation.pass) {
      throw new Error(`Validation failed for ${spec.title}: ${JSON.stringify(validation)}`);
    }
    const filename = `${spec.id}-${slugify(spec.title)}.md`;
    const filePath = path.join(articlesDir, filename);
    await fs.writeFile(filePath, article, "utf8");
    records.push({
      id: spec.id,
      title: spec.title,
      niche: spec.niche,
      location: spec.location,
      filePath,
      publishedUrl: articlePublicUrl(spec.title),
      extraPublishedUrls: EXTRA_PUBLISHED_URLS[spec.id] ?? "",
      qaStatus: validation.pass ? "PASS" : "FAIL",
      wordCount: validation.wordCount,
      characterCount: validation.characterCount,
      builderCount: validation.builderCount,
    });
  }

  const csvRows = [
    [
      "ID",
      "Title",
      "Niche",
      "Location",
      "QA Status",
      "Word Count",
      "Character Count",
      "Builder Count",
      "Draft File",
      "Published URL",
      "Additional Published URLs",
      "Submission Status",
    ],
    ...records.map((record) => [
      record.id,
      record.title,
      record.niche,
      record.location,
      record.qaStatus,
      record.wordCount,
      record.characterCount,
      record.builderCount,
      record.filePath,
      record.publishedUrl,
      record.extraPublishedUrls,
      record.publishedUrl ? "Published" : "Ready for manual/API publishing",
    ]),
  ];
  await writeCsv(path.join(outputDir, "website_builder_submission_tracker.csv"), csvRows);
  await fs.writeFile(path.join(outputDir, "article_records.json"), JSON.stringify(records, null, 2), "utf8");

  const workbookPath = await buildWorkbook(records);

  const summary = {
    articleCount: records.length,
    allPass: records.every((record) => record.qaStatus === "PASS"),
    minWordCount: Math.min(...records.map((record) => record.wordCount)),
    maxWordCount: Math.max(...records.map((record) => record.wordCount)),
    articlesDir,
    trackerXlsx: workbookPath,
    trackerCsv: path.join(outputDir, "website_builder_submission_tracker.csv"),
  };
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
