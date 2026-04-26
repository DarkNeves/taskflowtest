# Notas de Teste — TaskFlow

## Testes realizados com sucesso
- Formulário Adicionar: preenchido nome, descrição, data, prioridade
- Fluxo Enter: Nome → Enter → Descrição focou corretamente → Enter → Data focou corretamente
- Submissão: Toast "Demanda adicionada!" apareceu, formulário limpou, foco voltou ao nome
- Aba Pendentes: Tarefa "Relatório mensal de vendas" apareceu com badge ALTA, descrição e data 30/04/2026
- Header: Contagem atualizada para "1 Alta"
- Badge na aba: "Pendentes 1" apareceu corretamente

## Problema detectado
- Na aba Pendentes, o formulário de Adicionar está aparecendo embaixo da lista (parece estar renderizando conteúdo de outra aba)
- Isso pode ser um problema de AnimatePresence/renderização condicional
