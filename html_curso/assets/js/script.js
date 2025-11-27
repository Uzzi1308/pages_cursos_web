// assets/js/progressManager.js - VERSIÓN COMPLETA Y FUNCIONAL
class ProgressManager {
    constructor() {
        this.storageKey = 'cursoHTMLProgress';
        this.backupKey = 'cursoHTML_backup';
        this.totalLessons = 16;
        this.progress = this.loadProgress();
        
        // Detectar y advertir entorno local
        if (this.isLocalEnvironment()) {
            this.showLocalWarning();
        }
        
        // Crear respaldo automático
        this.createBackup();
        
        // Inicializar UI si estamos en una página que lo necesita
        setTimeout(() => this.actualizarUI(), 100);
    }

    isLocalEnvironment() {
        return window.location.protocol === 'file:';
    }

    showLocalWarning() {
        console.warn('🔧 MODO LOCAL: El progreso se guarda solo en este navegador/carpeta');
        
        // Opcional: Mostrar alerta visual (puedes comentar esto si no la quieres)
        setTimeout(() => {
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #f39c12;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 10000;
                font-size: 12px;
                max-width: 300px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            warningDiv.innerHTML = `
                <strong>⚠️ Modo Local</strong><br>
                Tu progreso se guarda en este navegador
            `;
            document.body.appendChild(warningDiv);
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                if (document.body.contains(warningDiv)) {
                    document.body.removeChild(warningDiv);
                }
            }, 5000);
        }, 2000);
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
            // Si no hay progreso, intentar restaurar de respaldo
            if (this.restoreFromBackup()) {
                return this.progress;
            }
            return this.getDefaultProgress();
        } catch (e) {
            console.error('Error cargando progreso:', e);
            return this.getDefaultProgress();
        }
    }

    getDefaultProgress() {
        return {
            leccionesCompletadas: [],
            ultimaLeccion: null,
            fechaInicio: new Date().toISOString(),
            progresoGeneral: 0,
            tiempoEstudiado: 0 // en minutos
        };
    }

    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
            this.createBackup(); // Respaldar automáticamente
        } catch (e) {
            console.error('Error guardando progreso:', e);
        }
    }

    createBackup() {
        try {
            const backup = {
                data: this.progress,
                timestamp: new Date().toISOString(),
                version: '1.0'
            };
            sessionStorage.setItem(this.backupKey, JSON.stringify(backup));
        } catch (e) {
            // Ignorar errores de respaldo
        }
    }

    restoreFromBackup() {
        try {
            const backup = sessionStorage.getItem(this.backupKey);
            if (backup) {
                const parsed = JSON.parse(backup);
                this.progress = parsed.data;
                this.saveProgress(); // Guardar en localStorage principal
                console.log('✅ Progreso restaurado desde respaldo');
                return true;
            }
        } catch (e) {
            console.warn('No se pudo restaurar respaldo');
        }
        return false;
    }

    marcarLeccionCompletada(leccionId) {
        if (!this.progress.leccionesCompletadas.includes(leccionId)) {
            this.progress.leccionesCompletadas.push(leccionId);
            this.progress.ultimaLeccion = leccionId;
            this.actualizarProgresoGeneral();
            this.saveProgress();
            this.actualizarUI();
            
            // Efecto visual de celebración para lecciones completadas
            this.mostrarCelebracion(leccionId);
            return true;
        }
        return false;
    }

    actualizarProgresoGeneral() {
        const completadas = this.progress.leccionesCompletadas.length;
        this.progress.progresoGeneral = Math.round((completadas / this.totalLessons) * 100);
    }

    actualizarUI() {
        // Actualizar página principal (index.html)
        const progressElement = document.getElementById('progressText');
        if (progressElement) {
            progressElement.textContent = this.progress.progresoGeneral + '%';
        }

        // Actualizar contador de lecciones completadas
        const lessonsCompletedElement = document.getElementById('lessonsCompleted');
        if (lessonsCompletedElement) {
            lessonsCompletedElement.textContent = this.progress.leccionesCompletadas.length;
        }

        // Actualizar barra de progreso global
        const globalProgressBar = document.getElementById('globalProgressBar');
        if (globalProgressBar) {
            globalProgressBar.style.width = this.progress.progresoGeneral + '%';
        }

        const globalProgressText = document.getElementById('globalProgressText');
        if (globalProgressText) {
            globalProgressText.textContent = this.progress.progresoGeneral + '%';
        }

        // Actualizar barras de progreso en módulos
        this.actualizarBarrasModulos();
    }

    actualizarBarrasModulos() {
        const modulos = {
            1: ['leccion1', 'leccion2', 'leccion3'],
            2: ['leccion4', 'leccion5', 'leccion6', 'leccion7'],
            3: ['leccion8', 'leccion9', 'leccion10'],
            4: ['leccion11', 'leccion12', 'leccion13'],
            5: ['leccion14', 'leccion15', 'leccion16']
        };

        for (const [modulo, lecciones] of Object.entries(modulos)) {
            const completadasModulo = lecciones.filter(leccion => 
                this.progress.leccionesCompletadas.includes(leccion)
            ).length;
            
            const porcentaje = Math.round((completadasModulo / lecciones.length) * 100);
            const progressBar = document.querySelector(`.module-${modulo} .progress-bar-fill`);
            
            if (progressBar) {
                progressBar.style.width = porcentaje + '%';
                
                // Actualizar etiqueta de porcentaje si existe
                const progressLabel = progressBar.parentElement.querySelector('.progress-percentage');
                if (progressLabel) {
                    progressLabel.textContent = porcentaje + '%';
                } else {
                    // Crear etiqueta si no existe
                    const label = document.createElement('div');
                    label.className = 'progress-percentage';
                    label.textContent = porcentaje + '%';
                    progressBar.parentElement.appendChild(label);
                }
            }

            // Actualizar estado de la tarjeta del módulo
            const moduleCard = document.querySelector(`.module-${modulo}`);
            if (moduleCard) {
                moduleCard.classList.remove('completed', 'in-progress', 'not-started');
                if (porcentaje === 100) {
                    moduleCard.classList.add('completed');
                } else if (porcentaje > 0) {
                    moduleCard.classList.add('in-progress');
                } else {
                    moduleCard.classList.add('not-started');
                }
            }
        }
    }

    mostrarCelebracion(leccionId) {
        // Efecto simple de confeti en consola
        console.log(`🎉 ¡Lección ${leccionId} completada! 🎉`);
        
        // Efecto visual opcional (puedes personalizar esto)
        this.mostrarNotificacion(`✅ Lección ${leccionId} completada`);
        
        // Verificar si se completó todo el curso
        if (this.progress.progresoGeneral === 100) {
            console.log('🏆 ¡FELICIDADES! Has completado todo el curso 🏆');
            this.mostrarNotificacion('🏆 ¡FELICIDADES! Curso completado 🏆', 5000);
        }
    }

    mostrarNotificacion(mensaje, duracion = 3000) {
        // Crear notificación visual
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        // Animación de entrada
        setTimeout(() => {
            notificacion.style.transform = 'translateX(0)';
        }, 100);

        // Auto-remover después del tiempo especificado
        setTimeout(() => {
            notificacion.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }, duracion);
    }

    // Métodos para exportar/importar progreso
    exportProgress() {
        const data = {
            progress: this.progress,
            exportDate: new Date().toISOString(),
            version: '1.0',
            totalLessons: this.totalLessons
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progreso-html-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.mostrarNotificacion('📤 Progreso exportado correctamente');
    }

    importProgress(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (imported.progress && imported.version === '1.0') {
                    this.progress = imported.progress;
                    this.saveProgress();
                    this.actualizarUI();
                    this.mostrarNotificacion('📥 Progreso importado correctamente');
                    
                    // Recargar la página para aplicar todos los cambios
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    this.mostrarNotificacion('❌ Archivo de progreso inválido', 5000);
                }
            } catch (error) {
                this.mostrarNotificacion('❌ Error al importar el progreso', 5000);
                console.error('Error importando progreso:', error);
            }
        };
        reader.readAsText(file);
    }

    // Método para reiniciar progreso (útil para testing)
    reiniciarProgreso() {
        if (confirm('¿Estás seguro de que quieres reiniciar todo tu progreso? Esto no se puede deshacer.')) {
            this.progress = this.getDefaultProgress();
            this.saveProgress();
            this.actualizarUI();
            this.mostrarNotificacion('🔄 Progreso reiniciado');
        }
    }

    // Obtener información del progreso actual
    getProgreso() {
        return {
            ...this.progress,
            leccionesCompletadas: this.progress.leccionesCompletadas.length,
            leccionesTotales: this.totalLessons,
            porcentaje: this.progress.progresoGeneral
        };
    }

    // Verificar si una lección está completada
    esLeccionCompletada(leccionId) {
        return this.progress.leccionesCompletadas.includes(leccionId);
    }

    // Obtener la siguiente lección recomendada
    getSiguienteLeccion() {
        const todasLasLecciones = [
            'leccion1', 'leccion2', 'leccion3', 'leccion4', 'leccion5',
            'leccion6', 'leccion7', 'leccion8', 'leccion9', 'leccion10',
            'leccion11', 'leccion12', 'leccion13', 'leccion14', 'leccion15', 'leccion16'
        ];

        for (const leccion of todasLasLecciones) {
            if (!this.progress.leccionesCompletadas.includes(leccion)) {
                return leccion;
            }
        }
        return null; // Todas completadas
    }
}

// Crear instancia global
const progressManager = new ProgressManager();

// Función para inicializar el sistema de progreso en las lecciones
function inicializarProgresoLeccion() {
    // Obtener ID de la lección actual desde la URL
    const currentPath = window.location.pathname;
    const leccionMatch = currentPath.match(/(leccion\d+)\.html$/);
    
    if (leccionMatch) {
        const leccionId = leccionMatch[1];
        
        // Verificar si ya está completada y mostrar estado
        if (progressManager.esLeccionCompletada(leccionId)) {
            console.log(`✅ Lección ${leccionId} ya completada`);
            
            // Opcional: Mostrar indicador visual en la página
            const completadoBadge = document.createElement('div');
            completadoBadge.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: #27ae60;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                z-index: 9999;
                font-size: 12px;
                font-weight: bold;
            `;
            completadoBadge.textContent = '✅ Completada';
            document.body.appendChild(completadoBadge);
        }
        
        // Marcar como completada cuando el usuario llega al final
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !progressManager.esLeccionCompletada(leccionId)) {
                    progressManager.marcarLeccionCompletada(leccionId);
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        // Observar el elemento de navegación entre lecciones (final de la lección)
        const finalLeccion = document.querySelector('.lesson-navigation');
        if (finalLeccion) {
            observer.observe(finalLeccion);
        }
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarProgresoLeccion);
} else {
    inicializarProgresoLeccion();
}