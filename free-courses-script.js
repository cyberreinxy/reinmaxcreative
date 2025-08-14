document.addEventListener('DOMContentLoaded', function () {
    // --- MOCK COURSE DATA ---
    const courseCategories = [
        {
            name: "Adobe Illustrator",
            videos: [
                { title: "Illustrator for Beginners", duration: "3:15:45", thumbnailUrl: "https://i.ytimg.com/vi/Ib8UBwu3yGA/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=Ib8UBwu3yGA" },
                { title: "Logo Design Masterclass", duration: "1:45:22", thumbnailUrl: "https://i.ytimg.com/vi/4Qltv09_A3M/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=4Qltv09_A3M" },
                { title: "Vector Illustration Techniques", duration: "55:10", thumbnailUrl: "https://i.ytimg.com/vi/j85Qpp-t2aY/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=j85Qpp-t2aY" },
                { title: "Advanced Illustrator Tips", duration: "48:30", thumbnailUrl: "https://i.ytimg.com/vi/z3x2fj4k-e8/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=z3x2fj4k-e8" }
            ]
        },
        {
            name: "Adobe Photoshop",
            videos: [
                { title: "Photoshop for Beginners", duration: "2:30:10", thumbnailUrl: "https://i.ytimg.com/vi/ZByaYyCFa28/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=ZByaYyCFa28" },
                { title: "Photo Manipulation Essentials", duration: "1:12:50", thumbnailUrl: "https://i.ytimg.com/vi/53m_p88-RjM/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=53m_p88-RjM" },
                { title: "Digital Painting in Photoshop", duration: "4:20:00", thumbnailUrl: "https://i.ytimg.com/vi/IP3_gV0KM-M/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=IP3_gV0KM-M" },
                { title: "Advanced Retouching", duration: "1:55:45", thumbnailUrl: "https://i.ytimg.com/vi/1y-o_Gfy3v4/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=1y-o_Gfy3v4" }
            ]
        },
        {
            name: "Adobe Premiere Pro",
            videos: [
                { title: "Premiere Pro for Beginners", duration: "1:05:15", thumbnailUrl: "https://i.ytimg.com/vi/Konf_g-4z1c/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=Konf_g-4z1c" },
                { title: "Cinematic Color Grading", duration: "35:40", thumbnailUrl: "https://i.ytimg.com/vi/L5DD2-aKAbY/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=L5DD2-aKAbY" },
                { title: "Video Editing Masterclass", duration: "2:10:00", thumbnailUrl: "https://i.ytimg.com/vi/QyZ8S-3c4kU/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=QyZ8S-3c4kU" },
                { title: "Audio Editing in Premiere", duration: "25:55", thumbnailUrl: "https://i.ytimg.com/vi/b-e-OM3v-5A/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=b-e-OM3v-5A" }
            ]
        },
        {
            name: "Adobe After Effects",
            videos: [
                { title: "After Effects for Beginners", duration: "45:30", thumbnailUrl: "https://i.ytimg.com/vi/H2Z4KimtZ2E/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=H2Z4KimtZ2E" },
                { title: "Motion Graphics Fundamentals", duration: "1:20:10", thumbnailUrl: "https://i.ytimg.com/vi/6_4h5PC-1-I/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=6_4h5PC-1-I" },
                { title: "Character Animation", duration: "2:05:00", thumbnailUrl: "https://i.ytimg.com/vi/F-e-sh8hA7E/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=F-e-sh8hA7E" },
                { title: "Visual Effects Compositing", duration: "1:40:25", thumbnailUrl: "https://i.ytimg.com/vi/OztlyJH2tn4/maxresdefault.jpg", videoUrl: "https://www.youtube.com/watch?v=OztlyJH2tn4" }
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
                        </div>
                        <div class="p-4">
                            <h3 class="font-bold text-primary">${video.title}</h3>
                            <p class="text-sm text-gray-500">${video.duration}</p>
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
