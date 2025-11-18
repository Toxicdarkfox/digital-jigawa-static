// script.js

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Icons
    const sunIcon = `<svg class="w-5 h-5 text-yellow-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
    const moonIcon = `<svg class="w-5 h-5 text-sky-400" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;

    // --- Dark Mode Logic ---
    function setMode(isDark) {
        if (isDark) {
            body.classList.add('dark');
            body.classList.remove('light');
            toggleButton.innerHTML = sunIcon;
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light');
            body.classList.remove('dark');
            toggleButton.innerHTML = moonIcon;
            localStorage.setItem('theme', 'light');
        }
    }

    // Load saved preference or default to dark
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setMode(true);
    } else {
        setMode(false);
    }

    // Toggle event listener
    toggleButton.addEventListener('click', () => {
        const isDark = body.classList.contains('dark');
        setMode(!isDark);
    });

    // --- Data Fetching Logic (New) ---

    async function fetchAndRenderArticles() {
        const newsGrid = document.querySelector('.news-grid');
        
        try {
            // Fetch data from the local JSON file
            const response = await fetch('./data.json');
            if (!response.ok) throw new Error('Failed to fetch articles.');
            
            const data = await response.json();
            // Assuming the JSON structure has an 'articles' key
            const articles = data.articles || [];

            articles.slice(0, 3).forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                card.innerHTML = `
                    <p class="article-date">${article.date}</p>
                    <h4>${article.title}</h4>
                    <p class="excerpt">${article.excerpt}</p>
                    <a href="#">Read Article →</a>
                `;
                newsGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Data fetching error:', error);
            document.querySelector('.news-grid').innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: var(--clr-sky-500);">Could not load latest news. Please check the data.json file.</p>';
        }
    }

    // Initialize fetching when the page content is loaded
    fetchAndRenderArticles();
});