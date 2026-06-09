import fs from "node:fs/promises";
import path from "node:path";

const apiKey = process.env.DEVTO_API_KEY;
if (!apiKey) {
  throw new Error("DEVTO_API_KEY is required in the environment.");
}

const fileArg = process.argv[2];
if (!fileArg) {
  throw new Error("Usage: node scripts/publish_devto.mjs <article.md> [--public]");
}

const publishPublic = process.argv.includes("--public");
const articlePath = path.resolve(fileArg);
const markdown = await fs.readFile(articlePath, "utf8");
const title = markdown.match(/^#\s+(.+)$/m)?.[1];

if (!title) {
  throw new Error(`Could not find H1 title in ${articlePath}`);
}

const description =
  markdown
    .split(/\r?\n/)
    .find((line) => line.trim() && !line.startsWith("#"))
    ?.trim()
    .slice(0, 160) ?? title;

const slug = path
  .basename(articlePath, ".md")
  .replace(/^\d+-/, "");
const canonicalUrl = `https://contactaryanshukla14-lgtm.github.io/website-builder-articles/articles/${slug}.html`;

const payload = {
  article: {
    title,
    published: publishPublic,
    body_markdown: markdown,
    tags: ["webdev", "freelance", "beginners", "productivity"],
    description,
    canonical_url: canonicalUrl,
  },
};

const response = await fetch("https://dev.to/api/articles", {
  method: "POST",
  headers: {
    "api-key": apiKey,
    "content-type": "application/json",
    accept: "application/vnd.forem.api-v1+json",
  },
  body: JSON.stringify(payload),
});

const text = await response.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = { raw: text };
}

if (!response.ok) {
  throw new Error(
    `DEV publish failed with status ${response.status}: ${JSON.stringify(body).slice(0, 1000)}`,
  );
}

console.log(
  JSON.stringify(
    {
      id: body.id,
      title: body.title,
      url: body.url,
      published: body.published,
      canonical_url: body.canonical_url,
    },
    null,
    2,
  ),
);
