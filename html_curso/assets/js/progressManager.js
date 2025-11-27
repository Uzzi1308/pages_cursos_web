// assets/js/progressManager.js
class ProgressManager {
    constructor() {
        this.progress = this.loadProgress();
        this.totalLessons = 16;
    }

    loadProgress() {
        return JSON.parse(localStorage.getItem('cursoHTMLProgress')) || {
            leccionesCompletadas: [],
            ultimaLeccion: null,
            fechaInicio: new Date().toISOString(),
            progresoGeneral: 0
        };
    }

    saveProgress() {
        localStorage.setItem('cursoHTMLProgress', JSON.stringify(this.progress));
    }

    marcarLeccionCompletada(leccionId) {
        if (!this.progress.leccionesCompletadas.includes(leccionId)) {
            this.progress.leccionesCompletadas.push(leccionId);
            this.progress.ultimaLeccion = leccionId;
            this.actualizarProgresoGeneral();
            this.saveProgress();
            this.actualizarUI();
            return true;
        }
        return false;
    }

    actualizarProgresoGeneral() {
        const completadas = this.progress.leccionesCompletadas.length;
        this.progress.progresoGeneral = Math.round((completadas / this.totalLessons) * 100);
    }

    actualizarUI() {
        // Actualizar página principal
        const progressElement = document.getElementById('progressText');
        if (progressElement) {
            progressElement.textContent = this.progress.progresoGeneral + '%';
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
                progressBar.setAttribute('data-progress', porcentaje + '%');
            }
        }
    }

    getProgreso() {
        return this.progress;
    }
}

// Instancia global
const progressManager = new ProgressManager();