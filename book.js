class Book {
    constructor(container) {
      this.container = container;
      this.currentPage = 0;
      this.totalPages = 5;
      this.isAnimating = false;
      this.pageContents = [
        { type: 'cover', content: 'MY LIFE MANGA' },
        { type: 'text', content: 'Welcome to My Life Manga - where your daily experiences become an epic animated story.' },
        { type: 'login', content: '' }, // Login form
        { type: 'text', content: 'With Omi\'s always-on capture technology, your daily moments will transform into beautiful manga panels.' },
        { type: 'text', content: 'Every day, new pages of your life story will unfold in stunning anime style.' },
        { type: 'text', content: 'Begin your story today!' },
      ];
      
      // Three.js properties
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.book = null;
      this.pages = [];
      this.controls = null;
      
      this.init();
    }
    
    init() {
      // Create Three.js scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0x111827); // Match Tailwind bg-gray-900
      
      // Set up camera
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      this.camera.position.set(0, 0, 5);
      
      // Set up renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.container.appendChild(this.renderer.domElement);
      
      // Create book
      this.createBook();
      
      // Add lighting
      this.setupLighting();
      
      // Set up event listeners
      window.addEventListener('resize', this.onResize.bind(this));
      
      // Start animation loop
      this.animate();
      
      // Hide loading screen after init
      setTimeout(() => {
        document.getElementById('loading-screen').style.opacity = '0';
        setTimeout(() => {
          document.getElementById('loading-screen').style.display = 'none';
        }, 500);
      }, 1500);
    }
    
    createBook() {
      // Create main book group
      this.book = new THREE.Group();
      this.scene.add(this.book);
      
      // Cover material - leather texture
      const textureLoader = new THREE.TextureLoader();
      const leatherTexture = textureLoader.load('textures/leather.jpg', () => {
        // Fallback if texture doesn't load
        console.log('Texture loaded');
      }, undefined, () => {
        console.log('Error loading texture, using fallback');
      });
      
      const coverMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x6b4423,
        map: leatherTexture,
        roughness: 0.8,
        metalness: 0.2
      });
      
      // Book cover (front)
      const coverGeometry = new THREE.BoxGeometry(3, 4, 0.1);
      const cover = new THREE.Mesh(coverGeometry, coverMaterial);
      cover.position.z = -0.05;
      this.book.add(cover);
      
      // Create book spine
      const spineGeometry = new THREE.BoxGeometry(0.3, 4, 0.5);
      const spine = new THREE.Mesh(spineGeometry, coverMaterial);
      spine.position.set(-1.5, 0, 0.2);
      this.book.add(spine);
      
      // Create pages
      const pageGeometry = new THREE.PlaneGeometry(2.8, 3.8);
      const pageMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f1e6,
        side: THREE.DoubleSide,
        roughness: 0.5
      });
      
      // Create multiple pages
      const pageCount = 10;
      const pageThickness = 0.01;
      
      for (let i = 0; i < pageCount; i++) {
        const page = new THREE.Mesh(pageGeometry, pageMaterial);
        page.position.z = 0.1 + (i * pageThickness);
        
        // Add page to book and store reference
        this.book.add(page);
        this.pages.push(page);
        
        // Create page content textures - would be more sophisticated in real app
        this.createPageContent(page, i);
      }
      
      // Add book to scene
      this.scene.add(this.book);
      
      // Position the book
      this.book.position.set(0, 0, 0);
      this.book.rotation.set(0, 0, 0);
    }
    
    createPageContent(page, index) {
      // Create a canvas for the page content
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const context = canvas.getContext('2d');
      
      // Fill with page color
      context.fillStyle = '#f5f1e6';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Get content for this page
      const pageData = this.pageContents[Math.min(index, this.pageContents.length - 1)];
      
      if (pageData.type === 'cover') {
        // Title
        context.fillStyle = '#d4af37';
        context.font = 'bold 80px Cinzel';
        context.textAlign = 'center';
        context.fillText(pageData.content, canvas.width / 2, canvas.height / 2);
        
        // Decoration
        context.fillRect(canvas.width / 4, canvas.height / 2 + 100, canvas.width / 2, 2);
        context.fillText('Your daily life, animated', canvas.width / 2, canvas.height / 2 + 160);
        context.fillRect(canvas.width / 4, canvas.height / 2 + 200, canvas.width / 2, 2);
      } 
      else if (pageData.type === 'text') {
        // Regular text page
        context.fillStyle = '#382a1f';
        context.font = '40px Garamond';
        context.textAlign = 'left';
        
        // Wrap text
        const maxWidth = 800;
        const lineHeight = 60;
        const x = 112;
        let y = 300;
        
        const words = pageData.content.split(' ');
        let line = '';
        
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = context.measureText(testLine);
          const testWidth = metrics.width;
          
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          } else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
        
        // Page number
        context.font = '30px Garamond';
        context.fillText(`${index + 1}`, canvas.width - 100, canvas.height - 80);
      }
      
      // Apply canvas as texture to the page
      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      
      // Apply texture to page
      page.material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide,
        roughness: 0.5
      });
    }
    
    setupLighting() {
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);
      
      // Directional light (main light source)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      
      // Improve shadow quality
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      
      this.scene.add(directionalLight);
      
      // Additional light for backside
      const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
      backLight.position.set(-5, 5, -5);
      this.scene.add(backLight);
    }
    
    onResize() {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      
      // Update camera
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      
      // Update renderer
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    animate() {
      requestAnimationFrame(this.animate.bind(this));
      
      // Add subtle floating animation
      if (!this.isAnimating) {
        const time = Date.now() * 0.001;
        this.book.position.y = Math.sin(time) * 0.1;
        this.book.rotation.y = Math.sin(time * 0.5) * 0.05;
      }
      
      // Render scene
      this.renderer.render(this.scene, this.camera);
    }
    
    goToNextPage() {
      if (this.isAnimating || this.currentPage >= this.totalPages) return;
      
      this.isAnimating = true;
      this.currentPage++;
      
      // Play sound
      const sound = document.getElementById('page-turn-sound');
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed', e));
      }
      
      // Handle login page specifically
      if (this.currentPage === 2) {
        const loginPanel = document.getElementById('login-panel');
        loginPanel.classList.add('page-visible');
        loginPanel.style.opacity = '1';
        loginPanel.style.pointerEvents = 'auto';
      } else {
        const loginPanel = document.getElementById('login-panel');
        loginPanel.classList.remove('page-visible');
        loginPanel.style.opacity = '0';
        loginPanel.style.pointerEvents = 'none';
      }
      
      // Animate book/pages
      const duration = 1000; // ms
      const startTime = Date.now();
      const startRotation = this.book.rotation.y;
      const targetRotation = startRotation - (Math.PI / 6); // 30 degrees
      
      const animatePage = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use an easing function for smoother animation
        const easeOutQuad = progress * (2 - progress);
        this.book.rotation.y = startRotation + (targetRotation - startRotation) * easeOutQuad;
        
        if (progress < 1) {
          requestAnimationFrame(animatePage);
        } else {
          this.isAnimating = false;
        }
      };
      
      animatePage();
    }
    
    goToPrevPage() {
      if (this.isAnimating || this.currentPage <= 0) return;
      
      this.isAnimating = true;
      this.currentPage--;
      
      // Play sound
      const sound = document.getElementById('page-turn-sound');
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed', e));
      }
      
      // Handle login page specifically
      if (this.currentPage === 2) {
        const loginPanel = document.getElementById('login-panel');
        loginPanel.classList.add('page-visible');
        loginPanel.style.opacity = '1';
        loginPanel.style.pointerEvents = 'auto';
      } else {
        const loginPanel = document.getElementById('login-panel');
        loginPanel.classList.remove('page-visible');
        loginPanel.style.opacity = '0';
        loginPanel.style.pointerEvents = 'none';
      }
      
      // Animate book/pages
      const duration = 1000; // ms
      const startTime = Date.now();
      const startRotation = this.book.rotation.y;
      const targetRotation = startRotation + (Math.PI / 6); // 30 degrees
      
      const animatePage = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use an easing function for smoother animation
        const easeOutQuad = progress * (2 - progress);
        this.book.rotation.y = startRotation + (targetRotation - startRotation) * easeOutQuad;
        
        if (progress < 1) {
          requestAnimationFrame(animatePage);
        } else {
          this.isAnimating = false;
        }
      };
      
      animatePage();
    }
  }
