//Estou atualizando o código de script.js para esse documento,
//utilizando classes e aprimorando algumas funções.
//AINDA NÃO ESTÁ PRONTO

let canvas = document.getElementById('game_canvas');
let ctx = canvas.getContext('2d');


let player = {
    x: 700,
    y: 0,
    largura: 48,
    altura: 96,
    pv: 100,
    pvMax: 100,
    colisao: false,
    visual: "",
    noChao: false,
    velocidade: 9,
    velVertical: 0,
    forcaPulo: -4,
}

function gerarVisualplayer(linkVisual){
    player.visual = new Image(player.largura, player.altura);
    player.visual.src = linkVisual;
    ctx.drawImage(player.visual)
}


class Objeto {
    constructor(cor, corBorda, x, y, largura, altura){
        this.cor = cor;
        this.corBorda = corBorda;
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    };
    desenha(){
        ctx.beginPath()
        ctx.fillStyle = this.cor;
        ctx.strokeStyle = this.corBorda;
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
        if(this.corBorda != null){
            ctx.strokeRect(this.x, this.y, this.largura, this.altura);
        }
        ctx.closePath()
    }
    colisao(){
        if (player.x < this.x + this.largura &&
            player.x + player.largura > this.x &&
            player.y < this.y + this.altura &&
            player.y + player.altura > this.y)
            {
            //calcula a "quantidade de pixels" em colisão entre player e objeto.
            const colisaoEsquerda = (this.x + this.largura) - player.x;
            const colisaoDireita = (player.x + player.largura) - this.x;
            const colisaoTopo = (this.y + this.altura) - player.y;
            const colisaoBase = (player.y + player.altura) - this.y;

            //encontre o 'menor deslocamento para resolver a colisão'
            const minX = Math.min(colisaoEsquerda, colisaoDireita);
            const minY = Math.min(colisaoTopo, colisaoBase);

            //ajusta posição para bloquear o player no eixo onde a colisão é menor
            if (minX < minY) {
                //corrige no eixo X:
                if (colisaoEsquerda < colisaoDireita) {
                    //colisão à esquerda do player (bloquear para a direita)
                    player.x = this.x + this.largura;
                } else {
                    //colisão à direita do player (bloquear para a esquerda)
                    player.x = this.x - player.largura;
                }
            } else {
                //corrige no eixo Y:
                if (colisaoTopo < colisaoBase) {
                    // colisão por cima do player
                    player.y = this.y + this.altura;
                } else {
                    // Colisão por baixo do player
                    player.y = this.y - player.altura;
                    player.noChao = true;
                    player.velVertical = 0;
                    console.log("Está no chão.")
                    ctx.font = "30px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText("player está no chão.", canvas.width / 2, canvas.height / 2);
                }
            }
            console.log("player está colidindo com objeto.")
            colisao = true;
            return true;
        } else {
            console.log("Não há colisão.")
            colisao = false;
            return false;
        }
    }
}

class Item {
    constructor(cor, x, y, largura, altura, visual, coletado){
        this.cor = cor;
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.visual = visual;
        this.coletado = coletado;
    }
    desenha(){
        ctx.beginPath()
        ctx.fillStyle = this.cor;
        ctx.strokeStyle = this.corBorda;
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
        ctx.closePath();
    }
    gerarVisual(linkVisual){
        this.visual = new Image(this.largura, this.altura)
        this.visual.src = linkVisual;
        ctx.drawImage(this.visual)
    }
    curar(){
        if (this.coletado == false &&
        player.x < this.x + this.largura &&
        player.x + player.largura > this.x &&
        player.y < this.y + this.altura &&
        player.y + player.altura > this.y)
        {
        player.pv += 10;
        this.coletado = true;
        }
    }
}

class Texto {
    constructor(fonte, tamanho, cor, x, y, mensagem){
        this.fonte = fonte;
        this.tamanho = tamanho;
        this.cor = cor;
        this.x = x;
        this.y = y;
        this.mensagem = mensagem;
    }
    escreve(){
        ctx.beginPath()
        ctx.font = `${this.tamanho}px ${this.fonte}`;
        ctx.fillStyle = this.cor;
        ctx.textAlign = 'center';
        ctx.fillText(this.mensagem, this.x, this.y);
    }
};

// DECLARAÇÃO DE OBJETOS DE CLASSES:

// OBJETO:
let playerPlaceholder = new Objeto("rgba(255, 0, 0, 1)", null, 700, 0, 48, 96)

let teto = new Objeto("gray", null, 0, 0, canvas.width, 10);
let chao = new Objeto("gray", null, 0, canvas.height - 10, canvas.width, 10);
let paredeEsquerda = new Objeto("gray", null, 0, 0, 10, canvas.height)
let paredeDireita = new Objeto("gray", null, canvas.width - 10, 0, 10, canvas.height)
let plataforma = new Objeto("gray", null, canvas.width / 2, 500, 400, 10);

//ITEM:


//TEXTO:


//Mapeamento de teclas: adiciona o "sinal" e cria variável para rastrear teclas pressionadas
let teclasPressionadas = {};
document.addEventListener('keydown', function(evento){
    teclasPressionadas[evento.key] = true;
})
document.addEventListener('keyup', function(evento){
    teclasPressionadas[evento.key] = false;
})


function loopAnimacao(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //Movimentação
    if(teclasPressionadas['ArrowDown'] || teclasPressionadas['s'])
        {player.y += player.velocidade;}
    if(teclasPressionadas['ArrowLeft'] || teclasPressionadas['a'])
        {player.x -= player.velocidade;}
    if(teclasPressionadas['ArrowRight'] || teclasPressionadas['d'])
        {player.x += player.velocidade;}

    //pulo
    if((teclasPressionadas['ArrowUp'] || teclasPressionadas['w']) && playerNoChao){
        player.velVertical = player.forcaPulo; //basicamente, é o impulso do pulo.
        player.noChaooChao = false;;
    }
    playerPlaceholder.x = player.x
    playerPlaceholder.y = player.y


    //Classe "Objeto":
    playerPlaceholder.desenha()
    teto.desenha()
    chao.desenha()
    paredeEsquerda.desenha()
    paredeDireita.desenha()


    requestAnimationFrame(loopAnimacao);
}

loopAnimacao();
