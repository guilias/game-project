let canvas = document.getElementById('game_canvas');
let ctx = canvas.getContext('2d');

function detectaColisao(areaJogador, areaObjeto){
    if (areaJogador.x < areaObjeto.x + areaObjeto.largura &&
        areaJogador.x + areaJogador.largura > areaObjeto.x &&
        areaJogador.y < areaObjeto.y + areaObjeto.altura &&
        areaJogador.y + areaJogador.altura > areaObjeto.y)
        {
           //calcula a "quantidade de pixels" em colisão entre jogador e objeto.
        const colisaoEsquerda = (areaObjeto.x + areaObjeto.largura) - areaJogador.x;
        const colisaoDireita = (areaJogador.x + areaJogador.largura) - areaObjeto.x;
        const colisaoTopo = (areaObjeto.y + areaObjeto.altura) - areaJogador.y;
        const colisaoBase = (areaJogador.y + areaJogador.altura) - areaObjeto.y;

        //encontre o 'menor deslocamento para resolver a colisão'
        const minX = Math.min(colisaoEsquerda, colisaoDireita);
        const minY = Math.min(colisaoTopo, colisaoBase);

        //ajusta posição para bloquear o jogador no eixo onde a colisão é menor
        if (minX < minY) {
            //corrige no eixo X:
            if (colisaoEsquerda < colisaoDireita) {
                //colisão à esquerda do jogador (bloquear para a direita)
                jogador.x = areaObjeto.x + areaObjeto.largura;
            } else {
                //colisão à direita do jogador (bloquear para a esquerda)
                jogador.x = areaObjeto.x - areaJogador.largura;
            }
        } else {
            //corrige no eixo Y:
            if (colisaoTopo < colisaoBase) {
                // colisão por cima do jogador
                jogador.y = areaObjeto.y + areaObjeto.altura;
            } else {
                // Colisão por baixo do jogador
                jogador.y = areaObjeto.y - areaJogador.altura;
                jogadorNoChao = true;
                velocidadeVertical = 0;
                console.log("Está no chão.")
                ctx.font = "30px Arial";
                ctx.fillStyle = "black";
                ctx.fillText("Jogador está no chão.", canvas.width / 2, canvas.height / 2);
            }
        }
        console.log("Jogador está colidindo com objeto.")
        colisao = true;
        return true;
    } else {
        console.log("Não há colisão.")
        colisao = false;
        return false;
    }
};

function desenhaRetangulos(cor, x, y, largura, altura){
    return {
        x: x,
        y: y,
        largura: largura,
        altura: altura,
        cor: cor,
        desenha: function(ctx){
            ctx.beginPath();
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.largura, this.altura);
            ctx.closePath();
        }
    };
};

//sistema de dano por colisão
function danoPorObjeto(areaJogador, objetoDano){
    if (areaJogador.x < objetoDano.x + objetoDano.largura &&
        areaJogador.x + areaJogador.largura > objetoDano.x &&
        areaJogador.y < objetoDano.y + objetoDano.altura &&
        areaJogador.y + areaJogador.altura > objetoDano.y)
        {
        objetoEmColisao = objetoDano;
        ptVida -= 1;
    }
}

function coletarCura(areaJogador, objetoCura){
    if (curaColetada == false &&
        areaJogador.x < objetoCura.x + objetoCura.largura &&
        areaJogador.x + areaJogador.largura > objetoCura.x &&
        areaJogador.y < objetoCura.y + objetoCura.altura &&
        areaJogador.y + areaJogador.altura > objetoCura.y)
        {
        ptVida += 10;
        curaColetada = true;
    }
}

//declara jogador e variáveis relacionadas
let jogador = desenhaRetangulos("red", 700, 0, 80, 160);
const ptVidaMax = 100;
let ptVida = 100;
let colisao;
let objetoEmColisao;
let curaColetada = false; //variável para definir dano gerado por objetos

let jogadorNoChao = false;
let velocidadeVertical = 0;
const gravidade = 2;
const forcaPulo = -6;

let posicaoJogadorX;
let posicaoJogadorY;

//declara objetos
let teste = desenhaRetangulos("blue", 0, 700, canvas.width, 10);
let teste2 = desenhaRetangulos("blue", 100, 0, 10, canvas.height);
let teste3 = desenhaRetangulos("blue", canvas.width / 2, 500, 400, 10);
//declara objetos que geram dano
let dano = desenhaRetangulos("purple", canvas.width / 2, 490, 200, 10);
//declara coletáveis
let cura = desenhaRetangulos("green", canvas.width / 2, 300, 30, 30);

//estado do jogo
let jogoPausado = false;
let teclaDePausarPressionada = false; //variável criada para evitar bugs ao pausar o jogo

//adiciona o "sinal" e cria variável para rastrear teclas pressionadas
let teclasPressionadas = {};
document.addEventListener('keydown', function(evento){
    teclasPressionadas[evento.key] = true;
})
document.addEventListener('keyup', function(evento){
    teclasPressionadas[evento.key] = false;
})

function pausarJogo(){
    if(teclasPressionadas['p'] && !teclaDePausarPressionada){
        jogoPausado = !jogoPausado;
        teclaDePausarPressionada = !teclaDePausarPressionada; //inverte o próprio valor. ('!' opera como inversor)
    }

    //quando a tecla for solta...
    if(!teclasPressionadas['p']){
        teclaDePausarPressionada = false;
    }

    //símbolo visual para pausado e despausado
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = 'center';
    if(jogoPausado == true){
        ctx.fillText("||", canvas.width / 2, 100);
    }
    else{
        ctx.fillText(">", canvas.width / 2, 100);
    }
}

//o jogo em si, frame por frame
function animacao(){
    //reseta o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pausarJogo();
    //antes de todar ou não o jogo, verifica se ele está despausada:
    if(jogoPausado == false){
         //movimento do jogador
        if(teclasPressionadas['ArrowDown'] || teclasPressionadas['s'])
            {jogador.y += 10;}
        if(teclasPressionadas['ArrowLeft'] || teclasPressionadas['a'])
            {jogador.x -= 10;}
        if(teclasPressionadas['ArrowRight'] || teclasPressionadas['d'])
            {jogador.x += 10;}

        //pulo
        if((teclasPressionadas['ArrowUp'] || teclasPressionadas['w']) && jogadorNoChao){
            velocidadeVertical = forcaPulo; //basicamente, é o impulso do pulo.
            jogadorNoChao = false;;
        }

        //teleportar para lados opostos
        if (jogador.x > canvas.width){
            jogador.x = 0;
        }
        if (jogador.x < 0){
            jogador.x = canvas.width;
        }
        if (jogador.y > canvas.height){
            jogador.y = 0;
        }
        if (jogador.y < 0){
            jogador.y = canvas.height;
        }

        //"física"
        velocidadeVertical += 0.15 // a velocidade de queda aumenta a cada frame
        jogador.y += velocidadeVertical * gravidade // incrementa os valores

        //desenha o jogador
        jogador.desenha(ctx);

        //desenha objetos
        teste.desenha(ctx);
        teste2.desenha(ctx);
        teste3.desenha(ctx);
        dano.desenha(ctx);

        //chama a função de colisão
        detectaColisao(jogador, teste);
        detectaColisao(jogador, teste2);
        detectaColisao(jogador, teste3);

        //chama a função de dano
        danoPorObjeto(jogador, dano);
        
        //sistema de cura
        coletarCura(jogador, cura)
        if (curaColetada == false){
            cura.desenha(ctx)
        }
        

        //ajusta sistema de vida
        if (ptVida > ptVidaMax){
            ptVida = ptVidaMax;
        }
        if (ptVida < 0){
            ptVida = 0;
        }
        ctx.font = "30px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = 'left';
        ctx.fillText('Pontos de Vida: ' + ptVida, 50, 100);
    }

    //chama animação (?)
    requestAnimationFrame(animacao);
}

animacao();


