# Gerador de Solicitação Recursal

Este site foi criado para simplificar e agilizar a criação de formulários de solicitação de recursos jurídicos. O objetivo é transformar o preenchimento manual de documentos em um processo digital de poucos cliques, centralizando a análise do processo em uma única interface.

Com ele, é possível gerar um documento PDF padronizado contendo todas as informações necessárias para a análise recursal pela Ativos S.A., garantindo consistência, organização e economizando um tempo valioso da equipe jurídica.

## Principais Funcionalidades

* **Geração Automática de PDF:** Basta preencher os campos e o sistema monta um documento PDF rigorosamente formatado, paginado e pronto para uso oficial.
* **Cálculos Inteligentes:** O painel calcula automaticamente os **dias restantes** para o prazo fatal do recurso e a **economia potencial máxima** (valor da condenação subtraído do custo do recurso).
* **Anexo de Evidências (Prints):** Interface moderna que permite fazer o upload de uma imagem (JPG/PNG) para comprovar inscrições preexistentes. A imagem é processada e embutida diretamente com o tamanho correto dentro do PDF gerado.
* **Interface Dinâmica (Toggles):** O formulário é inteligente e esconde/exibe campos dependendo das suas respostas (ex: o campo de anexar print só aparece se você confirmar que existem inscrições preexistentes).
* **Padrão Corporativo:** O documento gerado finaliza com um rodapé de deliberação exclusivo ("Para Uso Exclusivo da Ativos S.A. - Análise GEJUR"), facilitando o fluxo interno de aprovação.

## Como Usar

O fluxo de trabalho foi projetado para ser rápido e eficiente:

1.  **Acesse o Gerador:** Abra o site `https://gstvalmeida.github.io/Gerador-Solicitacao-Recursal/` no seu navegador.
2.  **Preencha as Informações:** Complete os campos de texto, selecione as datas e marque as caixas de seleção (checkboxes) que se aplicam à realidade do processo.
3.  **Anexe Provas (Se aplicável):** Na seção de inscrições preexistentes, escolha "Anexar Print" e faça o upload da imagem comprobatória.
4.  **Revise e Gere:** Ao finalizar o preenchimento e o parecer técnico, desça até o fim da página e clique no botão **"GERAR PDF"**.
5.  **Utilize o Documento:** O arquivo `Solicitacao_Recursal_Ativos.pdf` será baixado automaticamente no seu computador, pronto para ser anexado no sistema Espaider.