/* =========================================================
   ZUNGAKI - script.js
   Menu responsivo, voltar ao topo, dark mode, carrossel,
   validação de formulários, mapa e partilha social.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initMenuResponsivo();
    initBotaoTopo();
    initDarkMode();
    initCarrossel();
    initFormularioNewsletter();
    initFormularioContacto();
    initMapaDeReserva();
    initImagensAlternativas();
});

/* Evita imagens partidas caso um ficheiro ainda não tenha sido enviado para
   a hospedagem. A imagem original continua a ter prioridade. */
function initImagensAlternativas() {
    var imagens = document.querySelectorAll("img");
    for (var i = 0; i < imagens.length; i++) {
        imagens[i].addEventListener("error", function () {
            if (this.dataset.alternativaAplicada) return;
            this.dataset.alternativaAplicada = "sim";
            var rotulo = this.alt || "Mercado local Zungaki";
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="560" viewBox="0 0 800 560"><rect width="800" height="560" fill="#fff1e6"/><circle cx="400" cy="225" r="95" fill="#ff6a00" opacity=".18"/><path d="M340 250h120l-15 110H355z" fill="#ff6a00"/><path d="M365 250c0-45 70-45 70 0" fill="none" stroke="#ff6a00" stroke-width="16"/><text x="400" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#733000">' + escaparSvg(rotulo) + '</text></svg>';
            this.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
        });
    }
}

function escaparSvg(texto) {
    return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function initMapaDeReserva() {
    var mapa = document.getElementById("mapa-google");
    if (mapa && mapa.querySelector(".mapa-fallback")) {
        mostrarMapaAlternativo(mapa);
    }
}

/* =========================================================
   1. MENU DE NAVEGAÇÃO RESPONSIVO
========================================================= */
function initMenuResponsivo() {
    var botao = document.getElementById("menu-toggle");
    var menu = document.getElementById("nav-menu");

    if (!botao || !menu) return;

    botao.addEventListener("click", function () {
        var aberto = menu.classList.toggle("aberto");
        botao.classList.toggle("ativo", aberto);
        botao.setAttribute("aria-expanded", aberto ? "true" : "false");
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && menu.classList.contains("aberto")) {
            menu.classList.remove("aberto");
            botao.classList.remove("ativo");
            botao.setAttribute("aria-expanded", "false");
            botao.focus();
        }
    });

    /* Fecha o menu ao clicar num link (útil em telemóvel) */
    var links = menu.querySelectorAll("a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            menu.classList.remove("aberto");
            botao.classList.remove("ativo");
            botao.setAttribute("aria-expanded", "false");
        });
    }
}

/* =========================================================
   2. BOTÃO VOLTAR AO TOPO
========================================================= */
function initBotaoTopo() {
    var botao = document.getElementById("btn-topo");
    if (!botao) return;

    window.addEventListener("scroll", function () {
        if (window.scrollY > 400) {
            botao.classList.add("visivel");
        } else {
            botao.classList.remove("visivel");
        }
    });

    botao.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* =========================================================
   3. DARK MODE
========================================================= */
function initDarkMode() {
    var botao = document.getElementById("dark-mode-toggle");
    if (!botao) return;

    var preferencia = localStorage.getItem("zungaki-tema");
    if (preferencia === "escuro") {
        document.body.classList.add("modo-escuro");
        botao.textContent = "☀️";
    }

    botao.addEventListener("click", function () {
        var ativo = document.body.classList.toggle("modo-escuro");
        botao.textContent = ativo ? "☀️" : "🌙";
        localStorage.setItem("zungaki-tema", ativo ? "escuro" : "claro");
    });
}

/* =========================================================
   4. CARROSSEL DE PRODUTOS
========================================================= */
function initCarrossel() {
    var carrossel = document.getElementById("carousel-produtos");
    if (!carrossel) return;

    var track = carrossel.querySelector(".carousel-track");
    var slides = carrossel.querySelectorAll(".produto");
    var btnAnterior = carrossel.querySelector(".carousel-prev");
    var btnProximo = carrossel.querySelector(".carousel-next");
    var pontosContainer = document.getElementById("carousel-dots");

    if (!track || slides.length === 0) return;

    var visivel = calcularSlidesVisiveis();
    var indiceAtual = 0;

    /* Cria os indicadores (bolinhas) */
    var totalPaginas = Math.max(1, slides.length - visivel + 1);
    if (pontosContainer) {
        pontosContainer.innerHTML = "";
        for (var p = 0; p < totalPaginas; p++) {
            var ponto = document.createElement("button");
            ponto.className = "dot";
            ponto.setAttribute("aria-label", "Ir para o slide " + (p + 1));
            ponto.addEventListener("click", (function (indice) {
                return function () { irParaSlide(indice); };
            })(p));
            pontosContainer.appendChild(ponto);
        }
    }

    function calcularSlidesVisiveis() {
        var largura = window.innerWidth;
        if (largura < 700) return 1;
        if (largura < 1024) return 2;
        return 4;
    }

    function atualizarPontos() {
        if (!pontosContainer) return;
        var pontos = pontosContainer.querySelectorAll(".dot");
        for (var i = 0; i < pontos.length; i++) {
            pontos[i].classList.toggle("ativo", i === indiceAtual);
        }
    }

    function irParaSlide(indice) {
        var maximo = slides.length - visivel;
        if (indice < 0) indice = 0;
        if (indice > maximo) indice = maximo;
        indiceAtual = indice;

        var larguraSlide = slides[0].getBoundingClientRect().width;
        var estiloSlide = window.getComputedStyle(slides[0]);
        var gap = parseFloat(window.getComputedStyle(track).gap || "0");
        var deslocamento = (larguraSlide + gap) * indiceAtual;

        track.style.transform = "translateX(-" + deslocamento + "px)";
        atualizarPontos();
    }

    if (btnProximo) {
        btnProximo.addEventListener("click", function () {
            irParaSlide(indiceAtual + 1);
        });
    }

    if (btnAnterior) {
        btnAnterior.addEventListener("click", function () {
            irParaSlide(indiceAtual - 1);
        });
    }

    /* Recalcula ao redimensionar a janela */
    window.addEventListener("resize", function () {
        visivel = calcularSlidesVisiveis();
        irParaSlide(0);
    });

    /* Auto-play a cada 5 segundos */
    setInterval(function () {
        var proximo = indiceAtual + 1;
        if (proximo > slides.length - visivel) {
            proximo = 0;
        }
        irParaSlide(proximo);
    }, 5000);

    irParaSlide(0);
}

/* =========================================================
   5. VALIDAÇÃO DE FORMULÁRIOS (funções próprias)
========================================================= */

/* Funções de validação reutilizáveis */
function campoVazio(valor) {
    return valor === null || valor.trim() === "";
}

function emailValido(valor) {
    var padrao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return padrao.test(valor.trim());
}

function telefoneValidoAngola(valor) {
    var numeros = valor.replace(/\D/g, "");
    return numeros.length === 9 && numeros.charAt(0) === "9";
}

function mostrarErro(idSpan, mensagem) {
    var span = document.getElementById(idSpan);
    if (span) span.textContent = mensagem;
}

function limparErro(idSpan) {
    mostrarErro(idSpan, "");
}

/* --- Formulário: Newsletter --- */
function initFormularioNewsletter() {
    var form = document.getElementById("form-newsletter");
    if (!form) return;

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var campoEmail = document.getElementById("nl-email");
        var email = campoEmail.value;
        var valido = true;

        limparErro("erro-nl-email");

        if (campoVazio(email)) {
            mostrarErro("erro-nl-email", "Insira o seu email.");
            valido = false;
        } else if (!emailValido(email)) {
            mostrarErro("erro-nl-email", "Insira um email válido.");
            valido = false;
        }

        if (!valido) return;

        var sucesso = document.getElementById("nl-sucesso");
        if (sucesso) {
            sucesso.classList.add("visivel");
            setTimeout(function () { sucesso.classList.remove("visivel"); }, 4000);
        }
        campoEmail.value = "";
    });
}

/* --- Formulário: Contacto --- */
function initFormularioContacto() {
    var form = document.getElementById("form-contacto");
    if (!form) return;

    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        var nome = document.getElementById("c-nome").value;
        var email = document.getElementById("c-email").value;
        var telefone = document.getElementById("c-telefone").value;
        var mensagem = document.getElementById("c-mensagem").value;

        var valido = true;

        limparErro("erro-nome");
        limparErro("erro-email");
        limparErro("erro-telefone");
        limparErro("erro-mensagem");

        if (campoVazio(nome)) {
            mostrarErro("erro-nome", "O nome é obrigatório.");
            valido = false;
        } else if (nome.trim().length < 3) {
            mostrarErro("erro-nome", "O nome deve ter pelo menos 3 letras.");
            valido = false;
        }

        if (campoVazio(email)) {
            mostrarErro("erro-email", "O email é obrigatório.");
            valido = false;
        } else if (!emailValido(email)) {
            mostrarErro("erro-email", "Insira um email válido.");
            valido = false;
        }

        if (campoVazio(telefone)) {
            mostrarErro("erro-telefone", "O telefone é obrigatório.");
            valido = false;
        } else if (!telefoneValidoAngola(telefone)) {
            mostrarErro("erro-telefone", "Insira um número angolano válido (9 dígitos, começando por 9).");
            valido = false;
        }

        if (campoVazio(mensagem)) {
            mostrarErro("erro-mensagem", "Escreva uma mensagem.");
            valido = false;
        } else if (mensagem.trim().length < 10) {
            mostrarErro("erro-mensagem", "A mensagem deve ter pelo menos 10 caracteres.");
            valido = false;
        }

        if (!valido) return;

        var sucesso = document.getElementById("contacto-sucesso");
        if (sucesso) {
            sucesso.classList.add("visivel");
            setTimeout(function () { sucesso.classList.remove("visivel"); }, 4000);
        }
        form.reset();
    });
}

/* =========================================================
   6. MAPA INTERATIVO (Google Maps API)
   O mapa em index.html usa a API JavaScript oficial do Google Maps.
   Para funcionar, o <script> em index.html precisa de uma chave de
   API válida (substitui "COLOCA_AQUI_A_TUA_CHAVE_API").
   Como obter: console.cloud.google.com -> criar projeto -> ativar
   "Maps JavaScript API" -> Credenciais -> Criar chave de API.
   Enquanto a chave não for configurada, aparece uma mensagem de
   aviso no lugar do mapa (ver gm_authFailure abaixo).
========================================================= */
function carregarMapa() {
    var elemento = document.getElementById("mapa-google");
    if (!elemento) return;

    if (typeof google === "undefined" || typeof google.maps === "undefined") {
        mostrarMapaAlternativo(elemento);
        return;
        elemento.innerHTML = '<p class="mapa-fallback">Não foi possível carregar o mapa. Verifica a chave da API do Google Maps em index.html.</p>';
        return;
    }

    var kilamba = { lat: -8.9963, lng: 13.2683 };

    var mapa = new google.maps.Map(elemento, {
        zoom: 15,
        center: kilamba,
    });

    var marcador = new google.maps.Marker({
        position: kilamba,
        map: mapa,
        title: "Zungaki - Kilamba, Luanda",
    });

    var infoJanela = new google.maps.InfoWindow({
        content: "<strong>Zungaki</strong><br>Kilamba, Luanda, Angola"
    });

    marcador.addListener("click", function () {
        infoJanela.open(mapa, marcador);
    });
}

/* Se a API do Google Maps não carregar (chave em falta/inválida), o
   próprio script da API chama gm_authFailure(). Mostramos um aviso claro. */
window.gm_authFailure = function () {
    var elemento = document.getElementById("mapa-google");
    if (elemento) {
        elemento.innerHTML = '<p class="mapa-fallback">Chave da API do Google Maps inválida ou em falta. Edita o &lt;script&gt; da API em index.html.</p>';
    }
};

function mostrarMapaAlternativo(elemento) {
    elemento.innerHTML = '<iframe title="Mapa da Zungaki em Kilamba, Luanda" src="https://www.google.com/maps?q=Kilamba%2C%20Luanda%2C%20Angola&z=14&output=embed" width="100%" height="100%" style="border:0" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
}

/* =========================================================
   7. PÁGINA DE PRODUTOS - expandir/recolher detalhes
========================================================= */

/* Expande o cartão do produto clicado (mostra descrição + botão comprar)
   e fecha os outros que estejam abertos. Clicar novamente fecha-o. */
function toggleProduct(imagem) {
    var cartao = imagem.closest(".produto");
    if (!cartao) return;

    var jaAberto = cartao.classList.contains("expandido");

    var todosCartoes = document.querySelectorAll(".produto");
    for (var i = 0; i < todosCartoes.length; i++) {
        todosCartoes[i].classList.remove("expandido");
    }

    if (!jaAberto) {
        cartao.classList.add("expandido");
        cartao.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

/* Ação do botão "Comprar Agora": encaminha o pedido para o WhatsApp
   da Zungaki já com o nome do produto preenchido na mensagem. */
function comprarAgora(evento) {
    evento.stopPropagation();

    var botao = evento.currentTarget || evento.target;
    var cartao = botao.closest(".produto");
    var nomeProduto = cartao ? cartao.querySelector("h3").textContent.trim() : "produto";
    var precoProduto = cartao ? cartao.querySelector("p").textContent.trim() : "";

    var mensagem = "Olá! Tenho interesse em comprar: " + nomeProduto + " (" + precoProduto + ").";
    var url = "https://wa.me/244923000000?text=" + encodeURIComponent(mensagem);
    window.open(url, "_blank");
}

/* =========================================================
   8. INTEGRAÇÃO COM REDES SOCIAIS (partilha)
========================================================= */
function partilharFacebook() {
    var url = encodeURIComponent(window.location.href);
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + url, "_blank", "width=600,height=400");
}

function partilharWhatsApp() {
    var texto = encodeURIComponent("Confira a Zungaki: " + window.location.href);
    window.open("https://wa.me/?text=" + texto, "_blank");
}

function partilharTwitter() {
    var texto = encodeURIComponent("Confira a Zungaki, o mercado digital de Luanda!");
    var url = encodeURIComponent(window.location.href);
    window.open("https://twitter.com/intent/tweet?text=" + texto + "&url=" + url, "_blank", "width=600,height=400");
}

