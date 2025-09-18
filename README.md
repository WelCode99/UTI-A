# UTI.AI - Sistema Inteligente de Cuidados Intensivos

## 📋 Descrição

O **UTI.AI** é um sistema integrado e abrangente para o manejo completo do paciente crítico em Unidade de Terapia Intensiva. Combina as funcionalidades avançadas do **ICU-AI Dashboard** com os protocolos especializados do **SMART-SED UTI**, oferecendo uma plataforma unificada para cuidados intensivos.

## ✨ Funcionalidades Principais

### 🏥 **Dashboard Avançado**
- **Gerenciamento Multi-paciente**: Sistema de abas com múltiplos pacientes
- **Interface Intuitiva**: Design moderno e responsivo com tema escuro
- **Auto-save**: Salvamento automático de dados no localStorage
- **Navegação por Tabs**: Organização por sistemas e protocolos

### 📊 **Calculadoras Médicas**
- **SOFA Score**: Avaliação de disfunção orgânica
- **Glasgow Coma Scale**: Avaliação neurológica
- **qSOFA & CURB-65**: Scores de gravidade
- **MEWS & NUTRIC**: Escalas complementares
- **Charlson**: Índice de comorbidades

### 🫁 **Análise Ventilatória**
- **Calculadoras Automáticas**: IBW, P/F, Driving Pressure
- **Parâmetros VM**: Monitorização completa
- **Complacência & Resistência**: Análise mecânica
- **Índice de Oxigenação**: Avaliação de ARDS

### 🧠 **Protocolos SMART-SED** (Nova Funcionalidade)
- **Escala CPOT**: Avaliação de dor (Analgesia-First)
- **Escala RASS**: Avaliação de sedação (-5 a +4)
- **Calculadora de Doses**: Fentanil, Propofol, Dexmedetomidina, Midazolam
- **Alertas de Segurança**: Monitorização de limites e interações
- **Protocolos Baseados em Evidência**: Guias automáticos

### 🤖 **IA Especializada**
- **Análise Integrada**: Parecer de IA intensivista
- **Correlação de Dados**: Análise holística do paciente
- **Recomendações**: Condutas baseadas em evidências
- **Interpretação**: Scores e parâmetros automatizados

### 💧 **Balanço Hídrico**
- **Cálculo Automático**: Entradas vs saídas
- **Balanço Acumulado**: Monitorização temporal
- **Alertas**: Sobrecarga ou desidratação

### 🌐 **Recursos PWA**
- **Funcionamento Offline**: Cache inteligente
- **Instalação**: App nativo multiplataforma
- **Service Worker**: Sincronização automática
- **Notificações**: Alertas de avaliação

## 🏗️ Estrutura do Sistema

```
UTI.AI-UNIFIED/
├── 📱 App.tsx                  # Aplicação principal
├── 📊 types.ts                 # Interfaces TypeScript unificadas
├── 🎯 constants.ts             # Dados padrão e configurações
├── 🔧 components/
│   ├── 📋 Sidebar.tsx          # Lista de pacientes
│   ├── 📺 MainContent.tsx      # Área principal com tabs
│   ├── 🛠️ FormControls.tsx     # Controles de formulário
│   ├── 📑 ScoreCard.tsx        # Cards de pontuação
│   ├── 💬 PatientModal.tsx     # Modal de edição
│   ├── 🌐 OfflineIndicator.tsx # Indicadores PWA
│   └── 📁 tabs/
│       ├── 📄 ResumoTab.tsx    # Resumo do paciente
│       ├── 🏥 SistemasTab.tsx  # Análise por sistemas
│       ├── 🫁 VmTab.tsx        # Ventilação mecânica
│       ├── 📊 ScoresTab.tsx    # Scores clínicos
│       ├── 💧 BalancoTab.tsx   # Balanço hídrico
│       ├── 📋 PlanoTab.tsx     # Plano terapêutico
│       ├── 🧠 SedacaoTab.tsx   # SMART-SED (NOVA)
│       └── 🤖 IaIntensivistaTab.tsx # IA especializada
├── 🌐 PWA Files/
│   ├── manifest.json          # Configuração PWA
│   ├── sw.js                  # Service Worker
│   ├── offline.html           # Página offline
│   └── 🖼️ icons/              # Ícones do app
└── 📄 index.html              # Página principal
```

## 🎯 Fluxo de Uso

### 1. **Gestão de Pacientes**
1. Adicionar novo paciente na sidebar
2. Preencher dados básicos no modal
3. Navegar pelas abas para dados específicos

### 2. **Protocolo SMART-SED** (Analgesia-First)
1. **Aba "Sedação"** → Avaliar CPOT primeiro
2. **Se CPOT ≤ 2**: Proceder com RASS
3. **Se CPOT > 2**: Otimizar analgesia antes
4. **Ajustar medicamentos** conforme protocolos
5. **Monitorizar alertas** de segurança

### 3. **Análise Completa**
1. **Resumo**: História e problemas
2. **Sistemas**: Avaliação por aparelhos
3. **VM**: Parâmetros ventilatórios
4. **Scores**: Gravidade e prognóstico
5. **Balanço**: Controle hídrico
6. **Sedação**: Protocolos SMART-SED
7. **Plano**: Conduta terapêutica
8. **IA**: Parecer especializado

## 🔧 Tecnologias Utilizadas

- **React 19** + **TypeScript**: Interface moderna e type-safe
- **Tailwind CSS**: Estilização utilitária e responsiva
- **Google Gemini AI**: Inteligência artificial especializada
- **Service Worker**: Funcionalidades PWA e offline
- **LocalStorage**: Persistência de dados local

## 🚀 Funcionalidades Técnicas

### **Progressive Web App (PWA)**
- ✅ **Instalação**: App nativo em dispositivos
- ✅ **Offline-First**: Funciona sem internet
- ✅ **Auto-sync**: Sincronização automática
- ✅ **Push Notifications**: Alertas de avaliação

### **Integração Inteligente**
- ✅ **Unificação**: Duas bases de código em uma
- ✅ **Compatibilidade**: Mantém dados existentes
- ✅ **Escalabilidade**: Arquitetura modular
- ✅ **Performance**: Cache inteligente

### **Segurança Médica**
- ✅ **Validação**: Limites terapêuticos
- ✅ **Alertas**: Dosagens perigosas
- ✅ **Protocolos**: Baseados em evidência
- ✅ **Auditoria**: Histórico de alterações

## 📱 Como Usar

### **1. Acesso Web**
- Abra no navegador: `index.html`
- Interface completa disponível imediatamente
- Dados salvos automaticamente

### **2. Instalação PWA**
- **Desktop**: Ícone de instalação no navegador
- **Mobile**: Prompt automático após uso
- **Benefícios**: Acesso rápido, offline, notificações

### **3. Funcionalidades Offline**
- ✅ Dashboard completo funcional
- ✅ Todas as calculadoras disponíveis
- ✅ Protocolos SMART-SED ativos
- ✅ Dados salvos localmente
- ✅ Sincronização automática ao reconectar

## 🎨 Interface Unificada

### **Design Consistente**
- **Tema Escuro**: Reduz fadiga visual em ambiente hospitalar
- **Cores Médicas**: Sistema de cores intuitivo (verde=normal, amarelo=atenção, vermelho=crítico)
- **Responsividade**: Funciona em tablet, desktop e mobile
- **Acessibilidade**: Contraste adequado e navegação por teclado

### **Navegação Intuitiva**
- **Sidebar**: Lista de pacientes com status visual
- **Tabs Horizontais**: Acesso rápido às funcionalidades
- **Modal de Edição**: Dados básicos centralizados
- **Auto-save**: Salvamento contínuo sem perda de dados

## 🔒 Segurança e Conformidade

- **Dados Local**: Nenhum dado sensível enviado externamente (exceto IA quando solicitado)
- **Cache Seguro**: Service Worker com estratégias otimizadas
- **Validação**: Entrada de dados validada em tempo real
- **Backup**: Dados preservados no localStorage do navegador

## 📊 Métricas e Monitorização

### **Alertas Automáticos**
- 🚨 **CPOT > 4**: Dor significativa
- ⚠️ **RASS > +2**: Agitação grave
- 💊 **Propofol > 4mg/kg/h**: Risco de PRIS
- ⏰ **Avaliações Vencidas**: Timeline automático

### **Status de Qualidade**
- 🎯 **Metas RASS/CPOT**: Indicadores visuais
- 📈 **Tendências**: Evolução temporal
- 🔍 **Análise Integrada**: Correlação entre sistemas
- 📋 **Protocolos**: Aderência automática

## 🚀 Próximos Passos

1. **Testar integração** completa
2. **Validar** funcionalidades PWA
3. **Otimizar** performance
4. **Documentar** casos de uso
5. **Implementar** melhorias baseadas no feedback

---

**Sistema desenvolvido para profissionais de saúde especializados em terapia intensiva.**  
*Versão Unificada - Setembro 2025*
