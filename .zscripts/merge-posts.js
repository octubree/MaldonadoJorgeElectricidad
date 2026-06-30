const fs = require('fs');

const dataFilePath = '/home/ocutbre/Documentos/webs/MaldonadoJorgeNext/src/components/site/data.ts';
const migratedFilePath = '/home/ocutbre/Documentos/webs/MaldonadoJorgeNext/.zscripts/migrated-posts.json';

const dataContent = fs.readFileSync(dataFilePath, 'utf8');
const migratedPosts = JSON.parse(fs.readFileSync(migratedFilePath, 'utf8'));

// Format posts as TypeScript array
const formattedPosts = JSON.stringify(migratedPosts, null, 2);

// Find the start and end of BLOG_POSTS in data.ts
const startText = 'export const BLOG_POSTS: BlogPost[] = [';
const endText = '];\n\n/** Admin whitelist';

const startIndex = dataContent.indexOf(startText);
const endIndex = dataContent.indexOf(endText);

if (startIndex === -1 || endIndex === -1) {
  console.error("Error: Could not find BLOG_POSTS array block in data.ts");
  process.exit(1);
}

const beforePart = dataContent.substring(0, startIndex);
const afterPart = dataContent.substring(endIndex + 2); // keep the ]; and the rest of the file

const newContent = beforePart + 'export const BLOG_POSTS: BlogPost[] = ' + formattedPosts + ';' + afterPart;

fs.writeFileSync(dataFilePath, newContent, 'utf8');
console.log("Successfully merged migrated posts into data.ts!");
