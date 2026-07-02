//------ Configuracion ------

let frecuenciaSimulada = 780;
let usarTeclado = false;

let AMP_MIN = 0.08;
let AMP_MAX = 0.4;
let AMORTIGUACION = 0.5;

let FREC_MIN = 700;
let FREC_MAX = 882;
let IMPRIMIR = false;


const model_url = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let audioContext;
let mic;

let estado = "velocidad";


let marca;
let tiempoLimiteVelocidad = 3000;
let tiempoLimieteLento = 3000;
let tiempoLimieteReiniciar = 3000;
let tiempoLimieteAvanzar = 3000;
let tiempoLimieteColor = 3000;
let tiempoLimieteFin = 3000;



let caminante = [];
let escalaNoise;


// Paleta
let p;
let p2;
let p3;
let p4;

let img;
let img2;
let img3;
let img4;

let fondoNegro;
let fondoVioleta;
let fondoCrema;
let fondoGris;
let colorFondo;

let colores = [];

let elColor;
let colorInicial;
let colorFinal;





//------ AMPLITUD ------
let amp;
let haySonido = false;
let antesHabiaSonido = false;

//------ GESTOR ------
let gestorAmp;
let gestorPitch;


let activo = false;


function preload() {
  img = loadImage("img/linea_FVioleta.png");
  img2 = loadImage("img/linea_FNegro.png");
  img3 = loadImage("img/linea_FCrema.png");
  img4 = loadImage("img/linea_FGris.png");
}


function setup() {
  createCanvas(windowWidth, windowHeight);

  fondoCrema = color(242, 209, 148);
  fondoVioleta = color(166, 96, 141);
  fondoNegro = color(64, 58, 54);
  fondoGris = color(189, 191, 176);

  colores = [fondoCrema, fondoVioleta, fondoNegro, fondoGris];
  colorFondo = random(colores);
  
  background(colorFondo);
  fill(255);

  p = new Paleta(img);
  p2 = new Paleta(img2);
  p3 = new Paleta(img3);
  p4 = new Paleta(img4);

  if (colorFondo == fondoVioleta) {
    for (let i = 0; i < 10; i++) {
      caminante[i] = new Caminante(p.darUnColor());
    }
  }
  if (colorFondo == fondoNegro) {
    for (let i = 0; i < 10; i++) {
      caminante[i] = new Caminante(p2.darUnColor());
    }
  }
  if (colorFondo == fondoCrema) {
    for (let i = 0; i < 10; i++) {
      caminante[i] = new Caminante(p3.darUnColor());
    }
  }
  if (colorFondo == fondoGris) {
    for (let i = 0; i < 10; i++) {
      caminante[i] = new Caminante(p4.darUnColor());
    }
  }


  //------ GESTOR ------
  gestorAmp = new GestorSenial(AMP_MIN, AMP_MAX);
  gestorAmp.f = AMORTIGUACION;
  gestorPitch = new GestorSenial(FREC_MIN, FREC_MAX);


  //------ MICROFONO ------
   mic = new p5.AudioIn();

   userStartAudio();
   audioContext = getAudioContext();

   mic.start(startPitch);
}

function draw() {
  gestorAmp.actualizar(mic.getLevel());

  amp = gestorAmp.filtrada;
  haySonido = amp > AMP_MIN;

if (usarTeclado) {

  gestorPitch.actualizar(frecuenciaSimulada);

  if (keyIsDown(32)) { // ESPACIO
    haySonido = true;
    amp = 0.3;
  } else {
    haySonido = false;
    amp = 0;
  }

} else {

  gestorAmp.actualizar(mic.getLevel());

  amp = gestorAmp.filtrada;
  haySonido = amp > AMP_MIN;
}


  let empezoElSonido = haySonido && !antesHabiaSonido; //EVENTO
  let finDelSonido = !haySonido && antesHabiaSonido;


  if (estado == "velocidad") {


    if (empezoElSonido) {

    }

    if (haySonido) {

      for (let i = 0; i < 10; i++) {
        caminante[i].actualizar(gestorPitch.filtrada);
        caminante[i].dibujar();
        caminante[i].mover();
        caminante[i].comprobarLimites();
      }
    }

    if (finDelSonido) {
      marca = millis();
    }

    if (!haySonido) {
      let ahora = millis();
      if (ahora > marca + tiempoLimiteVelocidad) {

        estado = "lento";
        marca = millis();
      }
    }

  } else if (estado == "lento") {

    if (empezoElSonido) {

    }

    if (haySonido) {
      for (let i = 0; i < 10; i++) {
        caminante[i].actualizarLento(gestorPitch.filtrada);
        caminante[i].dibujar();
        caminante[i].mover();
        caminante[i].comprobarLimites();
      }
    }

    if (finDelSonido) {
      marca = millis();
    }

    if (!haySonido) {
      let ahora = millis();
      if (ahora > marca + tiempoLimieteLento) {

        estado = "color";
        marca = millis();
      }
    }

  } else if (estado == "avanzar") {

  } else if (estado == "color") {

    if (empezoElSonido) {
      if (colorFondo == fondoVioleta) {
        for (let i = 0; i < 10; i++) {
          caminante[i] = new Caminante(p.darUnColor());
        }
      }
      if (colorFondo == fondoNegro) {
        for (let i = 0; i < 10; i++) {
          caminante[i] = new Caminante(p2.darUnColor());
        }
      }
      if (colorFondo == fondoCrema) {
        for (let i = 0; i < 10; i++) {
          caminante[i] = new Caminante(p3.darUnColor());
        }
      }
      if (colorFondo == fondoGris) {
        for (let i = 0; i < 10; i++) {
          caminante[i] = new Caminante(p4.darUnColor());
        }
      }
    }

    if (haySonido) {
      for (let i = 0; i < 10; i++) {
        caminante[i].actualizar(gestorPitch.filtrada);
        caminante[i].dibujar();
        caminante[i].mover();
        caminante[i].comprobarLimites();
      }
    }


    if (finDelSonido) {
      marca = millis();
    }


    if (!haySonido) {
      let ahora = millis();
      if (ahora > marca + tiempoLimieteColor) {
        estado = "fin";
        marca = millis();
      }
    }

  } else if (estado == "fin") {


    if (empezoElSonido) {
      estado = "reiniciar";
    }

  } else if (estado == "reiniciar") {

    colorFondo = random(colores);
    background(colorFondo);

    caminante = [];

    if (colorFondo == fondoVioleta) {
      for (let i = 0; i < 10; i++) {
        caminante[i] = new Caminante(p.darUnColor());
      }
    }
    if (colorFondo == fondoNegro) {
      for (let i = 0; i < 10; i++) {
        caminante[i] = new Caminante(p2.darUnColor());
      }
    }
    if (colorFondo == fondoCrema) {
      for (let i = 0; i < 10; i++) {
        caminante[i] = new Caminante(p3.darUnColor());
      }
    }
    if (colorFondo == fondoGris) {
      for (let i = 0; i < 10; i++) {
        caminante[i] = new Caminante(p4.darUnColor());
      }
    }

    estado = "velocidad";
    marca = millis();

  }
  console.log(estado)



  if (IMPRIMIR) {
    printData();
  }

  antesHabiaSonido = haySonido;


dibujarPanel();

}

//------------------------ SONIDO ------------------------
function printData() {
  background(255);

  push();

  noStroke();
  textSize(16);
  fill(0);
  let texto;

  texto = 'amplitud: ' + amp;
  text(texto, 20, 20);


  let textoFrecMin = 'Frecuencia Mínima: ' + FREC_MIN + ' Hz';
  text(textoFrecMin, 20, 40);


  let textoFrecMax = 'Frecuencia Máxima: ' + FREC_MAX + ' Hz';
  text(textoFrecMax, 20, 60);



  fill(0);
  ellipse(width / 2, height - amp * 1000, 30, 30);

  pop();

  strokeWeight(1);
  gestorAmp.dibujar(100, 500);
  gestorPitch.dibujar(100, 300);
}

//------------------------ Pitch ------------------------

function startPitch() {
  pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  getPitch();
}

function getPitch() {
  pitch.getPitch(function (err, frequency) {

    if (frequency && haySonido) {
      gestorPitch.actualizar(frequency);
      console.log(frequency);
    } else {

      gestorPitch.actualizar(FREC_MIN);
    }


    setTimeout(getPitch);
  });
}

// function keyPressed() {


//   if (key == 'o' || key == 'O') {
//     background(255);
//     IMPRIMIR = !IMPRIMIR;
//   }

// }
function keyPressed() {

  if (keyCode === UP_ARROW) {
    frecuenciaSimulada += 20;
  }

  if (keyCode === DOWN_ARROW) {
    frecuenciaSimulada -= 20;
  }

  frecuenciaSimulada = constrain(
    frecuenciaSimulada,
    FREC_MIN,
    FREC_MAX
  );

  console.log("Frecuencia:", frecuenciaSimulada);

  if (key == 'o' || key == 'O') {
    background(255);
    IMPRIMIR = !IMPRIMIR;
  }
}

function dibujarPanel() {

  push();

  // Fondo del panel
  noStroke();
  fill(0, 170);
  rect(15, 15, 190, 95, 8);

  // Texto
  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);

 text("Frecuencia: " + nf(gestorPitch.filtrada, 0, 1) + " Hz", 25, 30);

  text("Frecuencia: " + nf(frecuenciaSimulada, 0, 1) + " Hz", 25, 30);


  text("Amplitud: " + nf(amp, 1, 3), 25, 55);


  text("Estado: " + estado, 25, 85);

  // Barras
let barraPitch = map(gestorPitch.filtrada, FREC_MIN, FREC_MAX, 0, 150);
//let barraPitch = map(frecuenciaSimulada, FREC_MIN, FREC_MAX, 0, 150);


  barraPitch = constrain(barraPitch, 0, 150);

  let barraAmp = map(amp, AMP_MIN, AMP_MAX, 0, 150);
  barraAmp = constrain(barraAmp, 0, 150);

  // Frecuencia
  fill(80, 180, 255);
  rect(25, 47, barraPitch, 6);

  // Amplitud
  fill(120, 255, 120);
  rect(25, 72, barraAmp, 6);

  pop();
}


