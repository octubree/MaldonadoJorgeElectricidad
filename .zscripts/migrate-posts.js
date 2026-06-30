const fs = require('fs');
const path = require('path');

const srcDir = '/home/ocutbre/Documentos/webs/blog-electricidad-/content/post/2020';
const files = fs.readdirSync(srcDir);
const posts = [];

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dateStr;
  }
}

for (const file of files) {
  if (!file.endsWith('.md')) continue;
  
  const filePath = path.join(srcDir, file);
  const content = fs.readFileSync(filePath, 'utf8').trim();
  
  // Parse Frontmatter
  const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) continue;
  
  const yaml = match[1];
  const bodyText = content.substring(match[0].length).trim();
  
  const frontmatter = {};
  yaml.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.substring(0, idx).trim();
    let value = line.substring(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    frontmatter[key] = value;
  });
  
  const id = path.basename(file, '.md')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const paragraphs = bodyText
    .split(/\r?\n\r?\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
    
  posts.push({
    id,
    title: frontmatter.title || 'Sin título',
    date: formatDate(frontmatter.date || new Date().toISOString()),
    excerpt: frontmatter.summary || frontmatter.description || '',
    body: paragraphs
  });
}

// Sort by date desc (dd/mm/yyyy)
posts.sort((a, b) => {
  const parseDate = (dStr) => {
    const [d, m, y] = dStr.split('/').map(Number);
    return new Date(y, m - 1, d);
  };
  return parseDate(b.date) - parseDate(a.date);
});

// Set the first one as featured
if (posts.length > 0) {
  posts[0].featured = true;
}

const tsContent = `export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)};`;
fs.writeFileSync('/home/ocutbre/Documentos/webs/MaldonadoJorgeNext/.zscripts/migrated-posts.json', JSON.stringify(posts, null, 2));
console.log("Successfully migrated " + posts.length + " posts!");
