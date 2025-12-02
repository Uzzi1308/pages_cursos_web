class ProgressManager {
    constructor() {
        this.progress = this.loadProgress();
        this.totalLessons = 16;
        this.init();
    }

    init() {
        if (!this.progress.leccionesCompletadas) {
            this.progress.leccionesCompletadas = [];
        }
        if (!this.progress.fechaInicio) {
            this.progress.fechaInicio = new Date().toISOString();
        }
        this.actualizarProgresoGeneral();
        this.saveProgress();
    }

    loadProgress() {
        try {
            const saved = localStorage.getItem('cursoHTMLProgress');
            return saved ? JSON.parse(saved) : this.getDefaultProgress();
        } catch (error) {
            console.error('Error cargando progreso:', error);
            return this.getDefaultProgress();
        }
    }

    getDefaultProgress() {
        return {
            leccionesCompletadas: [],
            ultimaLeccion: null,
            fechaInicio: new Date().toISOString(),
            progresoGeneral: 0
        };
    }

    saveProgress() {
        try {
            localStorage.setItem('cursoHTMLProgress', JSON.stringify(this.progress));
            return true;
        } catch (error) {
            console.error('Error guardando progreso:', error);
            return false;
        }
    }

    marcarLeccionCompletada(leccionId) {
        leccionId = leccionId.replace('.html', '');
        
        if (!this.progress.leccionesCompletadas.includes(leccionId)) {
            this.progress.leccionesCompletadas.push(leccionId);
            this.progress.ultimaLeccion = leccionId;
            this.actualizarProgresoGeneral();
            this.saveProgress();
            this.actualizarUI();
            
            // Feedback visual
            this.mostrarNotificacion(`¡Lección completada! 🎉`);
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
        this.actualizarElemento('progressText', this.progress.progresoGeneral + '%');
        this.actualizarElemento('globalProgressText', this.progress.progresoGeneral + '%');
        this.actualizarElemento('lessonsCompleted', this.progress.leccionesCompletadas.length);
        
        // Actualizar barra de progreso
        const globalProgressBar = document.getElementById('globalProgressBar');
        if (globalProgressBar) {
            globalProgressBar.style.width = this.progress.progresoGeneral + '%';
        }

        // Actualizar barras de módulos
        this.actualizarBarrasModulos();
    }

    actualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
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
            
            // Buscar la barra del módulo específico
            const moduleCard = document.querySelector(`.module-${modulo}`);
            if (moduleCard) {
                const progressBar = moduleCard.querySelector('.progress-bar-fill');
                if (progressBar) {
                    progressBar.style.width = porcentaje + '%';
                }
            }
        }
    }

    mostrarNotificacion(mensaje) {
        const notif = document.createElement('div');
        notif.className = 'progress-notification';
        notif.textContent = mensaje;
        notif.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    getProgreso() {
        return this.progress;
    }

    estaCompletada(leccionId) {
        leccionId = leccionId.replace('.html', '');
        return this.progress.leccionesCompletadas.includes(leccionId);
    }

    resetProgress() {
        if (confirm('¿Estás seguro de que quieres reiniciar tu progreso? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('cursoHTMLProgress');
            this.progress = this.getDefaultProgress();
            this.actualizarUI();
            this.mostrarNotificacion('Progreso reiniciado');
        }
    }
}

// Crear instancia global
const progressManager = new ProgressManager();

// Inicializar UI cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    progressManager.actualizarUI();
});

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);