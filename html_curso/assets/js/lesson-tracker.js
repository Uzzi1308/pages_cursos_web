// lesson-tracker.js - VERSIÓN SIN NOTIFICACIONES
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

        // Marcar como vista inmediatamente (SIN NOTIFICACIÓN)
        if (currentLesson.startsWith('leccion')) {
            // Pequeño delay para asegurar que la página cargó
            setTimeout(() => {
                progressManager.marcarLeccionCompletada(currentLesson);
            }, 1000);
        }

        // Observer para marcar como completada al llegar al final (SIN NOTIFICACIÓN)
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

        // Mostrar indicador visual de completado (opcional, solo visual)
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
// En el archivo de la lección, añade esto después del código del quiz:
document.getElementById('check-quiz-leccion2').addEventListener('click', function() {
    setTimeout(function() {
        // Crear una notificación simple de prueba
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            color: black;
        `;
        notification.innerHTML = `
            <h2>¡PRUEBA FUNCIONA!</h2>
            <p>El sistema de notificaciones está cargado</p>
            <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        `;
        
        overlay.appendChild(notification);
        document.body.appendChild(overlay);
    }, 500);
});