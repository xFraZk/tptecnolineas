class Caminante{

    constructor(c_){
        this.x = random(width);
        this.y = random(height);
        this.dx;
        this.dy;
        this.dir = radians(random(360));
        this.vel = 3;
        this.t = 10;
        this.c = c_;

        this.noff = random(10000);
    }
    
    //-----------------------------------------------------------------
    
    actualizar(pitch) {
this.vel = map(pitch, 0, 1, 2, 20);
    }

    actualizarLento(pitch) {
    this.vel = map(pitch, 0, 1, 0.5, 3); 
    }



    //-----------------------------------------------------------------
    
    dibujar(){
    stroke(this.c);
    strokeWeight(10);
    line(this.x - this.dx, this.y - this.dy, this.x, this.y);
}

   //-----------------------------------------------------------------
   
   mover(){
    // 1. Avanzamos en el tiempo del Noise. 
    // Un valor más chico (ej: 0.005) hace curvas más largas y abiertas.
    // Un valor más grande (ej: 0.02) hace rulos más cerrados.
    this.noff += 0.008; 

    // 2. Obtenemos un valor de Noise basado en el tiempo y en la posición espacial del caminante
    let valorNoise = noise(this.noff, this.x * 0.003, this.y * 0.003);

    // 3. Mapeamos ese valor (que va de 0 a 1) a un rango de rotación sutil.
    // En lugar de darle los 360 grados de golpe, hacemos que altere la dirección actual 
    // sumando o restando un ángulo pequeño (equivalente a curvas fluidas).
    let anguloGiro = map(valorNoise, 0, 1, radians(-4), radians(4));
    this.dir += anguloGiro;

    // 4. Calculamos los deltas y actualizamos posición (Tu física original)
    this.dx = this.vel * cos(this.dir);
    this.dy = this.vel * sin(this.dir);
    
    this.x += this.dx;
    this.y += this.dy;
}
    
    //-----------------------------------------------------------------
    
    // comprobarLimites(){
    //     if(this.x < 0 || this.x > width){
    //         this.dir = PI - this.dir;
    //     }
    //     if(this.y < 0 || this.y > height){
    //         this.dir= -this.dir;
    //     }
    // }

comprobarLimites() {
    // Definimos una zona de "frenado y giro" cerca de los bordes (ej: 50 píxeles)
    let margen = 50; 
    // Qué tan rápido queremos que doble (en radianes). 
    // radians(4) o radians(5) suele dar curvas muy elegantes.
    let fuerzaGiro = radians(5); 

    // Borde izquierdo: si está muy cerca, lo obligamos a girar hacia la derecha
    if (this.x < margen) {
        this.dir += fuerzaGiro;
    } 
    // Borde derecho: lo obligamos a girar en sentido contrario
    else if (this.x > width - margen) {
        this.dir += fuerzaGiro;
    }

    // Borde superior
    if (this.y < margen) {
        this.dir += fuerzaGiro;
    } 
    // Borde inferior
    else if (this.y > height - margen) {
        this.dir += fuerzaGiro;
    }
}

}
