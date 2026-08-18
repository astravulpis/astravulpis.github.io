let debounceTimer;
let posts_data = [];

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.card-listings');
    if (!container) return;

    posts_data = await fetchBlogJSON();
    fetchBlogData(container);
});

function searchCards() {
    // const cardContainer = document.querySelector('.card-listings');
    // const posts = fetchBlogData(cardContainer);
    const body = document.getElementsByTagName('body')[0];

    if (body.children[0].className === 'search-bg') {
        body.children[0].remove();
    }
    const div = document.createElement('div');
    div.className = 'search-bg';

    div.innerHTML = `
        <div class="search-container">
            <div class="search-input">
                <input type="text" placeholder="Search.." name="search">
            </div>
            <div class="search-result-container"></div>
        </div>
    `;

    div.onclick = (event) => {
        if (event.target === event.currentTarget) {
            div.remove();
        }
    };


    body.insertBefore(div, body.children[0]);
    const input = document.querySelector('.search-input');
    if (!input) return;

    input.addEventListener("input", (event) => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            const container = document.querySelector('.search-result-container');
            if (!container) return;
            container.innerHTML = '';

            const query = event.target.value.toLowerCase().trim();
            const posts = posts_data.filter(post =>
                post.title.toLowerCase().includes(query.toLowerCase())
            );

            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'result-card';

                div.innerHTML = `
                    <div class="search-result-info">
                        <a href=${post.link}><h2>${post.title}</h2></a>
                        <time datetime="${post.dateIso}">${post.dateFormatted}</time>
                    </div>
                    <p class="info-description">${post.description}</p>
                `;

                container.appendChild(div);
            });

        }, 200);
    });
}

async function fetchBlogJSON() {
    try {
        const result = await fetch('../blog/posts.json');
        if (!result.ok) throw new Error('Failed to load posts data');

        return await result.json();
    } catch (e) {
        console.error('[ERROR] failed to load JSON data:', e);
        return [];
    }
}

async function fetchBlogData(container) {
    try {
        renderCards(posts_data, container);
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
    });
}
