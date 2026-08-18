document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.card-listings');
    if (!container) return;

    fetchBlogData(container);
});

async function fetchBlogData(container) {
    try {
        const result = await fetch('../blog/posts.json');
        if (!result.ok) throw new Error('Failed to load posts data');

        const posts = await result.json();
        renderCards(posts, container);
    } catch (e) {
        console.error('Error loading blog posts:', e);
        container.innerHTML = '<p class="info-description">Failed to load blog posts</p>';
    }
}

function renderCards(posts, container) {
    container.innerHTML = '';

    posts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'card-div';

        const tags_html = post.tags.map((tag, index) => {
            const comma = (index < post.tags.length - 1)? ',' : '';
            return `<span class="tag-card">${tag}${comma}</span>`;
        }).join(' ');

        div.innerHTML = `
            <div class="card-content">
                <section class="card-content-info">
                    <a href=${post.link}><h2>${post.title}</h2></a>
                    <p class="info-description">${post.description}</p>
                </section>
                <aside class="info-stats">
                    <p><strong>Quality Rating:</strong> ${post.rating}</p>
                    <p><strong>Overall difficulty:</strong> ${post.difficulty}</p>
                    <div class="info-tags">
                        <strong>Tags:</strong>
                        ${tags_html}
                    </div>
                </aside>
            </div>
            <div class="card-date-wrapper">
                <time datetime="${post.dateIso}">${post.dateFormatted}</time>
            </div>
        `;

        container.appendChild(div);
    })
}
