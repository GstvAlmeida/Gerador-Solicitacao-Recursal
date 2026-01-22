const { jsPDF } = window.jspdf;

/* =========================================
   1. Helpers de DOM e Formatação
   ========================================= */
const val = (id) => {
    const el = document.getElementById(id);
    return el ? el.value : "";
};

const isChecked = (id) => {
    const el = document.getElementById(id);
    return el ? el.checked : false;
};

const radioVal = (name, checkVal) => {
    const el = document.querySelector(`input[name="${name}"]:checked`);
    return el ? el.value === checkVal : false;
};

const radioId = (id) => {
    const el = document.getElementById(id);
    return el ? el.checked : false;
};

function formatarDataBR(dataInput) {
    if (!dataInput) return "";
    if (dataInput.includes('-')) {
        const [ano, mes, dia] = dataInput.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    return dataInput;
}

/* =========================================
   2. Função Principal de Geração
   ========================================= */
export function gerarPDFComDados(logoBase64, printInscricaoBase64) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Configurações Globais
    const margemEsq = 20;
    const larguraUtil = 170;
    const entrelinha = 6;
    
    // Controle de Cabeçalho e Paginação
    const adicionarCabecalho = () => {
        if (logoBase64) {
            doc.setGState(new doc.GState({ opacity: 0.5 }));
            doc.addImage(logoBase64, 'PNG', margemEsq, 10, 40, 15);
            doc.setGState(new doc.GState({ opacity: 1.0 }));
            return 35;
        }
        return 25;
    };

    let y = adicionarCabecalho();

    // --- Helpers de Desenho (Escopo Local) ---
    
    const addSection = (texto) => {
        y += 4;
        doc.setFont("times", "bold");
        doc.setFontSize(12);
        doc.setFillColor(230, 230, 230);
        doc.text(texto.toUpperCase(), margemEsq, y);
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        y += 6;
    };

    const addSubSection = (texto) => {
        doc.setFont("times", "bold");
        doc.setFontSize(11);
        doc.text("• " + texto, margemEsq, y);
        doc.setFont("times", "normal");
        y += entrelinha;
    };

    const addField = (label, larguraLinha, xInicial = margemEsq, quebraLinha = true, valorPreenchido = "") => {
        doc.setFont("times", "bold");
        doc.text(label, xInicial, y);
        const larguraTexto = doc.getTextWidth(label);
        const xLinha = xInicial + larguraTexto + 1;
        
        doc.setLineWidth(0.2);
        doc.setDrawColor(50);
        doc.line(xLinha, y + 1, xLinha + larguraLinha, y + 1);

        if (valorPreenchido) {
            doc.setFont("courier", "bold"); 
            doc.setFontSize(10);
            let valorFinal = valorPreenchido;
            if(valorFinal.match && valorFinal.match(/^\d{4}-\d{2}-\d{2}$/)) valorFinal = formatarDataBR(valorFinal);
            doc.text(String(valorFinal), xLinha + 2, y);
            doc.setFont("times", "normal");
            doc.setFontSize(11);
        }
        return quebraLinha ? (y += entrelinha, margemEsq) : (xLinha + larguraLinha + 5);
    };

    const addFieldNormal = (label, larguraLinha, xInicial = margemEsq, quebraLinha = true, valorPreenchido = "") => {
        doc.setFont("times", "normal");
        doc.text(label, xInicial, y);
        const larguraTexto = doc.getTextWidth(label);
        const xLinha = xInicial + larguraTexto + 1;
        
        doc.setLineWidth(0.2);
        doc.setDrawColor(50);
        doc.line(xLinha, y + 1, xLinha + larguraLinha, y + 1);

        if (valorPreenchido) {
            doc.setFont("courier", "bold"); 
            doc.setFontSize(10);
            let valorFinal = valorPreenchido;
            if(valorFinal.match && valorFinal.match(/^\d{4}-\d{2}-\d{2}$/)) valorFinal = formatarDataBR(valorFinal);
            doc.text(String(valorFinal), xLinha + 2, y);
            doc.setFont("times", "normal");
            doc.setFontSize(11);
        }
        return quebraLinha ? (y += entrelinha, margemEsq) : (xLinha + larguraLinha + 5);
    };

    const addCheckbox = (label, x, currentY, checked = false) => {
        const size = 3.5;
        doc.setLineWidth(0.2);
        doc.rect(x, currentY - size + 1, size, size);
        if(checked) {
             doc.setFont("courier", "bold"); 
             doc.text("X", x + 0.5, currentY);
             doc.setFont("times", "normal"); 
        }
        doc.text(label, x + size + 2, currentY);
        return x + size + 2 + doc.getTextWidth(label) + 5;
    };

    const addLongText = (texto, maxLinhas = 30) => {
        doc.setFont("courier", "bold");
        doc.setFontSize(10);
        
        const splitText = doc.splitTextToSize(texto, larguraUtil);
        let linhasReais = splitText.length;
        if (linhasReais < 3) linhasReais = 3;
        if (linhasReais > maxLinhas) linhasReais = maxLinhas;

        for(let i=0; i < linhasReais; i++) {
            if (y > 265) { 
                doc.addPage(); 
                y = adicionarCabecalho(); 
            }
            doc.setDrawColor(150); 
            doc.line(margemEsq, y + 1, margemEsq + larguraUtil, y + 1);
            if(splitText[i]) doc.text(splitText[i], margemEsq, y);
            y += entrelinha;
        }
        doc.setFont("times", "normal");
        doc.setFontSize(11);
    };

    // =========================================
    // INÍCIO DA MONTAGEM DO PDF
    // =========================================

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("FORMULÁRIO DE SOLICITAÇÃO DE AUTORIZAÇÃO RECURSAL", 105, y, { align: "center" });
    y += 10;

    // --- Seção 1: Dados Básicos ---
    addSection("1. DADOS BÁSICOS DO PROCESSO");
    let cursorX = margemEsq;
    cursorX = addFieldNormal("Pasta CIV:", 50, cursorX, false, val('pasta'));
    addFieldNormal("Cliente:", 70, cursorX, true, val('cliente'));

    cursorX = margemEsq;
    cursorX = addFieldNormal("Valor originário da Condenação:", 40, cursorX, false, val('valor'));
    addFieldNormal("Verba Honorária:", 40, cursorX, true, val('honoraria'));

    doc.setFont("times", "normal"); 
    doc.text("Responsabilidade Solidária:", margemEsq, y);
    cursorX = margemEsq + doc.getTextWidth("Responsabilidade Solidária:") + 5;
    cursorX = addCheckbox("Sim", cursorX, y, radioVal('respSolidaria', 'sim'));
    addCheckbox("Não", cursorX, y, radioVal('respSolidaria', 'nao'));
    y += entrelinha;

    addFieldNormal("Se sim, com quem:", 120, margemEsq, true, val('comQuem'));
    addFieldNormal("Valor estimado de custas recursais:", 100, margemEsq, true, val('custas'));

    cursorX = margemEsq;
    cursorX = addFieldNormal("Prazo fatal para interpor o recurso:", 30, cursorX, false, val('prazo'));
    
    doc.setFont("times", "normal");
    doc.text("(Dias restantes: ", cursorX, y);
    let wDias = doc.getTextWidth("(Dias restantes: ");
    doc.line(cursorX + wDias, y+1, cursorX + wDias + 10, y+1);
    doc.setFont("courier", "bold"); doc.setFontSize(10);
    doc.text(val('diasRestantes'), cursorX + wDias + 2, y);
    doc.setFont("times", "normal"); doc.setFontSize(11);
    doc.text(")", cursorX + wDias + 11, y);
    y += entrelinha;

    // --- Seção 2: Análise Específica ---
    addSection("2. ANÁLISE ESPECÍFICA DO CASO");
    doc.text("O autor comprovou a inclusão de restrição pela Ativos?: ", margemEsq, y);
    cursorX = margemEsq + doc.getTextWidth("O autor comprovou a inclusão de restrição pela Ativos?: ") + 2;
    cursorX = addCheckbox("Sim", cursorX, y, radioVal('comprovouInclusao', 'sim'));
    addCheckbox("Não", cursorX, y, radioVal('comprovouInclusao', 'nao'));
    y += entrelinha;

    doc.setFont("times", "bold");
    doc.text("Por que razão a negativação ou cobrança foi considerada indevida?", margemEsq, y);
    y += entrelinha;

    cursorX = margemEsq;
    cursorX = addCheckbox("Ausência de documentos", cursorX, y, isChecked('motivo1'));
    addCheckbox("Pagamento anterior à cessão", cursorX, y, isChecked('motivo2'));
    y += entrelinha;
    cursorX = margemEsq;
    cursorX = addCheckbox("Dívida prescrita", cursorX, y, isChecked('motivo3'));
    addCheckbox("Valor incorreto da dívida", cursorX, y, isChecked('motivo4'));
    y += entrelinha;
    cursorX = margemEsq;
    cursorX = addCheckbox("Falta de notificação prévia", cursorX, y, isChecked('motivo5'));
    addCheckbox("Cessão irregular", cursorX, y, isChecked('motivo6'));
    y += entrelinha;

    cursorX = margemEsq;
    cursorX = addCheckbox("Outro:", cursorX, y, isChecked('motivo7'));
    doc.line(cursorX, y+1, cursorX + 125, y+1);
    if(val('motivoOutro')) {
        doc.setFont("courier", "bold"); doc.setFontSize(10);
        doc.text(val('motivoOutro'), cursorX + 2, y);
        doc.setFont("times", "normal"); doc.setFontSize(11);
    }
    y += entrelinha * 1.5;

    // --- Tratamento de Inscrições Preexistentes (Texto ou Imagem) ---
    doc.text("Há inscrições preexistentes à da Ativos que não estão sendo questionadas em juízo?", margemEsq, y);
    y += entrelinha;
    
    const temInscricoes = radioVal('inscricoesPre', 'sim');
    
    cursorX = margemEsq;
    cursorX = addCheckbox("Sim", cursorX, y, temInscricoes);
    addCheckbox("Não", cursorX, y, radioVal('inscricoesPre', 'nao'));
    y += entrelinha;
    
    doc.text("Se sim, especificar:", margemEsq, y);

    if (temInscricoes) {
        const modoImagem = radioVal('tipoInscricao', 'imagem');
        
        if (modoImagem && printInscricaoBase64) {
            // Desenhar Imagem
            doc.setFont("courier", "bold"); doc.setFontSize(10);
            y += entrelinha + 2;

            try {
                const imgProps = doc.getImageProperties(printInscricaoBase64);
                // Cálculo Proporcional (Largura Fixa = 170mm)
                const pdfImgHeight = (imgProps.height * larguraUtil) / imgProps.width;

                if (y + pdfImgHeight > 275) {
                    doc.addPage();
                    y = adicionarCabecalho();
                }

                doc.addImage(printInscricaoBase64, 'PNG', margemEsq, y, larguraUtil, pdfImgHeight);
                y += pdfImgHeight + 6;

            } catch (err) {
                console.error("Erro ao desenhar imagem:", err);
                doc.text("[ERRO AO PROCESSAR IMAGEM]", margemEsq, y);
                y += entrelinha;
            }

        } else {
            // Desenhar Texto
            doc.line(margemEsq + 35, y+1, margemEsq + 170, y+1);
            let textoFinal = val('especificarInscricoes');
            
            if(modoImagem && !printInscricaoBase64) textoFinal = "[IMAGEM SELECIONADA, MAS NÃO ENVIADA]";
            if(!textoFinal) textoFinal = "NÃO INFORMADO";

            doc.setFont("courier", "bold"); doc.setFontSize(10);
            doc.text(textoFinal, margemEsq + 36, y);
            doc.setFont("times", "normal"); doc.setFontSize(11);
            y += entrelinha;
        }

    } else {
        doc.line(margemEsq + 35, y+1, margemEsq + 170, y+1);
        doc.setFont("courier", "bold"); doc.setFontSize(10);
        doc.text("NÃO HÁ", margemEsq + 36, y);
        doc.setFont("times", "normal"); doc.setFontSize(11);
        y += entrelinha;
    }

    // --- Seção 3: Dados Complementares ---
    addSection("3. DADOS COMPLEMENTARES");
    doc.setFont("times", "bold");
    doc.text("Tipo de restrição realizada pela Ativos:", margemEsq, y);
    y += entrelinha;
    addCheckbox("SPC/Serasa (negativação efetiva)", margemEsq, y, isChecked('restricao1'));
    y += entrelinha;
    cursorX = margemEsq;
    cursorX = addCheckbox("Serasa Limpa Nome/Conta Atrasada", cursorX, y, isChecked('restricao2'));
    addCheckbox("Apenas cobrança extrajudicial", cursorX, y, isChecked('restricao3'));
    y += entrelinha;
    cursorX = margemEsq;
    cursorX = addCheckbox("Outro:", cursorX, y, isChecked('restricao4'));
    doc.line(cursorX, y+1, cursorX + 100, y+1);
    if(val('restricaoOutro')) {
         doc.setFont("courier", "bold"); 
         doc.text(val('restricaoOutro'), cursorX + 2, y);
         doc.setFont("times", "normal");
    }
    y += entrelinha * 1.5;

    doc.text("Valor do dano moral arbitrado está:", margemEsq, y);
    y += entrelinha;
    addCheckbox("Dentro dos parâmetros jurisprudenciais", margemEsq, y, radioId('dano1')); y += entrelinha;
    addCheckbox("Acima dos parâmetros usuais", margemEsq, y, radioId('dano2')); y += entrelinha;
    addCheckbox("Significativamente excessivo", margemEsq, y, radioId('dano3')); y += entrelinha;

    // --- Seção 4: Histórico ---
    addSection("4. HISTÓRICO DO CASO");
    doc.text("Resumo das principais alegações e fundamentos da sentença:", margemEsq, y);
    y += entrelinha;
    addLongText(val('resumo'), 30); 

    // --- Seção 5: Parecer Técnico ---
    if (y > 250) { doc.addPage(); y = adicionarCabecalho(); }
    addSection("5. PARECER TÉCNICO");
    
    addSubSection("ANÁLISE DE MÉRITO");
    doc.text("Possibilidade de reversão:", margemEsq, y);
    cursorX = margemEsq + 45;
    cursorX = addCheckbox("Alta (>70%)", cursorX, y, val('reversao') === 'alta');
    cursorX = addCheckbox("Média (30-70%)", cursorX, y, val('reversao') === 'media');
    addCheckbox("Baixa (<30%)", cursorX, y, val('reversao') === 'baixa');
    y += entrelinha;

    addSubSection("ANÁLISE DO VALOR");
    doc.text("Possibilidade de redução:", margemEsq, y);
    cursorX = margemEsq + 45;
    cursorX = addCheckbox("Alta (>70%)", cursorX, y, val('reducao') === 'alta');
    cursorX = addCheckbox("Média (30-70%)", cursorX, y, val('reducao') === 'media');
    addCheckbox("Baixa (<30%)", cursorX, y, val('reducao') === 'baixa');
    y += entrelinha * 1.5;

    addSubSection("FUNDAMENTOS PARA O RECURSO");
    addCheckbox("Valor da condenação acima dos parâmetros jurisprudenciais", margemEsq, y, isChecked('fund1')); y += entrelinha;
    addCheckbox("Aplicação da Súmula 385 STJ (negativações preexistentes)", margemEsq, y, isChecked('fund2')); y += entrelinha;
    addCheckbox("Ausência de dano moral efetivo", margemEsq, y, isChecked('fund3')); y += entrelinha;
    addCheckbox("Cobrança não configura negativação", margemEsq, y, isChecked('fund4')); y += entrelinha;
    addCheckbox("Vício processual", margemEsq, y, isChecked('fund5')); y += entrelinha;
    addCheckbox("Prescrição da pretensão indenizatória", margemEsq, y, isChecked('fund6')); y += entrelinha;
    
    cursorX = margemEsq;
    cursorX = addCheckbox("Outro:", cursorX, y, false);
    doc.line(cursorX, y+1, cursorX + 100, y+1);
    if(val('fundOutro')) {
        doc.setFont("courier", "bold"); doc.setFontSize(10);
        doc.text(val('fundOutro'), cursorX + 2, y);
        doc.setFont("times", "normal"); doc.setFontSize(11);
    }

    if (y > 230) { doc.addPage(); y = adicionarCabecalho(); }
    y += entrelinha * 1.5;
    
    addSubSection("ESTRATÉGIA RECURSAL");
    addCheckbox("Buscar reversão total da sentença", margemEsq, y, isChecked('strat1')); y += entrelinha;
    addCheckbox("Buscar apenas minoração do valor", margemEsq, y, isChecked('strat2')); y += entrelinha;
    addCheckbox("Aplicar súmula/precedente específico", margemEsq, y, isChecked('strat3')); y += entrelinha;
    addCheckbox("Questionar competência/procedimento", margemEsq, y, isChecked('strat4'));
    y += entrelinha * 1.5;

    addSubSection("ANÁLISE CUSTO-BENEFÍCIO");
    cursorX = margemEsq;
    cursorX = addField("Custo total estimado do recurso:", 30, cursorX, false, val('custoTotal'));
    cursorX = addField("Economia potencial máxima:", 30, cursorX, false, val('economia'));
    y += entrelinha;
    
    doc.text("Relação custo-benefício:", margemEsq, y);
    cursorX = margemEsq + 50;
    cursorX = addCheckbox("Favorável", cursorX, y, radioId('cb1'));
    cursorX = addCheckbox("Desfavorável", cursorX, y, radioId('cb2'));
    addCheckbox("Equilibrada", cursorX, y, radioId('cb3'));
    y += entrelinha;

    if (y > 220) { 
        doc.addPage(); 
        y = adicionarCabecalho(); 
    }

    // --- Seção 6: Recomendação ---
    addSection("6. RECOMENDAÇÃO FINAL");
    addCheckbox("SOLICITAMOS AUTORIZAÇÃO PARA RECURSO", margemEsq, y, radioId('rec1')); y += entrelinha;
    addCheckbox("NÃO RECOMENDAMOS RECURSO", margemEsq, y, radioId('rec2')); y += entrelinha;
    addCheckbox("RECURSO CONDICIONAL (especificar condições)", margemEsq, y, radioId('rec3')); y += entrelinha;
    
    doc.text("Justificativa da recomendação:", margemEsq, y); y += entrelinha;
    addLongText(val('justificativa'), 10);

    if (y > 220) { 
        doc.addPage(); 
        y = adicionarCabecalho(); 
    }

    // --- Seção 7: Anexos ---
    addSection("7. ANEXOS OBRIGATÓRIOS NO SISTEMA ESPAIDER");
    doc.setFontSize(10);
    cursorX = margemEsq;
    cursorX = addCheckbox("Sentença/Acórdão completo", cursorX, y, isChecked('anexo1'));
    addCheckbox("Certidão de publicação/intimação", cursorX, y, isChecked('anexo2'));
    y += entrelinha;
    cursorX = margemEsq;
    cursorX = addCheckbox("Cálculo atualizado da condenação", cursorX, y, isChecked('anexo3'));
    addCheckbox("Comprovantes de negativação/cobrança", cursorX, y, isChecked('anexo4'));
    y += entrelinha;
    cursorX = margemEsq;
    addCheckbox("Histórico de restrições do CPF", cursorX, y, isChecked('anexo5'));
    y += entrelinha;
    cursorX = margemEsq;
    cursorX = addCheckbox("Procuração vigente", cursorX, y, isChecked('anexo6'));
    addCheckbox("Jurisprudência aplicável", cursorX, y, isChecked('anexo7'));
    doc.setFontSize(11);
    y += entrelinha * 2;

    if (y > 220) { 
        doc.addPage(); 
        y = adicionarCabecalho(); 
    }

    // --- Seção 8: Assinatura ---
    addSection("8. RESPONSABILIDADE");
    cursorX = margemEsq;
    cursorX = addField("Advogado Responsável:", 70, cursorX, false, val('advogado'));
    addField("OAB/RN:", 20, cursorX, true, val('oab'));
    cursorX = margemEsq;
    cursorX = addField("Escritório:", 60, cursorX, false, val('escritorio'));
    cursorX = addField("Data:", 30, cursorX, false, formatarDataBR(val('dataAssinatura'))); 
    y += entrelinha;
    addField("Assinatura:", 100, margemEsq, true);
    
    // --- Rodapé de Aprovação ---
    if (y > 250) { doc.addPage(); y = adicionarCabecalho(); }
    
    y += 5;
    doc.setLineWidth(0.4);
    doc.rect(margemEsq, y, larguraUtil, 40);
    y += 6;
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("PARA USO EXCLUSIVO DA ATIVOS S.A.", margemEsq + 2, y);
    y += 7;
    doc.text("Análise GEJUR:", margemEsq + 2, y);
    doc.setFont("times", "normal");
    doc.text("Recebido em: ____/____/_______", margemEsq + 35, y);
    y += 7;
    doc.setFont("times", "bold");
    doc.text("Analisado por:", margemEsq + 2, y);
    doc.setLineWidth(0.2);
    doc.line(margemEsq + 28, y, margemEsq + larguraUtil - 2, y);
    y += 8;
    doc.text("Decisão:", margemEsq + 2, y);
    doc.setFont("times", "normal");
    let checkX = margemEsq + 20;
    doc.rect(checkX, y-3, 3.5, 3.5); doc.text("AUTORIZADO", checkX + 5, y);
    checkX += 35; doc.rect(checkX, y-3, 3.5, 3.5); doc.text("NEGADO", checkX + 5, y);
    checkX += 25; doc.rect(checkX, y-3, 3.5, 3.5); doc.text("SOLICITAR COMPLEMENTAÇÃO", checkX + 5, y);
    y += 8;
    doc.setFont("times", "bold");
    doc.text("Observações:", margemEsq + 2, y);
    y += 1;
    doc.line(margemEsq + 25, y, margemEsq + larguraUtil - 2, y);

    doc.save('Solicitacao_Recursal_Ativos.pdf');
}