<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          Ajuda - Unificador XML
        </h1>
        <p class="text-lg text-gray-600">
          Guia completo para usar o sistema de unificação de arquivos XML
        </p>
      </div>

      <!-- Quick Start -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Zap class="w-6 h-6 mr-2 text-emerald-600" />
          Início Rápido
        </h2>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                <span class="text-emerald-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Upload dos Arquivos</h3>
                <p class="text-gray-600 text-sm">
                  Selecione ou arraste múltiplos arquivos .meta para a área de upload
                </p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                <span class="text-emerald-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Processamento</h3>
                <p class="text-gray-600 text-sm">
                  Clique em "Unificar Arquivos" e acompanhe o progresso
                </p>
              </div>
            </div>
            
            <div class="flex items-start">
              <div class="bg-emerald-100 rounded-full p-2 mr-4 mt-1">
                <span class="text-emerald-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 class="font-medium text-gray-900">Download</h3>
                <p class="text-gray-600 text-sm">
                  Baixe o arquivo unificado quando o processamento terminar
                </p>
              </div>
            </div>
          </div>
          
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="font-medium text-green-900 mb-2 flex items-center">
              <CheckCircle class="w-5 h-5 mr-2" />
              Dica Importante
            </h3>
            <p class="text-green-700 text-sm">
              É necessário pelo menos 2 arquivos .meta para realizar a unificação. 
              O sistema irá combinar todos os dados de veículos em um único arquivo.
            </p>
          </div>
        </div>
      </div>

      <!-- File Format -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <FileText class="w-6 h-6 mr-2 text-slate-600" />
          Formato de Arquivos
        </h2>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Arquivos Suportados</h3>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="bg-slate-50 rounded-lg p-4">
                <h4 class="font-medium text-slate-900 mb-2">.meta</h4>
                <p class="text-slate-700 text-sm">
                  Arquivos de metadados de veículos do GTA V
                </p>
              </div>
              <div class="bg-slate-50 rounded-lg p-4">
                <h4 class="font-medium text-slate-900 mb-2">.xml</h4>
                <p class="text-slate-700 text-sm">
                  Arquivos XML com estrutura compatível
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">Estrutura Esperada</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <pre class="text-sm text-gray-700 overflow-x-auto"><code>&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;CVehicleModelInfo__InitDataList&gt;
  &lt;InitDatas&gt;
    &lt;Item&gt;
      &lt;!-- Dados do veículo --&gt;
    &lt;/Item&gt;
  &lt;/InitDatas&gt;
  &lt;txdRelationships&gt;
    &lt;Item&gt;
      &lt;!-- Relacionamentos de texturas --&gt;
    &lt;/Item&gt;
  &lt;/txdRelationships&gt;
&lt;/CVehicleModelInfo__InitDataList&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- How it Works -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Settings class="w-6 h-6 mr-2 text-slate-600" />
          Como Funciona
        </h2>
        
        <div class="space-y-6">
          <div class="flex items-start">
            <div class="bg-emerald-100 rounded-lg p-3 mr-4">
              <FileText class="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">1. Conversão XML → JSON</h3>
              <p class="text-gray-600">
                Cada arquivo XML é convertido para formato JSON para facilitar a manipulação dos dados.
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="bg-emerald-100 rounded-lg p-3 mr-4">
              <Shuffle class="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">2. Unificação de Dados</h3>
              <p class="text-gray-600">
                Os dados de InitDatas e txdRelationships de todos os arquivos são combinados em uma única estrutura.
              </p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="bg-emerald-100 rounded-lg p-3 mr-4">
              <Download class="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 class="font-medium text-gray-900 mb-2">3. Conversão JSON → XML</h3>
              <p class="text-gray-600">
                O resultado unificado é convertido de volta para XML e disponibilizado para download.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <HelpCircle class="w-6 h-6 mr-2 text-slate-600" />
          Perguntas Frequentes
        </h2>
        
        <div class="space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="border border-gray-200 rounded-lg"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <span class="font-medium text-gray-900">{{ faq.question }}</span>
              <ChevronDown 
                :class="[
                  'w-5 h-5 text-gray-500 transition-transform',
                  openFaqs.includes(index) ? 'rotate-180' : ''
                ]"
              />
            </button>
            <div 
              v-if="openFaqs.includes(index)"
              class="px-4 pb-4 text-gray-600"
            >
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>

      <!-- Support -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <MessageCircle class="w-6 h-6 mr-2 text-slate-600" />
          Suporte
        </h2>
        
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start">
            <AlertTriangle class="w-6 h-6 text-red-600 mr-3 mt-1" />
            <div>
              <h3 class="font-medium text-red-900 mb-2">Problemas Comuns</h3>
              <ul class="text-red-700 text-sm space-y-1">
                <li>• Verifique se os arquivos têm a extensão .meta ou .xml</li>
                <li>• Certifique-se de que os arquivos seguem a estrutura XML esperada</li>
                <li>• É necessário pelo menos 2 arquivos para unificar</li>
                <li>• Arquivos muito grandes podem demorar mais para processar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Zap, CheckCircle, FileText, Settings, Shuffle, Download,
  HelpCircle, ChevronDown, MessageCircle, AlertTriangle
} from 'lucide-vue-next'

const openFaqs = ref<number[]>([])

const faqs = [
  {
    question: 'Quantos arquivos posso unificar de uma vez?',
    answer: 'Não há limite específico, mas recomendamos não exceder 50 arquivos por vez para melhor performance.'
  },
  {
    question: 'O que acontece se um arquivo estiver corrompido?',
    answer: 'O sistema irá detectar arquivos corrompidos e exibir uma mensagem de erro específica, permitindo que você remova o arquivo problemático.'
  },
  {
    question: 'Posso usar arquivos de diferentes versões do GTA V?',
    answer: 'Sim, desde que sigam a mesma estrutura XML básica. O sistema é compatível com diferentes versões.'
  },
  {
    question: 'O arquivo unificado substitui os originais?',
    answer: 'Não, o sistema apenas gera um novo arquivo unificado. Seus arquivos originais permanecem inalterados.'
  },
  {
    question: 'Há algum limite de tamanho para os arquivos?',
    answer: 'O limite depende da memória disponível do seu navegador. Arquivos muito grandes (>100MB) podem causar lentidão.'
  }
]

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}
</script>