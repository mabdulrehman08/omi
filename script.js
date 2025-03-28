document.addEventListener('DOMContentLoaded', function() {
    const book = document.getElementById('book');
    const pages = document.querySelectorAll('.page');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const closeBtn = document.getElementById('close');
    const googleBtn = document.querySelector('.google-btn');
    let currentPage = 0;
    const totalPages = pages.length;
    let isBookClosed = false;
    let isAnimating = false;
    
    // Create anime-style page turning sound
    function createPageTurnSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // More anime-style swoosh sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.15);
            
            return true;
        } catch (e) {
            console.log("Audio creation failed:", e);
            return false;
        }
    }
    
    // Initialize pages
    function initPages() {
        pages.forEach((page, index) => {
            if (index > 0) {
                page.style.transform = 'rotateY(-180deg)';
            }
            page.style.zIndex = totalPages - index + 5;
        });
    }
    
    // Next page with animation
    function nextPage() {
        if (currentPage < totalPages && !isBookClosed && !isAnimating) {
            isAnimating = true;
            createPageTurnSound();
            
            pages[currentPage].classList.add('flipped');
            currentPage++;
            updateButtons();
            
            // Add some visual punch to the next page
            if (currentPage < totalPages) {
                pages[currentPage].style.transform = 'rotateY(-175deg) scale(0.95)';
                setTimeout(() => {
                    pages[currentPage].style.transform = 'rotateY(-180deg)';
                }, 50);
            }
            
            setTimeout(() => {
                isAnimating = false;
            }, 600); // Match page flip transition duration
        }
    }
    
    // Previous page with animation
    function prevPage() {
        if (currentPage > 0 && !isBookClosed && !isAnimating) {
            isAnimating = true;
            createPageTurnSound();
            
            // Add some visual punch to the current page
            pages[currentPage-1].style.transform = 'rotateY(-5deg) scale(0.95)';
            setTimeout(() => {
                pages[currentPage-1].classList.remove('flipped');
            }, 50);
            
            currentPage--;
            updateButtons();
            
            setTimeout(() => {
                isAnimating = false;
            }, 600); // Match page flip transition duration
        }
    }
    
    // Open/close book with manga-style animation
    function toggleBook() {
        if (isAnimating) return;
        
        isAnimating = true;
        
        if (isBookClosed) {
            // Open book with dramatic effect
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.3);
                
                gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.log("Audio creation failed:", e);
            }
            
            // Add a slight bounce
            book.style.transform = 'rotateX(15deg) scale(1.05)';
            setTimeout(() => {
                book.classList.remove('closed');
                setTimeout(() => {
                    book.style.transform = 'rotateX(10deg)';
                }, 300);
            }, 100);
            
            closeBtn.textContent = 'Close Book';
            
            setTimeout(() => {
                isBookClosed = false;
                isAnimating = false;
                updateButtons();
            }, 800); // Match the CSS transition duration
        } else {
            // Close book with dramatic effect
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
                
                gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.log("Audio creation failed:", e);
            }
            
            book.classList.add('closed');
            setTimeout(() => {
                book.style.transform = 'rotateX(10deg) translateX(200px) rotateY(-90deg) scale(0.95)';
                setTimeout(() => {
                    book.style.transform = 'rotateX(10deg) translateX(200px) rotateY(-90deg)';
                }, 200);
            }, 100);
            
            closeBtn.textContent = 'Open Book';
            isBookClosed = true;
            updateButtons();
            
            setTimeout(() => {
                isAnimating = false;
            }, 800); // Match the CSS transition duration
        }
    }
    
    // Google sign up button with visual feedback
    googleBtn.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(2px)';
        this.style.boxShadow = '0 2px 0 #ddd, 0 8px 16px rgba(0, 0, 0, 0.3)';
    });
    
    googleBtn.addEventListener('mouseup', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    // Update button states
    function updateButtons() {
        prevBtn.disabled = currentPage === 0 || isBookClosed;
        nextBtn.disabled = currentPage === totalPages || isBookClosed;
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevPage);