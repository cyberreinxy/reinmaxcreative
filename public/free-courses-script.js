document.addEventListener('DOMContentLoaded', function () {
    // --- COURSE DATA WITH WORKING LINKS ---
    const courseCategories = [
        {
            name: "Adobe Illustrator",
            videos: [
                { title: "Adobe Illustrator 2024: Free Course For Beginners - Part 1 by Will Paterson", duration: "N/A", thumbnailUrl: "https://i.ytimg.com/vi/S4NjBvo8Bz0/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=S4NjBvo8Bz0" },
                { title: "Adobe Illustrator for Beginners | FREE COURSE by Envato Tuts+", duration: "3:15:45", thumbnailUrl: "https://i.ytimg.com/vi/Ib8UBwu3yGA/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=Ib8UBwu3yGA" },
                { title: "Illustrator Full Course Tutorial (6+ Hours) by Learnit Training", duration: "6:23:10", thumbnailUrl: "https://i.ytimg.com/vi/3RTqLQ1MaQU/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=3RTqLQ1MaQU" },
                { title: "Adobe Illustrator Crash Course (for complete beginners) by Flux Academy", duration: "1:03:22", thumbnailUrl: "https://i.ytimg.com/vi/n_-ygXZUq3U/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=n_-ygXZUq3U" }
            ]
        },
        {
            name: "Adobe Photoshop",
            videos: [
                { title: "Photoshop for Complete Beginners | Lesson 1 by PiXimperfect", duration: "N/A", thumbnailUrl: "https://i.ytimg.com/vi/xTzvQkOll2U/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=xTzvQkOll2U" },
                { title: "Photoshop for Beginners | FREE COURSE by Envato Tuts+", duration: "2:30:10", thumbnailUrl: "https://i.ytimg.com/vi/IyR_uYsRdPs/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=IyR_uYsRdPs" },
                { title: "Photoshop Full Course Tutorial (6+ Hours) by Learnit Training", duration: "6:19:58", thumbnailUrl: "https://i.ytimg.com/vi/ZbvLJ5XtPpA/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=ZbvLJ5XtPpA" },
                { title: "Photoshop Tutorial for Beginners 2025 | Everything You NEED to KNOW! by Vince Opra", duration: "29:58", thumbnailUrl: "https://i.ytimg.com/vi/qwNbjGyhZ48/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=qwNbjGyhZ48" }
            ]
        },
        {
            name: "Adobe After Effects",
            videos: [
                { title: "I'll Teach You After Effects in 60 Minutes... by Ben Marriott", duration: "1:00:00", thumbnailUrl: "https://i.ytimg.com/vi/jFbRZZmMW7c/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=jFbRZZmMW7c" },
                { title: "Learn After Effects 2025 in 10 minutes - Beginner Tutorial by Gavin Herman", duration: "10:00", thumbnailUrl: "https://i.ytimg.com/vi/2nGwjjXJx8E/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=2nGwjjXJx8E" },
                { title: "Learn After Effects in 60 minutes | Full Masterclass by Max Novak", duration: "1:00:00", thumbnailUrl: "https://i.ytimg.com/vi/uvgUWd3c8ZM/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=uvgUWd3c8ZM" },
                { title: "After Effects for Beginners | FREE Mega Course by Envato Tuts+", duration: "45:30", thumbnailUrl: "https://i.ytimg.com/vi/PWvPbGWVRrU/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=PWvPbGWVRrU" }
            ]
        },
        {
            name: "Adobe Premiere Pro",
            videos: [
                { title: "Premiere Pro Tutorial for Beginners | FULL COURSE by Gavin Herman", duration: "N/A", thumbnailUrl: "https://i.ytimg.com/vi/xDq3ij-oHJA/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=xDq3ij-oHJA" },
                { title: "Premiere Pro Tutorial | FREE COURSE by Envato Tuts+", duration: "N/A", thumbnailUrl: "https://i.ytimg.com/vi/KfPIp-G1bpY/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=KfPIp-G1bpY" },
                { title: "Premiere Pro Tutorial for Beginners 2023 - Everything You NEED to KNOW! (UPDATED) by Vince Opra", duration: "N/A", thumbnailUrl: "https://i.ytimg.com/vi/keoszhf4DZ8/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=keoszhf4DZ8" },
                { title: "Learn Premiere Pro in 10 minutes - Beginner Tutorial by Gavin Herman", duration: "10:00", thumbnailUrl: "https://i.ytimg.com/vi/oUlpbue-Gw0/maxresdefault.jpg", videoUrl: "http://www.youtube.com/watch?v=oUlpbue-Gw0" }
            ]
        }
    ];

    // --- DOM ELEMENTS ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const courseCategoriesContainer = document.getElementById('course-categories');

    // --- MOBILE MENU ---
    function toggleMenu() {
        const isOpen = mobileMenu.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
        menuOverlay.classList.toggle('hidden', !isOpen);
    }
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', toggleMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

    // --- RENDER COURSES ---
    function renderCourses() {
        if (!courseCategoriesContainer) return;

        courseCategories.forEach(category => {
            const categorySection = document.createElement('section');
            
            let videoCardsHTML = '';
            category.videos.forEach(video => {
                videoCardsHTML += `
                    <a href="${video.videoUrl}" target="_blank" class="video-card block">
                        <div class="video-thumbnail">
                            <img src="${video.thumbnailUrl}" alt="${video.title}">
                            <div class="video-duration">${video.duration}</div>
                        </div>
                        <div class="p-4">
                            <h3 class="font-bold text-primary">${video.title}</h3>
                        </div>
                    </a>
                `;
            });

            categorySection.innerHTML = `
                <h2 class="text-2xl md:text-3xl font-bold text-primary mb-6">${category.name}</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    ${videoCardsHTML}
                </div>
            `;
            courseCategoriesContainer.appendChild(categorySection);
        });
    }

    // --- INITIALIZATION ---
    renderCourses();
});
