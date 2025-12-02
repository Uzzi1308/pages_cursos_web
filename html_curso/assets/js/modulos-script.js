// Script para módulos - usa el progressManager real
(function() {
    'use strict';
    
    function initModules() {
        // Esperar a que progressManager esté disponible
        if (typeof progressManager === 'undefined') {
            console.error('progressManager no está disponible');
            return;
        }

        // Obtener progreso real desde progressManager
        const progreso = progressManager.getProgreso();
        
        // Calcular progreso por módulo
        const modulos = {
            1: ['leccion1', 'leccion2', 'leccion3'],
            2: ['leccion4', 'leccion5', 'leccion6', 'leccion7'],
            3: ['leccion8', 'leccion9', 'leccion10'],
            4: ['leccion11', 'leccion12', 'leccion13'],
            5: ['leccion14', 'leccion15', 'leccion16']
        };

        // Actualizar barras de progreso con datos reales
        const progressBars = document.querySelectorAll('.progress-bar-fill');
        progressBars.forEach((bar, index) => {
            const moduloNum = index + 1;
            const leccionesModulo = modulos[moduloNum];
            const completadasModulo = leccionesModulo.filter(leccion => 
                progreso.leccionesCompletadas.includes(leccion)
            ).length;
            
            const porcentaje = Math.round((completadasModulo / leccionesModulo.length) * 100);
            
            setTimeout(() => {
                bar.style.width = porcentaje + '%';
                // Actualizar texto de progreso si existe
                const progressText = bar.closest('.module-card').querySelector('.progress-text');
                if (progressText) {
                    progressText.textContent = `${completadasModulo}/${leccionesModulo.length} lecciones`;
                }
            }, 500 + (index * 100));
        });

        // Animación al hacer hover en las cards
        const moduleCards = document.querySelectorAll('.module-card');
        moduleCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Actualizar progreso general en la página principal
        actualizarProgresoGeneral(progreso);
    }

    function actualizarProgresoGeneral(progreso) {
        const progressText = document.getElementById('progressText');
        const globalProgressText = document.getElementById('globalProgressText');
        const lessonsCompleted = document.getElementById('lessonsCompleted');
        const globalProgressBar = document.getElementById('globalProgressBar');

        if (progressText) progressText.textContent = progreso.progresoGeneral + '%';
        if (globalProgressText) globalProgressText.textContent = progreso.progresoGeneral + '%';
        if (lessonsCompleted) lessonsCompleted.textContent = progreso.leccionesCompletadas.length;
        if (globalProgressBar) {
            globalProgressBar.style.width = progreso.progresoGeneral + '%';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModules);
    } else {
        initModules();
    }
})();