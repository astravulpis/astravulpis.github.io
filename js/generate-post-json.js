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

const updatedPosts = postDirs.map(dir => {
    const link = dir.name;
    const existing = existingPostsMap.get(link);

    return existing || {
        link: link,
        title: link.replace(/-/g, ' ').toUpperCase(),
        description: "Placeholder",
        rating: "★☆☆☆☆",
        difficulty: "Easy",
        tags: ["uncategorized"],
        dateFormatted: new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric' }),
        dateIso: new Date().toISOString().split('T')[0]
    };
});

fs.writeFileSync(outputJSON, JSON.stringify(updatedPosts, null, 2));
console.log(`Generated blog/posts.json with ${updatedPosts.length} posts.`);
