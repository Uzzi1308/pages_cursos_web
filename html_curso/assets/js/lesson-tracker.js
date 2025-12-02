// Script unificado para tracking de lecciones
(function() {
    'use strict';
    
    function initLessonTracking() {
        if (typeof progressManager === 'undefined') {
            console.error('progressManager no está cargado');
            return;
        }

        // Obtener ID de la lección actual desde la URL
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        const currentLesson = fileName.replace('.html', '');
        
        console.log('Tracking lección:', currentLesson);

        // Marcar como vista inmediatamente
        if (currentLesson.startsWith('leccion')) {
            // Pequeño delay para asegurar que la página cargó
            setTimeout(() => {
                progressManager.marcarLeccionCompletada(currentLesson);
            }, 1000);
        }

        // Observer para marcar como completada al llegar al final
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressManager.marcarLeccionCompletada(currentLesson);
                    observer.disconnect();
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });

        // Observar el último elemento de la lección
        const lastElement = document.querySelector('.lesson-navigation');
        if (lastElement) {
            observer.observe(lastElement);
        }

        // Mostrar indicador de progreso en lecciones completadas
        mostrarIndicadorCompletada(currentLesson);
    }

    function mostrarIndicadorCompletada(leccionId) {
        if (progressManager.estaCompletada(leccionId)) {
            const header = document.querySelector('.lesson-header');
            if (header) {
                const badge = document.createElement('div');
                badge.className = 'lesson-completed-badge';
                badge.innerHTML = '<i class="fas fa-check-circle"></i>';
                badge.style.cssText = `
                    background: #27ae60;
                    color: white;
                    padding: 11px 20px;
                    border-radius: 50%;
                    display: inline-block;
                    margin-top: 15px;
                    font-weight: 600;
                    animation: fadeIn 0.5s ease;
                    font-size: 2rem;
                `;
                header.appendChild(badge);
            }
        }
    }

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLessonTracking);
    } else {
        initLessonTracking();
    }
})();


function initCodePreviews() {
    // Inicializar todos los preview toggles
    const previewToggles = document.querySelectorAll('.preview-toggle');
    
    previewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const previewContent = this.nextElementSibling;
            const isHidden = previewContent.style.display === 'none';
            
            if (isHidden) {
                previewContent.style.display = 'block';
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar vista previa';
                this.classList.add('active');
            } else {
                previewContent.style.display = 'none';
                this.innerHTML = '<i class="fas fa-eye"></i> Ver cómo se ve en el navegador';
                this.classList.remove('active');
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initCodePreviews();
});