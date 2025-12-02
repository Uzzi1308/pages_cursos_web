// lesson-tracker.js - CON SISTEMA DE NOTIFICACIONES
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


// ===== SISTEMA DE NOTIFICACIONES PARA QUIZ =====
const quizNotification = {
    currentOverlay: null,
    
    showSuccess: function(score, total) {
        this.createOverlay('success', score, total);
    },
    
    showError: function(score, total) {
        this.createOverlay('error', score, total);
    },
    
    createOverlay: function(type, score, total) {
        // Si ya hay un overlay, lo eliminamos primero
        if (this.currentOverlay) {
            this.removeOverlay();
        }
        
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'quiz-notification-overlay';
        overlay.setAttribute('data-notification-type', type);
        
        const isSuccess = type === 'success';
        
        overlay.innerHTML = `
            <div class="quiz-notification notification-${type}" onclick="event.stopPropagation()">
                <div class="notification-characters">
                    <img src="../../assets/images/honguito.png" class="notification-character" alt="Honguito celebrando">
                    <div class="notification-heart">
                        <i class="fa-solid fa-heart"></i>
                    </div>
                    <img src="../../assets/images/uzzi.png" class="notification-character" alt="Uzzi celebrando">
                </div>
                
                <h2 class="notification-title">${isSuccess ? '¡Perfecto!' : '¡Buen intento!'}</h2>
                <p class="notification-message">
                    ${isSuccess 
                        ? 'Has respondido correctamente todas las preguntas. ¡Excelente trabajo!'
                        : `Has respondido correctamente ${score} de ${total} preguntas. Revisa las respuestas incorrectas y vuelve a intentarlo.`}
                </p>
                
                <div class="notification-score">${score}/${total}</div>
                
                ${!isSuccess ? `
                <div class="notification-tip">
                    <h4><i class="fas fa-lightbulb"></i> Consejo</h4>
                    <p>Repasa el contenido de la lección antes de volver a intentar el quiz.</p>
                </div>
                ` : ''}
                
                <div class="notification-buttons">
                    <button class="notification-btn notification-btn-${type}" onclick="quizNotification.removeOverlay()">
                        <i class="fas fa-${isSuccess ? 'check' : 'redo'}"></i>
                        ${isSuccess ? 'Continuar' : 'Entendido'}
                    </button>
                </div>
            </div>
        `;
        
        // Agregar evento para cerrar al hacer clic fuera
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.removeOverlay();
            }
        });
        
        // Agregar evento para cerrar con Escape
        document.addEventListener('keydown', this.handleEscapeKey);
        
        // Bloquear scroll
        this.blockScroll();
        
        // Guardar referencia
        this.currentOverlay = overlay;
        
        // Agregar al DOM
        document.body.appendChild(overlay);
    },
    
    removeOverlay: function() {
        if (this.currentOverlay) {
            // Agregar animación de salida
            this.currentOverlay.classList.add('removing');
            
            // Esperar a que termine la animación
            setTimeout(() => {
                if (this.currentOverlay && this.currentOverlay.parentNode) {
                    this.currentOverlay.parentNode.removeChild(this.currentOverlay);
                }
                this.currentOverlay = null;
                
                // Remover listener de Escape
                document.removeEventListener('keydown', this.handleEscapeKey);
                
                // Restaurar scroll
                this.restoreScroll();
            }, 600);
        }
    },
    
    handleEscapeKey: function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            quizNotification.removeOverlay();
        }
    },
    
    blockScroll: function() {
        // Guardar posición actual del scroll
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Aplicar estilos para bloquear scroll
        document.body.style.cssText = `
            position: fixed;
            top: -${this.scrollPosition}px;
            left: 0;
            right: 0;
            overflow: hidden;
            height: 100vh;
        `;
        
        document.documentElement.style.cssText = `
            overflow: hidden;
            height: 100vh;
        `;
    },
    
    restoreScroll: function() {
        // Remover estilos
        document.body.style.cssText = '';
        document.documentElement.style.cssText = '';
        
        // Restaurar posición del scroll
        if (this.scrollPosition !== undefined) {
            window.scrollTo(0, this.scrollPosition);
            this.scrollPosition = undefined;
        }
    }
};