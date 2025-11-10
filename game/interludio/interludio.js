const textEl = document.getElementById("typewriter");
const cursorEl = document.getElementById("cursor");
const text = textEl.innerText; // pega o texto exatamente como está
textEl.textContent = ""; // limpa antes de começar

let i = 0;
const speed = 40; // milissegundos por caractere

function type() {
    if (i < text.length) {
    textEl.textContent += text.charAt(i);
    i++;
    setTimeout(type, speed);
    } else {
    cursorEl.style.display = "none"; // esconde o cursor quando termina
    }
}

window.onload = type;