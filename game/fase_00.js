//Estou atualizando o código de script.js para esse documento,
//utilizando classes e aprimorando algumas funções.
//AINDA NÃO ESTÁ PRONTO

let canvas = document.getElementById('canvas_00');
let ctx = canvas.getContext('2d');


let player = {
    x: 50,
    y: 400,
    largura: 48,
    altura: 96,
    pv: 100,
    pvMax: 100,
    visual: "",
    noChao: false,
    velocidade: 9,
    velVertical: 0,
    forcaPulo: -4,
    colisao: false,
    vivo: true,
    pontuacao: 0,
    carregarVisual(linkVisual){
        this.visual = new Image(this.largura, this.altura);
        this.visual.src = linkVisual;
        ctx.drawImage(this.visual, this.x, this.y, this.largura, this.altura)
    }
}
const gravidade = 2;

class Inimigo{
    constructor(cor, x, y, largura, altura, velocidade){
        this.cor = cor;
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.velocidade = velocidade;
    }
    //NENHUMA DAS FUNÇÕES ESTÁ FUNCIONANDO
    desenha(){
        ctx.beginPath()
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
        ctx.closePath()
    }
    seguirJogador(){
        let distanciaX =  this.x - player.x;
        let distanciaY = this.y - player.y;
        let distanciaTotal = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY)

        this.x -= (distanciaX/distanciaTotal) * this.velocidade;
        this.y -= (distanciaY/distanciaTotal) * this.velocidade;

        let ruidoMovFantasmaX = ((Math.random() - 0.5) * 2) * 5 
        let ruidoMovFantasmaY = ((Math.random() - 0.5) * 2) * 10
        this.x += ruidoMovFantasmaX;
        this.y += ruidoMovFantasmaY;
    }
    dano(){
    if (player.x < this.x + this.largura &&
        player.x + player.largura > this.x &&
        player.y < this.y + this.altura &&
        player.y + player.altura > this.y)
        {player.pv -= 1;}
    }
    carregarVisual(linkVisual){
        this.visual = new Image(this.largura, this.altura);
        this.visual.src = linkVisual;
        ctx.drawImage(this.visual, this.x, this.y, this.largura, this.altura)
    }
}



class Objeto {
    constructor(cor, corBorda, x, y, largura, altura, dano){
        this.cor = cor;
        this.corBorda = corBorda;
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.dano = dano;
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
                }
            }
            console.log("player está colidindo com objeto.")
            player.colisao = true;
                if(this.dano == true && player.pv > 0){
                    console.log("Dano ligado.")
                    player.pv -= 1;
                    console.log(player.pv)
                }
            return true;
        } else {
            console.log("Não há colisão.")
            player.colisao = false;
            return false;
        }
    }
    passarFase(){
        if (player.x < this.x + this.largura &&
            player.x + player.largura > this.x &&
            player.y < this.y + this.altura &&
            player.y + player.altura > this.y)
        {
            if (player.pontuacao == maxPontos){
                window.location.href = "fase_01.html" //avançar para próxima fase
            }
            else{
                msgPegarPonto.desenha()
            }
        }
    }
    carregarVisual(linkVisual){
        this.visual = new Image(this.largura, this.altura)
        this.visual.src = linkVisual;
        ctx.drawImage(this.visual, this.x, this.y, this.largura, this.altura)
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
        if(this.coletado == false){
            ctx.beginPath()
            ctx.fillStyle = this.cor;
            ctx.fillRect(this.x, this.y, this.largura, this.altura)
            ctx.closePath();}
    }
    carregarVisual(linkVisual){
        this.visual = new Image(this.largura, this.altura)
        this.visual.src = linkVisual;
        if(this.coletado == false){
            ctx.drawImage(this.visual, this.x, this.y, this.largura, this.altura)}
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
    dano(){
    if (player.x < this.x + this.largura &&
        player.x + player.largura > this.x &&
        player.y < this.y + this.altura &&
        player.y + player.altura > this.y)
            {player.pv -= 1;}
    }
    pontuar(){
    if (this.coletado == false &&
        player.x < this.x + this.largura &&
        player.x + player.largura > this.x &&
        player.y < this.y + this.altura &&
        player.y + player.altura > this.y)
            {
            player.pontuacao += 1;
            this.coletado = true
            }
    }
}

class Texto {
    constructor(tamanho, fonte, cor, x, y, alinhamento, mensagem){
        this.fonte = fonte;
        this.tamanho = tamanho;
        this.cor = cor;
        this.x = x;
        this.y = y;
        this.alinhamento = alinhamento;
        this.mensagem = mensagem;
    }
    desenha(){
        ctx.beginPath()
        ctx.font = `${this.tamanho} ${this.fonte}`;
        ctx.fillStyle = this.cor;
        ctx.textAlign = this.alinhamento;
        ctx.fillText(this.mensagem, this.x, this.y);
    }
};

// --- DECLARAÇÃO DE OBJETOS DE CLASSES: ---

//INIMIGO:
let fantasma = new Inimigo("black", 0, 0, 48, 96, 1.5)


// OBJETO:
let chao = new Objeto("green", null, 0, canvas.height - 10, canvas.width, 10, false)
let paredeInvisivel = new Objeto("rgb(0, 0, 0, 0)", null, 0, 0, 10, canvas.height, false)
let paredeCasa = new Objeto("gray", null, canvas.width - 10, canvas.height - 450, 10, 440, false)
let beirau = new Objeto("gray", null, canvas.width - 20, canvas.height - 140, 10, 10, false)
let porta = new Objeto("brown", null, canvas.width - 11, canvas.height - 130, 11, 120, false)
let avancarFase = new Objeto("rgb(0, 0, 0, 0)", null, canvas.width - 20, canvas.height - 130, 10, 120, false)

//ITEM:
//curas
let cura01 = new Item("green", 400, 400, 48, 48, null, false)
let cura02 = new Item("green", 50, 400, 48, 48, null, false)

let documento01 = new Item("gray", 500, 500, 48, 48, null, false)

//TEXTO:
let msgJogadorNoChao = new Texto("50px", "Minecraftia", "black", canvas.width / 2, canvas.height / 2, "center", "O jogador está no chão.")
let msgPegarPonto = new Texto("20px", "Minecraftia", "white", canvas.width / 2, canvas.height / 2, "center", "Colete todos os documentos para poder avançar de fase.")

let msgTutorial = new Texto("20px", "Minecraftia", "white", canvas.width / 2, canvas.height / 2, "center", "Use as teclas W, A, S e D para se mover. Ou as setas no teclado.")
let msgTutorial2 = new Texto("20px", "Minecraftia", "white", canvas.width / 2, 350, "center", "Seu objetivo é coletar todos os documentos em cada cenário!")


//INTERFACE
let fundo = new Image(1200, 600)
fundo.src = "img/ceu.png"

let maxPontos = 0;

let vermelho = new Objeto("black", null, 0, 0, canvas.width, canvas.height, false)
let msgGameOver = new Texto("50px", "Minecraftia", "white", canvas.width/2, canvas.height/2, "center", "Você morreu.")
let msgReiniciarJogo = new Texto("25px", "Minecraftia", "white", canvas.width/2, canvas.height - canvas.height/3, "center", "Pressione a tecla R para tentar novamente.")


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
    ctx.drawImage(fundo, 0, 0);

    //--- MOVIMENTAÇÃO: ---
    //antes de mais nada, chegar se o jogo está vivo:
    if (player.vivo == true){
    //baixo, esquerda e direita:
        if(teclasPressionadas['ArrowDown'] || teclasPressionadas['s'])
            {player.y += player.velocidade;}
        if(teclasPressionadas['ArrowLeft'] || teclasPressionadas['a'])
            {player.x -= player.velocidade;}
        if(teclasPressionadas['ArrowRight'] || teclasPressionadas['d'])
            {player.x += player.velocidade;}

        //pulo
        if((teclasPressionadas['ArrowUp'] || teclasPressionadas['w']) && player.noChao == true){
            player.velVertical = player.forcaPulo; //basicamente, é o impulso do pulo.
            player.noChao = false;
        }
    }

    //"física"
    player.velVertical += 0.15 // a velocidade de queda aumenta a cada frame
    player.y += player.velVertical * gravidade // incrementa os valores

    
    // -- DEMAIS FUNÇÕES... --

    //Jogador/Player:
    player.carregarVisual("img/detetivehp.png")

    //Classe "Objeto":
    chao.desenha()
    chao.colisao()

    paredeInvisivel.colisao()

    paredeCasa.desenha()
    paredeCasa.colisao()

    porta.desenha()
    porta.passarFase()

    beirau.desenha()

    msgTutorial.desenha()
    msgTutorial2.desenha()

    avancarFase.desenha()
    avancarFase.passarFase()

    // --- INTERFACE ---

    //Tela Game Over
    if (player.pv == 0){
        vermelho.desenha()
        msgGameOver.desenha()
    }


    //Pontos de VIda:
    let msgPv = new Texto("20px", "Minecraftia", "white", 30, 50, "left", "Pontos de vida: " + player.pv)

    msgPv.desenha()
    if (player.pv > player.pvMax){
            player.pv = player.pvMax;
        }
        if (player.pv < 1){
            player.pv = 0;
        if (teclasPressionadas['r']){ //Caso o jogador esteja morto, permite reiniciar o jogo.
            location.reload();
        }
        }

    //Pontuação
    let msgPontuacao = new Texto("20px", "Minecraftia", "white", 30, 100, "left", "Documentos coletados:  " + player.pontuacao + " / " + maxPontos)
    msgPontuacao.desenha()

    //Game Over (precisa estar por último)
    if (player.pv == 0){
        player.vivo = false;
        vermelho.desenha()
        msgGameOver.desenha()
        msgReiniciarJogo.desenha()
    }


    requestAnimationFrame(loopAnimacao);
}

loopAnimacao();
