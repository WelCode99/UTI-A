# 🚀 Guia de Instalação - UTI.AI

## 📋 Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Suporte a JavaScript habilitado
- Conexão com internet (apenas para IA - funcionalidades offline disponíveis)

## ⚡ Instalação Rápida

### **Opção 1: Uso Direto (Recomendado)**

1. **Abrir o arquivo**: `index.html` diretamente no navegador
2. **Resultado**: App funcionando imediatamente
3. **Benefícios**: Zero configuração, dados salvos automaticamente

### **Opção 2: Servidor Local (Desenvolvimento)**

```bash
# Se você tiver Python instalado:
python -m http.server 8000

# Ou se tiver Node.js:
npx serve .

# Ou use qualquer servidor estático
```

Acesse: `http://localhost:8000`

## 📱 Instalação PWA (Progressive Web App)

### **Automática**
- O app oferecerá instalação após algumas interações
- Prompt automático aparecerá na parte inferior
- Clique em **"Instalar"** quando solicitado

### **Manual**

**Chrome/Edge:**
1. Clique no ícone de instalação na barra de endereços
2. Confirme "Instalar UTI.AI"

**Firefox:**
1. Menu → "Instalar esta página como app"

**Safari (iOS):**
1. Botão "Compartilhar" → "Adicionar à Tela Inicial"

**Android:**
1. Menu → "Adicionar à tela inicial"

## 🔧 Configuração da IA (Opcional)

Para usar a análise de IA especializada:

1. **Obter chave API** do Google Gemini
2. **Configurar variável**: `API_KEY` no ambiente
3. **Alternativa**: Inserir diretamente no código (desenvolvimento)

```javascript
// Em IaIntensivistaTab.tsx, linha 84:
const ai = new GoogleGenAI({ apiKey: 'SUA_CHAVE_AQUI' });
```

## 🌐 Funcionalidades Offline

**Disponível sem internet:**
- ✅ Dashboard completo
- ✅ Calculadoras de scores
- ✅ Protocolos SMART-SED
- ✅ Análise ventilatória
- ✅ Balanço hídrico
- ✅ Planos terapêuticos

**Requer internet:**
- 🤖 Análise de IA especializada
- 🔄 Sincronização entre dispositivos

## 📊 Primeiro Uso

### **1. Dados de Exemplo**
O app vem com 2 pacientes de exemplo:
- **Leito 08**: João Silva (Choque Séptico)
- **Leito 12**: Maria Costa (Pós-CRM)

### **2. Navegação**
1. **Sidebar esquerda**: Lista de pacientes
2. **Área principal**: Dados do paciente selecionado
3. **Tabs horizontais**: Diferentes aspectos do cuidado
4. **Nova aba "Sedação"**: Protocolos SMART-SED

### **3. Funcionalidades por Tab**

- **📄 Resumo**: História e problemas
- **🏥 Sistemas**: Avaliação por aparelhos  
- **🫁 VM**: Ventilação mecânica
- **📊 Scores**: Calculadoras clínicas
- **💧 Balanço**: Controle hídrico
- **📋 Plano**: Conduta terapêutica
- **🧠 Sedação**: RASS/CPOT e medicamentos (NOVO)
- **🤖 IA**: Parecer especializado

## 🎯 Uso da Nova Aba "Sedação"

### **Protocolo Analgesia-First**

1. **Avalie CPOT primeiro**:
   - Expressão facial (0-2)
   - Movimentos corporais (0-2)
   - Tensão muscular (0-2)
   - Ventilador (0-2)

2. **Interpretação**:
   - **≤ 2**: Analgesia adequada → Avaliar RASS
   - **> 2**: Dor presente → Otimizar analgesia

3. **Avalie RASS** (se CPOT ≤ 2):
   - Escala de -5 a +4
   - Meta: -1 a 0 (sonolento mas despertável)

4. **Ajuste Medicamentos**:
   - Doses calculadas automaticamente
   - Alertas de segurança integrados
   - Monitorização de limites

### **Calculadora de Doses**

- **Automática**: Infusão calculada baseada em peso
- **Alertas**: Doses perigosas destacadas
- **Protocolos**: Limites seguros por medicamento
- **Monitorização**: Parâmetros a acompanhar

## 🔐 Segurança dos Dados

- **Local**: Dados salvos no navegador (localStorage)
- **Privacidade**: Nenhum dado enviado para servidores
- **Backup**: Exportação manual disponível
- **LGPD**: Totalmente compliant (dados locais)

## 🛠️ Solução de Problemas

### **App não carrega**
- Verificar se JavaScript está habilitado
- Tentar em navegador diferente
- Limpar cache do navegador

### **PWA não instala**
- Usar HTTPS ou localhost
- Verificar se Service Worker está funcionando
- Tentar em navegador compatível

### **Dados perdidos**
- Verificar se localStorage não foi limpo
- Os dados ficam salvos por dispositivo/navegador
- Para compartilhar entre dispositivos: exportar/importar

### **IA não funciona**
- Verificar chave API do Gemini
- Confirmar conexão com internet
- Funcionalidades offline continuam disponíveis

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar este guia de instalação
2. Consultar documentação técnica no README.md
3. Verificar console do navegador para erros
4. Testar em modo incógnito/privado

---

**Sistema pronto para uso em ambiente clínico! 🏥**
