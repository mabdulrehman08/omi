document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    let currentPage = 0;
    const totalPages = pages.length;
    
    // Page turn sound
    const turnSound = new Audio('page-turn.mp3');
    turnSound.volume = 0.5;
    
    // Initialize pages
    function initPages() {
        pages.forEach((page, index) => {
            if (index > 0) {
                page.style.transform = 'rotateY(-180deg)';
            }
            page.style.zIndex = totalPages - index + 5;
        });
    }
    
    // Next page
    function nextPage() {
        if (currentPage < totalPages) {
            turnSound.currentTime = 0;
            turnSound.play().catch(e => console.log("Audio play failed:", e));
            
            pages[currentPage].classList.add('flipped');
            currentPage++;
            updateButtons();
        }
    }
    
    // Previous page
    function prevPage() {
        if (currentPage > 0) {
            turnSound.currentTime = 0;
            turnSound.play().catch(e => console.log("Audio play failed:", e));
            
            currentPage--;
            pages[currentPage].classList.remove('flipped');
            updateButtons();
        }
    }
    
    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages;
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
    });
    
    // Initialize
    initPages();
    updateButtons();
});