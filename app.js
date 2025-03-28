// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the book
    const bookContainer = document.getElementById('book-container');
    const book = new Book(bookContainer);
    
    // Set up button event listeners
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    prevButton.addEventListener('click', () => {
      book.goToPrevPage();
    });
    
    nextButton.addEventListener('click', () => {
      book.goToNextPage();
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        book.goToNextPage();
      } else if (event.key === 'ArrowLeft') {
        book.goToPrevPage();
      }
    });
    
    // Handle form submission
    const loginForm = document.querySelector('#login-panel form');
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      
      if (username && password) {
        // Here you would typically handle authentication
        console.log('Login attempted with:', username);
        
        // For demo purposes, just go to next page
        book.goToNextPage();
      }
    });
    
    // Add preloading for textures and sounds
    function preloadAssets() {
      // Preload leather texture
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load('textures/leather.jpg');
      
      // Preload sound
      const sound = document.getElementById('page-turn-sound');
      sound.load();
    }
    
    preloadAssets();
  });
  
  // Create a more realistic page turning animation with mouse
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  
  document.getElementById('book-container').addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    document.body.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      currentX = e.clientX;
      const deltaX = currentX - startX;
      
      // This would be used in a more sophisticated implementation to
      // animate the pages based on mouse movement in real-time
      // For now we're using a simpler approach with the Book class
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      const deltaX = currentX - startX;
      
      // Determine if we should flip forward or backward based on drag distance
      if (Math.abs(deltaX) > 50) {
        const book = window.bookInstance;
        if (deltaX < 0) {
          // Dragged left - go forward
          book.goToNextPage();
        } else {
          // Dragged right - go backward
          book.goToPrevPage();
        }
      }
      
      isDragging = false;
      document.body.style.cursor = 'default';
    }
  });
  
  // Prevent context menu on right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });