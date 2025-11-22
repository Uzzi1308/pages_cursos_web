    // Simular progreso guardado (puedes conectar con localStorage más adelante)
    const progressData = [0, 0, 0, 0, 0]; // Progreso de cada módulo (0-100%)

    // Actualizar barras de progreso
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    progressBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.width = progressData[index] + '%';
      }, 500 + (index * 100));
    });

    // Animación al hacer hover en las cards
    const moduleCards = document.querySelectorAll('.module-card');
    moduleCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });