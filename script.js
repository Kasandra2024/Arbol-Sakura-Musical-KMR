const canvas = document.getElementById("canvasSakura");
const ctx = canvas.getContext("2d");
const audio = document.getElementById("musica");
const boton = document.querySelector(".control-btn");
const titulo = document.getElementById("titulo");
const instruccion = document.getElementById("instruccion");

let animacionID;
let experienciaIniciada = false;
let petalosConstantes = [];

function ajustarCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generarArbol(); 
}
window.addEventListener("resize", ajustarCanvas);

// ALGORITMO DEL ÁRBOL 
function dibujarRama(startX, startY, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = "#2c1a1d"; 
    ctx.lineWidth = branchWidth;
    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if (len < 10) {
        ctx.beginPath();
        let colorRosa = ["#ffb6c1", "#ffc0cb", "#ff69b4", "#ff8fa3", "#fff0f5"];
        ctx.fillStyle = colorRosa[Math.floor(Math.random() * colorRosa.length)];
        ctx.arc(0, -len, Math.random() * 4 + 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
    }

    dibujarRama(0, -len, len * 0.78, angle + 15, branchWidth * 0.7);
    dibujarRama(0, -len, len * 0.78, angle - 15, branchWidth * 0.7);

    ctx.restore();
}

function generarArbol() {
    const rootX = canvas.width / 2;
    const rootY = canvas.height;
    
    // Detección para móviles con mayor ajuste de proporción
    const esMovil = window.innerWidth < 768;
    
    // Reducimos el largo para que el árbol no invada demasiado el espacio de la luna
    const largoInicial = esMovil ? canvas.height * 0.11 : canvas.height * 0.21; 
    const grosorInicial = esMovil ? 8 : 13;

    dibujarRama(rootX, rootY, largoInicial, 0, grosorInicial);
}

// PÉTALOS EN MOVIMIENTO LENTO 
class PetaloSakura {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 7 + 4;
        this.speedY = Math.random() * 0.6 + 0.4; 
        this.speedX = Math.random() * 0.4 + 0.2; 
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 1 - 0.5;
        let tonos = ["#ffb6c1", "#ff69b4", "#f48c96"];
        this.color = tonos[Math.floor(Math.random() * tonos.length)];
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.3; 
        this.angle += this.spin;

        if (this.y > canvas.height) {
            this.y = -20;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function inicializarPetalos() {
    petalosConstantes = [];
    for (let i = 0; i < 40; i++) {
        petalosConstantes.push(new PetaloSakura());
    }
}

function bucleAnimacion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generarArbol();

    petalosConstantes.forEach(p => {
        p.update();
        p.draw();
    });

    animacionID = requestAnimationFrame(bucleAnimacion);
}

// INTERACTIVIDAD CLICK 
window.addEventListener("click", (e) => {
    if (!experienciaIniciada || e.target.classList.contains('control-btn')) return;

    for (let i = 0; i < 6; i++) {
        const p = document.createElement("div");
        p.classList.add("click-petal");
        
        const size = Math.random() * 8 + 6;
        p.style.width = `${size}px`;
        p.style.height = `${size * 1.4}px`;
        p.style.left = `${e.clientX}px`;
        p.style.top = `${e.clientY}px`;

        const rX = (Math.random() * 160 - 80) + 30; 
        const rY = (Math.random() * 120 + 40); 
        p.style.setProperty('--x', `${rX}px`);
        p.style.setProperty('--y', `${rY}px`);

        const duracion = Math.random() * 2 + 1; 
        p.style.animationDuration = `${duracion}s`;

        document.body.appendChild(p);
        setTimeout(() => p.remove(), duracion * 1000);
    }
});

// INTERFAZ DE INICIO 
function iniciarExperiencia() {
    if (audio.paused) {
        audio.play().catch(err => console.log("Permiso de audio requerido."));
        boton.innerHTML = "⏸ Pausar Magia";
        
        titulo.classList.add("mostrar");
        instruccion.style.opacity = "1";

        if (!experienciaIniciada) {
            inicializarPetalos();
            bucleAnimacion();
            experienciaIniciada = true;
        } else {
            bucleAnimacion();
        }
    } else {
        audio.pause();
        boton.innerHTML = "🌸 Florecer y Escuchar";
        cancelAnimationFrame(animacionID);
    }
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
generarArbol();