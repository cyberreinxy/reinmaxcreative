document.addEventListener('DOMContentLoaded', function () {
    // --- MOCK COURSE DATA ---
    const courseData = {
        title: "Adobe Illustrator for Beginners",
        lessons: [
            { id: 1, title: "Introduction to the Workspace", duration: "8:45", videoUrl: "https://www.youtube.com/embed/Ib8UBwu3yGA?start=0" },
            { id: 2, title: "Working with Artboards", duration: "12:30", videoUrl: "https://www.youtube.com/embed/Ib8UBwu3yGA?start=525" },
            { id: 3, title: "Mastering the Pen Tool", duration: "22:15", videoUrl: "https://www.youtube.com/embed/Ib8UBwu3yGA?start=1275" },
            { id: 4, title: "Shapes, Colors, and Gradients", duration: "18:50", videoUrl: "https://www.youtube.com/embed/Ib8UBwu3yGA?start=2610" },
            { id: 5, title: "Typography and Text Effects", duration: "15:05", videoUrl: "https://www.youtube.com/embed/Ib8UBwu3yGA?start=3740" },
            { id: 6, title: "Exporting Your Work", duration: "9:20", videoUrl: "https://www.youtube.com/embed/Ib8UBwu3yGA?start=4645" }
        ]
    };

    // --- DOM ELEMENTS ---
    const accountButton = document.getElementById('account-button');
    const accountDropdown = document.getElementById('account-dropdown');
    const playlistContainer = document.getElementById('playlist');
    const videoPlayer = document.getElementById('video-player');
    const videoTitle = document.getElementById('video-title');
    const videoDescription = document.getElementById('video-description');
    
    // Comments
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentsList = document.getElementById('comments-list');

    // --- STATE ---
    let watchedLessons = new Set();
    let comments = [];

    // --- ACCOUNT DROPDOWN ---
    if (accountButton) {
        accountButton.addEventListener('click', (e) => {
            e.stopPropagation();
            accountDropdown.classList.toggle('hidden');
        });
    }
    document.addEventListener('click', () => {
        if (accountDropdown) accountDropdown.classList.add('hidden');
    });

    // --- PLAYLIST LOGIC ---
    function renderPlaylist() {
        playlistContainer.innerHTML = '';
        courseData.lessons.forEach(lesson => {
            const isCompleted = watchedLessons.has(lesson.id);
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.dataset.lessonId = lesson.id;
            
            item.innerHTML = `
                <div class="lesson-number">${lesson.id}</div>
                <div class="lesson-info">
                    <p class="lesson-title">${lesson.title}</p>
                    <p class="lesson-duration">${lesson.duration}</p>
                </div>
                <div class="completion-status">
                    <input type="checkbox" id="lesson-check-${lesson.id}" class="custom-checkbox" data-lesson-id="${lesson.id}" ${isCompleted ? 'checked' : ''}>
                    <span class="checkbox-visual"></span>
                </div>
            `;
            
            item.querySelector('.lesson-info').addEventListener('click', () => selectLesson(lesson));
            item.querySelector('.custom-checkbox').addEventListener('change', () => toggleCompletion(lesson.id));
            playlistContainer.appendChild(item);
        });
    }

    function selectLesson(lesson) {
        videoPlayer.src = `${lesson.videoUrl}&autoplay=1`;
        videoTitle.textContent = lesson.title;
        videoDescription.textContent = `Now playing: Lesson ${lesson.id} - ${lesson.title}.`;
        updateActiveClass(lesson.id);
    }

    function toggleCompletion(lessonId) {
        const checkbox = document.getElementById(`lesson-check-${lessonId}`);
        if (checkbox.checked) {
            watchedLessons.add(lessonId);
        } else {
            watchedLessons.delete(lessonId);
        }
        console.log(`Lesson ${lessonId} completion toggled. Admin can see this state:`, Array.from(watchedLessons));
    }

    function updateActiveClass(activeId) {
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.lessonId) === activeId) {
                item.classList.add('active');
            }
        });
    }

    // --- COMMENTS LOGIC ---
    function renderComments() {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
                <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
                <div class="comment-content">
                    <p class="comment-author">${comment.author}</p>
                    <p class="comment-text">${comment.text}</p>
                </div>
            `;
            commentsList.appendChild(commentEl);
        });
        commentsList.scrollTop = commentsList.scrollHeight;
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const commentText = commentInput.value.trim();
            if (commentText) {
                comments.push({
                    author: 'Current User',
                    avatar: 'https://lh3.googleusercontent.com/a/ACg8ocLsf7Za3saFjzOAfqujrkjxuAVEZvlDpFj7QFzL0IFjnDD11j7FXQ=s96-c-rg-br100',
                    text: commentText
                });
                commentInput.value = '';
                renderComments();
            }
        });
    }

    // --- INITIALIZATION ---
    renderPlaylist();
    renderComments();
    if(courseData.lessons.length > 0) {
        updateActiveClass(courseData.lessons[0].id);
    }
});
