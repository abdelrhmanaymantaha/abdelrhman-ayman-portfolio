document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch badges using a CORS proxy
    async function fetchBadges() {
        try {
            // Using a public CORS proxy
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const targetUrl = encodeURIComponent('https://www.credly.com/users/abdelrhman-ayman.c436c9f0/badges.json');
            
            const response = await fetch(`${proxyUrl}${targetUrl}`);
            if (!response.ok) {
                throw new Error('Failed to fetch badges');
            }
            
            const data = await response.json();
            // The allOrigins proxy wraps the response in a "contents" property
            return JSON.parse(data.contents).data || [];
        } catch (error) {
            console.error('Error fetching badges:', error);
            return [];
        }
    }

    // Function to get badge image URL with fallback
    function getBadgeImageUrl(badge) {
        return badge.badge_template?.image_url || 'https://via.placeholder.com/150';
    }

    // Function to get badge name with fallback
    function getBadgeName(badge) {
        return badge.badge_template?.name || 'Unknown Certification';
    }

    // Function to get badge description with fallback
    function getBadgeDescription(badge) {
        return badge.badge_template?.description || 'No description available';
    }

    // Function to get badge issuer with fallback
    function getBadgeIssuer(badge) {
        return badge.issuer?.summary || 'Unknown Issuer';
    }

    // Function to get badge issue date with fallback
    function getBadgeIssueDate(badge) {
        try {
            return new Date(badge.issued_at).toLocaleDateString();
        } catch {
            return 'Unknown date';
        }
    }

    // Function to get badge skills with fallback
    function getBadgeSkills(badge) {
        if (!badge.badge_template?.skills) return 'No skills listed';
        return badge.badge_template.skills.map(skill => skill.name).join(', ') || 'No skills listed';
    }

    // Main function to display badges
    async function displayBadges() {
        const badgesContainer = document.getElementById('badges-container');
        
        try {
            const badges = await fetchBadges();
            
            if (!badges || badges.length === 0) {
                badgesContainer.innerHTML = '<p>No certifications found.</p>';
                return;
            }

            badgesContainer.innerHTML = ''; // Clear any loading messages

            badges.forEach(badge => {
                const badgeCard = createBadgeCard(badge);
                badgesContainer.appendChild(badgeCard);
            });
        } catch (error) {
            badgesContainer.innerHTML = `
                <div class="error-message">
                    <p>Unable to load certifications. Please try again later.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }

    function createBadgeCard(badge) {
        const card = document.createElement('div');
        card.className = 'badge-card';
        
        card.innerHTML = `
            <div class="badge-image">
                <img src="${getBadgeImageUrl(badge)}" alt="${getBadgeName(badge)}" class="badge-img">
            </div>
            <div class="badge-content">
                <h3 class="badge-title">${getBadgeName(badge)}</h3>
                <div class="badge-expanded">
                    <p class="badge-description">${getBadgeDescription(badge)}</p>
                    <div class="skills-list">
                        ${getBadgeSkills(badge).split(', ').map(skill => 
                            `<span class="skill-bubble">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }

    // Initialize badges display
    displayBadges();

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});