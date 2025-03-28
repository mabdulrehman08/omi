tailwind.config = {
    theme: {
      extend: {
        colors: {
          leather: {
            DEFAULT: '#6b4423',
            dark: '#4a2e17'
          },
          gold: '#d4af37',
          page: '#f5f1e6',
          'book-shadow': 'rgba(0, 0, 0, 0.5)'
        },
        boxShadow: {
          'book': '0 15px 25px -12px rgba(0, 0, 0, 0.4)',
          'page': '-5px 5px 10px rgba(0, 0, 0, 0.1)',
        },
        animation: {
          'page-turn': 'pageTurn 1.5s ease-in-out forwards',
        },
        keyframes: {
          pageTurn: {
            '0%': { transform: 'rotateY(0deg)' },
            '100%': { transform: 'rotateY(-180deg)' }
          }
        }
      }
    }
  };