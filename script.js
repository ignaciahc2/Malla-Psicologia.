const semestres = [/* INCLUYE TODOS LOS SEMESTRES AQUÍ (ver enlace abajo) */];

const malla = document.getElementById('malla');
const estadoRamos = {};

function crearMalla() {
  malla.innerHTML = "";

  semestres.forEach((sem) => {
    const semestreDiv = document.createElement('div');
    semestreDiv.classList.add('semestre');

    const titulo = document.createElement('h2');
    titulo.textContent = sem.titulo;
    semestreDiv.appendChild(titulo);

    sem.ramos.forEach((ramoData) => {
      const ramoDiv = document.createElement('div');
      ramoDiv.classList.add('ramo');
      ramoDiv.textContent = ramoData.nombre;

      const estado = {
        div: ramoDiv,
        aprobado: false,
        requiere: ramoData.requiere || [],
        abre: ramoData.abre || []
      };

      const requiereOtros = estado.requiere.length > 0;
      if (requiereOtros) ramoDiv.classList.add('bloqueado');

      estadoRamos[ramoData.nombre] = estado;

      ramoDiv.addEventListener('click', () => {
        if (estado.aprobado) return;
        if (requiereOtros && !estado.requiere.every(r => estadoRamos[r]?.aprobado)) return;

        estado.aprobado = true;
        ramoDiv.classList.remove('bloqueado');
        ramoDiv.classList.add('aprobado');

        estado.abre.forEach((destino) => {
          const target = estadoRamos[destino];
          if (target && target.requiere.every(r => estadoRamos[r]?.aprobado)) {
            target.div.classList.remove('bloqueado');
          }
        });
      });

      semestreDiv.appendChild(ramoDiv);
    });

    malla.appendChild(semestreDiv);
  });
}

function resetMalla() {
  Object.values(estadoRamos).forEach((estado) => {
    estado.aprobado = false;
    estado.div.classList.remove('aprobado');
    if (estado.requiere.length > 0) {
      estado.div.classList.add('bloqueado');
    } else {
      estado.div.classList.remove('bloqueado');
    }
  });
}

crearMalla();
