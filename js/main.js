import { gerarPDFComDados } from './pdf_generator.js';

let logoBase64 = null;

window.addEventListener('load', () => {
    carregarLogoPadrao();
    
    // Define data atual
    const dataInput = document.getElementById('dataAssinatura');
    if(dataInput) dataInput.valueAsDate = new Date();

    setupEventListeners();
});

function carregarLogoPadrao() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = 'assets/logo.png';
    img.onload = function() {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try { logoBase64 = canvas.toDataURL("image/png"); } catch (e) { console.warn("Erro CORS logo"); }
    };
    img.onerror = () => console.warn("Não foi possível carregar o logo em assets/logo.png");
}

function setupEventListeners() {
    // Dias Restantes
    const prazoInput = document.getElementById('prazo');
    if(prazoInput) prazoInput.addEventListener('change', calcularDiasRestantes);

    // Economia
    const valorInput = document.getElementById('valor');
    const custoInput = document.getElementById('custoTotal');
    
    if(valorInput) valorInput.addEventListener('input', calcularEconomia);
    if(custoInput) custoInput.addEventListener('input', calcularEconomia);

    // CRÍTICO: O Botão de Gerar PDF
    const btn = document.getElementById('btnGerarPDF');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Previne comportamento padrão de form
            console.log("Iniciando geração do PDF...");
            gerarPDFComDados(logoBase64);
        });
    } else {
        console.error("ERRO: Botão com id 'btnGerarPDF' não encontrado no HTML.");
    }
}

// Funções de cálculo (Mantenha as mesmas de antes)
function calcularDiasRestantes() {
    const prazo = document.getElementById('prazo').value;
    if (prazo) {
        const dataPrazo = new Date(prazo);
        const hoje = new Date();
        hoje.setHours(0,0,0,0);
        dataPrazo.setHours(0,0,0,0);
        const diffDays = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24)) + 1; 
        const el = document.getElementById('diasRestantes');
        if(el) el.value = diffDays;
    }
}

function calcularEconomia() {
    const converterParaNumero = (id) => {
        const el = document.getElementById(id);
        if (!el || !el.value) return 0;
        let valor = el.value.replace("R$", "").trim().replaceAll(".", "").replace(",", ".");
        return parseFloat(valor) || 0;
    };

    const valorCondenacao = converterParaNumero('valor');
    const custoRecurso = converterParaNumero('custoTotal');
    const economia = valorCondenacao - custoRecurso;

    const formatoMoeda = { style: 'currency', currency: 'BRL' };
    const elEconomia = document.getElementById('economia');
    if(elEconomia) elEconomia.value = economia.toLocaleString('pt-BR', formatoMoeda);
}