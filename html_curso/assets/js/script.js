    //*Progreso inicial
    let completedLessons = 0;
    const totalLessons = 16;

    //*Actualizar progreso dinámico
    function updateProgress() {
      const percent = Math.round((completedLessons / totalLessons) * 100);
      document.getElementById("progressText").innerText = percent + "%";
    }

    //?Llamamos a la función al cargar
    updateProgress();


//todo Aquí podrás agregar todos los efectos, animaciones y eventos
//! No eliminar esta sección: aquí va la lógica global
