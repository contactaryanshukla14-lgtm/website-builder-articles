import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), "..");
const articlesDir = path.join(rootDir, "articles");
const siteDir = path.join(rootDir, "docs");
const siteArticlesDir = path.join(siteDir, "articles");
const EXTRA_PUBLISHED_URLS = {
  "34": "https://dev.to/aryan_shukla/top-10-free-website-builders-for-software-freelancers-in-warsaw-3hb2",
};

function slugFromFilename(filename) {
  return filename.replace(/^\d+-/, "").replace(/\.md$/i, "");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(value) {
  const escaped = escapeHtml(value);
  return escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inTable = false;
  let inList = false;
  let paragraph = [];

  function flushParagraph() {
    if (paragraph.length) {
      html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  function closeTable() {
    if (inTable) {
      html.push("</tbody></table>");
      inTable = false;
    }
  }

  function closeList() {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      closeList();
      closeTable();
      continue;
    }

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushParagraph();
      closeList();
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());
      const isSeparator = cells.every((cell) => /^:?-{3,}:?$/.test(cell));
      if (isSeparator) {
        continue;
      }
      if (!inTable) {
        html.push("<table><thead>");
        html.push(`<tr>${cells.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join("")}</tr>`);
        html.push("</thead><tbody>");
        inTable = true;
      } else {
        html.push(`<tr>${cells.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join("")}</tr>`);
      }
      continue;
    }

    closeTable();

    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(trimmed.slice(2))}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  closeTable();
  return html.join("\n");
}

function pageShell({ title, description, body, canonicalPath = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="stylesheet" href="${canonicalPath}assets/site.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="${canonicalPath}index.html">Website Builder Articles</a>
    <nav>
      <a href="${canonicalPath}index.html">Articles</a>
      <a href="${canonicalPath}submission-tracker.html">Tracker</a>
    </nav>
  </header>
  <main>
${body}
  </main>
  <footer class="site-footer">
    <p>Generated article submission package for free website builder list articles.</p>
  </footer>
</body>
</html>
`;
}

async function main() {
  await fs.mkdir(siteArticlesDir, { recursive: true });
  await fs.mkdir(path.join(siteDir, "assets"), { recursive: true });

  const files = (await fs.readdir(articlesDir)).filter((file) => file.endsWith(".md")).sort();
  const articleRecords = [];

  for (const file of files) {
    const markdown = await fs.readFile(path.join(articlesDir, file), "utf8");
    const title = markdown.match(/^#\s+(.+)$/m)?.[1] ?? file.replace(/\.md$/i, "");
    const slug = slugFromFilename(file);
    const body = `<article class="article-page">
      <p class="eyebrow">Free website builder guide</p>
      ${markdownToHtml(markdown)}
    </article>`;
    await fs.writeFile(
      path.join(siteArticlesDir, `${slug}.html`),
      pageShell({
        title,
        description: `${title}. Includes Websites.co.in at #1 and a comparison of free website builders.`,
        body,
        canonicalPath: "../",
      }),
      "utf8",
    );
    articleRecords.push({
      id: file.slice(0, 2),
      title,
      file,
      slug,
      urlPath: `articles/${slug}.html`,
    });
  }

  const cards = articleRecords
    .map(
      (record, index) => `<a class="article-card" href="${record.urlPath}">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(record.title)}</strong>
      </a>`,
    )
    .join("\n");
  await fs.writeFile(
    path.join(siteDir, "index.html"),
    pageShell({
      title: "Top 10 Free Website Builder Articles",
      description: "A public index of 40 list-based articles about free website builders.",
      body: `<section class="hero">
      <p class="eyebrow">Public article index</p>
      <h1>Top 10 Free Website Builder Articles</h1>
      <p>Forty long-form, list-based articles prepared for submission tracking and public publishing.</p>
    </section>
    <section class="grid">
      ${cards}
    </section>`,
    }),
    "utf8",
  );

  const trackerRows = articleRecords
    .map(
      (record, index) => `<tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(record.title)}</td>
      <td><a href="${record.urlPath}">GitHub Pages article</a></td>
      <td>${
        EXTRA_PUBLISHED_URLS[record.id]
          ? `<a href="${EXTRA_PUBLISHED_URLS[record.id]}">DEV article</a>`
          : ""
      }</td>
      <td>Published on GitHub Pages</td>
    </tr>`,
    )
    .join("\n");
  await fs.writeFile(
    path.join(siteDir, "submission-tracker.html"),
    pageShell({
      title: "Submission Tracker",
      description: "Public submission tracker for the website builder article package.",
      body: `<section class="hero compact">
      <p class="eyebrow">Submission tracker</p>
      <h1>Published Article Links</h1>
      <p>This tracker records the public GitHub Pages version of each article.</p>
    </section>
    <section class="table-wrap">
      <table>
        <thead><tr><th>#</th><th>Title</th><th>Public URL</th><th>Additional URL</th><th>Status</th></tr></thead>
        <tbody>${trackerRows}</tbody>
      </table>
    </section>`,
    }),
    "utf8",
  );

  await fs.writeFile(
    path.join(siteDir, "assets", "site.css"),
    `:root {
  color-scheme: light;
  --ink: #17202a;
  --muted: #5b6673;
  --line: #d9e0e7;
  --panel: #f6f8fb;
  --brand: #0b5c6b;
  --brand-dark: #083c46;
  --accent: #b45309;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--ink);
  background: #ffffff;
  line-height: 1.65;
}

a { color: var(--brand); }

.site-header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 14px clamp(18px, 4vw, 56px);
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid var(--line);
}

.brand {
  font-weight: 700;
  text-decoration: none;
  color: var(--brand-dark);
}

nav {
  display: flex;
  gap: 18px;
  font-size: 14px;
}

nav a {
  text-decoration: none;
  color: var(--muted);
}

main {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 42px 0 64px;
}

.hero {
  padding: 42px 0 36px;
  border-bottom: 1px solid var(--line);
}

.hero.compact {
  padding-bottom: 20px;
}

.hero h1,
.article-page h1 {
  margin: 8px 0 14px;
  font-size: clamp(32px, 5vw, 54px);
  line-height: 1.05;
  letter-spacing: 0;
}

.hero p {
  max-width: 760px;
  color: var(--muted);
  font-size: 18px;
}

.eyebrow {
  margin: 0;
  color: var(--accent);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
  padding-top: 28px;
}

.article-card {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  text-decoration: none;
  color: var(--ink);
  background: #ffffff;
}

.article-card:hover {
  border-color: var(--brand);
  background: var(--panel);
}

.article-card span {
  color: var(--accent);
  font-weight: 700;
}

.article-page {
  width: min(860px, 100%);
  margin: 0 auto;
}

.article-page h2 {
  margin-top: 42px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  font-size: 26px;
  line-height: 1.2;
}

.article-page h3 {
  margin-top: 28px;
  font-size: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 22px 0;
  font-size: 15px;
}

th, td {
  border: 1px solid var(--line);
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}

th {
  background: var(--brand-dark);
  color: #ffffff;
}

tr:nth-child(even) td {
  background: var(--panel);
}

.table-wrap {
  overflow-x: auto;
}

.site-footer {
  border-top: 1px solid var(--line);
  padding: 18px clamp(18px, 4vw, 56px);
  color: var(--muted);
  font-size: 14px;
}

@media (max-width: 640px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero h1,
  .article-page h1 {
    font-size: 34px;
  }
}
`,
    "utf8",
  );

  await fs.writeFile(path.join(siteDir, ".nojekyll"), "", "utf8");
  console.log(
    JSON.stringify(
      {
        siteDir,
        articleCount: articleRecords.length,
        index: path.join(siteDir, "index.html"),
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
