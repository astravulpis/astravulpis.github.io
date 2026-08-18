const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../blog');
const outputJSON = path.join(targetDir, 'posts.json');

let existingPosts = [];

if (fs.existsSync(outputJSON)) {
    try {
        existingPosts = JSON.parse(fs.readFileSync(outputJSON, 'utf8'));
    } catch (e) {
        existingPosts = [];
    }
}

const existingPostsMap = new Map(existingPosts.map(post => [post.link, post]));
const items = fs.readdirSync(targetDir, { withFileTypes: true });
const postDirs = items.filter(item => item.isDirectory());


const updatedPosts = [];

const debug = true;

postDirs.forEach(dir => {
    if (!dir.name.startsWith('.') || debug) {
        const link = path.join(dir.name, '/');
        const indexPath = path.join(targetDir, link, 'index.html');
        const html = fs.readFileSync(indexPath, 'utf8');

        const title    = retrieveMeta(html, 'title') || retrieveTitle(html);
        const desc     = retrieveMeta(html, 'description') || '';
        const rating   = retrieveMeta(html, 'rating') || '★☆☆☆☆';
        const diff     = retrieveMeta(html, 'difficulty') || 'N/A';
        const tagsHtml = retrieveMeta(html, 'tags') || '';
        const tags     = (tagsHtml)? tagsHtml.split(',').map(tag => tag.trim()) : [];
        const timeData = retrieveDateInfo(html) || {
            dateFormatted: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric' }),
            dateIso: new Date().toISOString().split('T')[0]
        };

        updatedPosts.push({
            link: link,
            title: title,
            description: desc,
            rating: rating,
            difficulty: diff,
            tags: tags,
            dateFormatted: timeData.dateFormatted,
            dateIso: timeData.dateIso
        });
    }
});

function retrieveMeta(html, name) {
    const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["'](.*?)["']`, 'i');
    const match = html.match(regex)
    return (match)? match[1] : null;
}

function retrieveTitle(html) {
    const regex = /<title>(.*?)<\/title>/i;
    const match = html.match(regex)
    return (match)? match[1] : null;
}

function retrieveDateInfo(html) {
    const regex = /<time\s+datetime=["'](.*?)["']>(.*?)<\/time>/i;
    const match = html.match(regex)
    if (match) {
        return {
            dateIso: match[1],
            dateFormatted: match[2],
        };
    }
    return null;
}

updatedPosts.sort((a, b) => new Date(b.dateIso) - new Date(a.dateIso));
// console.log(updatedPosts);

fs.writeFileSync(outputJSON, JSON.stringify(updatedPosts, null, 2));
console.log(`Generated blog/posts.json with ${updatedPosts.length} posts.`);
