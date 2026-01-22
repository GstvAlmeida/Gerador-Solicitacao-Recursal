import { gerarPDFComDados } from './pdf_generator.js'; 

// --- Estado Global ---
let logoBase64 = null;
let printInscricaoBase64 = null;

// --- Inicialização ---
window.addEventListener('load', () => {
    carregarLogoPadrao();
    
    const dataInput = document.getElementById('dataAssinatura');
    if (dataInput) dataInput.valueAsDate = new Date();

    setupEventListeners();
});

// --- Configuração de Eventos ---
function setupEventListeners() {
    // 1. Inputs de Cálculo (Datas e Valores)
    const prazoInput = document.getElementById('prazo');
    const valorInput = document.getElementById('valor');
    const custoInput = document.getElementById('custoTotal');

    if (prazoInput) prazoInput.addEventListener('change', calcularDiasRestantes);
    if (valorInput) valorInput.addEventListener('input', calcularEconomia);
    if (custoInput) custoInput.addEventListener('input', calcularEconomia);

    // 2. Upload de Print (Inscrição)
    const fileInput = document.getElementById('uploadPrint');
    const fileNameSpan = document.getElementById('fileName');

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Atualiza UI
                fileNameSpan.textContent = "Arquivo pronto: " + file.name;
                fileNameSpan.style.color = "#28a745";
                fileNameSpan.style.fontWeight = "bold";

                // Processa Arquivo
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    printInscricaoBase64 = readerEvent.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                printInscricaoBase64 = null;
                fileNameSpan.textContent = "Clique para enviar o print (JPG/PNG)";
                fileNameSpan.style.color = ""; // Reseta cor
            }
        });
    }

    // 3. Toggles de Visibilidade (Abas)
    const radiosInscricao = document.querySelectorAll('input[name="inscricoesPre"]');
    const containerEspecificar = document.getElementById('containerEspecificar');
    
    const checarEstadoInscricao = () => {
        const isSim = document.getElementById('inscricaoSim').checked;
        if (isSim) {
            containerEspecificar.classList.remove('hidden');
        } else {
            containerEspecificar.classList.add('hidden');
            printInscricaoBase64 = null; // Limpa imagem se ocultar
        }
    };
    radiosInscricao.forEach(r => r.addEventListener('change', checarEstadoInscricao));

    const radiosTipo = document.querySelectorAll('input[name="tipoInscricao"]');
    const areaTexto = document.getElementById('areaTexto');
    const areaImagem = document.getElementById('areaImagem');

    radiosTipo.forEach(r => r.addEventListener('change', (e) => {
        if (e.target.value === 'texto') {
            areaTexto.classList.remove('hidden');
            areaImagem.classList.add('hidden');
        } else {
            areaTexto.classList.add('hidden');
            areaImagem.classList.remove('hidden');
        }
    }));

    // 4. Botão Gerar PDF
    const btn = document.getElementById('btnGerarPDF');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); 
            gerarPDFComDados(logoBase64, printInscricaoBase64);
        });
    }
}

// --- Funções Utilitárias e de Cálculo ---

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
        try { 
            logoBase64 = canvas.toDataURL("image/png"); 
        } catch (e) {
            console.error("Erro ao converter logo:", e);
        }
    };
}

function calcularDiasRestantes() {
    const prazo = document.getElementById('prazo').value;
    if (prazo) {
        const dataPrazo = new Date(prazo);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        dataPrazo.setHours(0, 0, 0, 0);
        
        const diffDays = Math.ceil((dataPrazo - hoje) / (1000 * 60 * 60 * 24)) + 1; 
        const el = document.getElementById('diasRestantes');
        if (el) el.value = diffDays;
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
    if (elEconomia) elEconomia.value = economia.toLocaleString('pt-BR', formatoMoeda);
}