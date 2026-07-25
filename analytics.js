/*
 * Medição opcional e compatível com privacidade.
 * O ID de medição está centralizado neste ficheiro.
 * O código só é carregado depois de o visitante aceitar a política.
 */
(function () {
    var id = "G-T9DWJJH9FR";
    window.aceitarCookiesZungaki = function () {
        localStorage.setItem("zungaki-cookies-aceites", "sim");
    };
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;

    function carregar() {
        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", id, { anonymize_ip: true });
    }

    if (localStorage.getItem("zungaki-cookies-aceites") === "sim") carregar();
    window.aceitarCookiesZungaki = function () {
        localStorage.setItem("zungaki-cookies-aceites", "sim");
        carregar();
    };
}());
