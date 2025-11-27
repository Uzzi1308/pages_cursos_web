// ===== progressManager.js MEJORADO =====
class ProgressManager {
    constructor() {
        this.progress = this.loadProgress();
        this.totalLessons = 16;
    }

    loadProgress() {
        const saved = localStorage.getItem('cursoHTMLProgress');
        return saved ? JSON.parse(saved) : {
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
        // Actualizar página principal (index.html)
        const progressText = document.getElementById('progressText');
        const globalProgressText = document.getElementById('globalProgressText');
        const globalProgressBar = document.getElementById('globalProgressBar');
        const lessonsCompleted = document.getElementById('lessonsCompleted');

        if (progressText) {
            progressText.textContent = this.progress.progresoGeneral + '%';
        }
        
        if (globalProgressText) {
            globalProgressText.textContent = this.progress.progresoGeneral + '%';
        }

        if (globalProgressBar) {
            globalProgressBar.style.width = this.progress.progresoGeneral + '%';
        }

        if (lessonsCompleted) {
            lessonsCompleted.textContent = this.progress.leccionesCompletadas.length;
        }

        // Actualizar barras de módulos
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
            
            // Buscar la barra del módulo específico
            const moduleCard = document.querySelector(`.module-${modulo}`);
            if (moduleCard) {
                const progressBar = moduleCard.querySelector('.progress-bar-fill');
                if (progressBar) {
                    progressBar.style.width = porcentaje + '%';
                    progressBar.setAttribute('data-progress', porcentaje + '%');
                }
            }
        }
    }

    getProgreso() {
        return this.progress;
    }

    // Método para resetear progreso (útil para testing)
    resetProgress() {
        localStorage.removeItem('cursoHTMLProgress');
        this.progress = {
            leccionesCompletadas: [],
            ultimaLeccion: null,
            fechaInicio: new Date().toISOString(),
            progresoGeneral: 0
        };
        this.actualizarUI();
    }
}

// Instancia global
const progressManager = new ProgressManager();

// Inicializar UI cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    progressManager.actualizarUI();
});


// ===== SCRIPT PARA INCLUIR EN CADA LECCIÓN =====
// Este código va en cada archivo de lección (leccion1.html, leccion2.html, etc.)

/*
<script src="../../assets/js/progressManager.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID de la lección actual desde la URL
    const currentLesson = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Marcar como completada cuando se llega al final
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressManager.marcarLeccionCompletada(currentLesson);
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    // Observar el último elemento de la lección
    const lastElement = document.querySelector('.lesson-navigation');
    if (lastElement) {
        observer.observe(lastElement);
    }
});
</script>
*/


// ===== SCRIPT PARA index.html =====
/*
<script src="assets/js/progressManager.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar estadísticas en la página principal
    progressManager.actualizarUI();
});
</script>
*/


// ===== SCRIPT PARA modulos.html =====
/*
<script src="assets/js/progressManager.js"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar barras de progreso en módulos
    progressManager.actualizarBarrasModulos();
});
</script>
*/