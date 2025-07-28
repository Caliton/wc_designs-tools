<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6">
          <Zap class="w-8 h-8 text-emerald-600" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Unificador XML
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Unifique múltiplos arquivos .meta de veículos em um único arquivo XML
        </p>
      </div>

      <!-- Progress Steps -->
      <div class="flex justify-center mb-12">
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
              currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
            ]">
              1
            </div>
            <span :class="[
              'ml-2 text-sm font-medium transition-colors duration-300',
              currentStep >= 1 ? 'text-emerald-600' : 'text-gray-500'
            ]">Upload</span>
          </div>
          <div :class="[
            'w-12 h-0.5 transition-all duration-300',
            currentStep >= 2 ? 'bg-emerald-600' : 'bg-gray-200'
          ]"></div>
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
              currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
            ]">
              2
            </div>
            <span :class="[
              'ml-2 text-sm font-medium transition-colors duration-300',
              currentStep >= 2 ? 'text-emerald-600' : 'text-gray-500'
            ]">Processar</span>
          </div>
          <div :class="[
            'w-12 h-0.5 transition-all duration-300',
            currentStep >= 3 ? 'bg-emerald-600' : 'bg-gray-200'
          ]"></div>
          <div class="flex items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
              currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
            ]">
              3
            </div>
            <span :class="[
              'ml-2 text-sm font-medium transition-colors duration-300',
              currentStep >= 3 ? 'text-emerald-600' : 'text-gray-500'
            ]">Download</span>
          </div>
        </div>
      </div>

      <!-- Upload Area -->
      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
              <Upload class="w-5 h-5 text-emerald-600" />
            </div>
            Upload de Arquivos
          </h2>
          <div class="text-gray-500 text-sm">
            Passo 1 de 3
          </div>
        </div>
        
        <!-- Drag & Drop Zone -->
        <div 
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          :class="[
            'border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300',
            isDragging ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
          ]"
          @dragenter="isDragging = true"
          @dragleave="isDragging = false"
        >
          <div class="flex flex-col items-center">
            <div :class="[
              'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300',
              isDragging ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
            ]">
              <FileText class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ isDragging ? 'Solte os arquivos aqui!' : 'Arraste arquivos .meta aqui' }}
            </h3>
            <p class="text-gray-600 mb-8">
              ou clique para selecionar arquivos
            </p>
            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".meta,.xml"
              @change="handleFileSelect"
              class="hidden"
            />
            <button
              @click="fileInput?.click()"
              class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center"
            >
              <Upload class="w-4 h-4 mr-2" />
              Selecionar Arquivos
            </button>
          </div>
        </div>

        <!-- File List -->
        <div v-if="files.length > 0" class="mt-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900 flex items-center">
              <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                <span class="text-emerald-600 font-semibold text-sm">{{ files.length }}</span>
              </div>
              Arquivos Selecionados
            </h3>
            <button
              @click="clearFiles"
              class="text-gray-500 hover:text-red-600 transition-colors duration-200 flex items-center text-sm"
            >
              <Trash2 class="w-4 h-4 mr-1" />
              Limpar Todos
            </button>
          </div>
          <div class="grid gap-3">
            <div 
              v-for="(file, index) in files" 
              :key="index"
              class="group bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:bg-gray-100 hover:border-emerald-300"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center flex-1">
                  <div class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText class="w-5 h-5 text-emerald-600" />
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">{{ file.name }}</div>
                    <div class="text-gray-500 text-sm flex items-center mt-1">
                      <span class="bg-gray-200 px-2 py-1 rounded text-xs mr-2">{{ formatFileSize(file.size) }}</span>
                      <span class="text-emerald-600 text-xs">✓ Válido</span>
                    </div>
                  </div>
                </div>
                <button
                  @click="removeFile(index)"
                  class="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Processing Section -->
      <div v-if="files.length > 0" class="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8 transition-all duration-300">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-semibold text-gray-900 flex items-center">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
              <Settings class="w-5 h-5 text-emerald-600" />
            </div>
            Processamento
          </h2>
          <div class="text-gray-500 text-sm">
            Passo 2 de 3
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <button
            @click="processFiles"
            :disabled="isProcessing || files.length < 2"
            class="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
          >
            <template v-if="isProcessing">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando...
            </template>
            <template v-else>
              <Zap class="w-4 h-4 mr-2" />
              Unificar Arquivos
            </template>
          </button>
          
          <div class="bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
            <div class="text-center">
              <div class="text-2xl font-bold text-white mb-2">{{ files.length }}</div>
              <div class="text-slate-400 text-sm">Arquivos Carregados</div>
              <div class="mt-4 text-xs text-slate-500">
                {{ files.length >= 2 ? '✓ Pronto para unificar' : 'Mínimo 2 arquivos necessários' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="isProcessing" class="mb-8">
          <div class="bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
            <div class="flex justify-between items-center mb-4">
              <span class="text-white font-bold text-lg">Progresso da Unificação</span>
              <span class="text-cyan-400 font-bold text-xl">{{ progress }}%</span>
            </div>
            <div class="relative w-full bg-slate-600 rounded-full h-4 overflow-hidden">
              <div 
                class="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                :style="{ width: progress + '%' }"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <div class="mt-2 text-slate-400 text-sm text-center">
              Processando arquivos XML...
            </div>
          </div>
        </div>

        <!-- Processing Logs -->
        <div v-if="logs.length > 0" class="bg-slate-700/30 backdrop-blur-sm border border-slate-600 rounded-2xl p-6">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <Settings class="w-4 h-4 text-white" />
            </div>
            <h4 class="font-bold text-white text-lg">Logs de Processamento</h4>
          </div>
          <div class="bg-slate-900/50 rounded-xl p-4 max-h-40 overflow-y-auto custom-scrollbar">
            <div class="space-y-2">
              <div 
                v-for="(log, index) in logs" 
                :key="index"
                class="text-sm text-slate-300 font-mono flex items-center animate-fade-in"
              >
                <span class="text-cyan-400 mr-2">▶</span>
                {{ log }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Download Section -->
      <div v-if="processedFile" class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-8 transition-all duration-300">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-white flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4">
              <Download class="w-6 h-6 text-white" />
            </div>
            Download Concluído
          </h2>
          <div class="text-slate-400 text-sm">
            Passo 3 de 3
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6 mb-8">
          <div class="flex items-center">
            <div class="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mr-6">
              <CheckCircle class="w-8 h-8 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-white mb-2">
                🎉 Arquivo unificado criado com sucesso!
              </h3>
              <div class="flex items-center space-x-4 text-emerald-400">
                <span class="bg-emerald-500/20 px-3 py-1 rounded-lg font-mono text-sm">{{ processedFile.name }}</span>
                <span class="bg-slate-700 px-3 py-1 rounded-lg text-sm">{{ formatFileSize(processedFile.size) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            @click="downloadFile"
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
          >
            <Download class="w-4 h-4 mr-2" />
            Baixar Arquivo Unificado
          </button>
          
          <button
            @click="resetProcess"
            class="bg-slate-700/50 hover:bg-slate-600 border border-slate-600 hover:border-slate-500 text-white px-8 py-6 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
          >
            <Zap class="w-6 h-6 mr-3" />
            Novo Processamento
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { 
  Upload, FileText, X, Settings, Zap, Loader2, 
  Trash2, Download, CheckCircle 
} from 'lucide-vue-next'
import { useXmlProcessor } from '@/composables/useXmlProcessor'

const files = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const isProcessing = ref(false)
const progress = ref(0)
const logs = ref<string[]>([])
const processedFile = ref<{ name: string; content: string; size: number } | null>(null)
const currentStep = ref(1)

const { processXmlFiles } = useXmlProcessor()

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const droppedFiles = Array.from(e.dataTransfer?.files || [])
  addFiles(droppedFiles)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const selectedFiles = Array.from(target.files || [])
  addFiles(selectedFiles)
}

const addFiles = (newFiles: File[]) => {
  const validFiles = newFiles.filter(file => 
    file.name.endsWith('.meta') || file.name.endsWith('.xml')
  )
  
  if (validFiles.length !== newFiles.length) {
    addLog('Alguns arquivos foram ignorados (apenas .meta e .xml são aceitos)')
  }
  
  files.value.push(...validFiles)
  addLog(`${validFiles.length} arquivo(s) adicionado(s)`)
  
  // Atualizar step
  if (files.value.length > 0) {
    currentStep.value = Math.max(currentStep.value, 1)
  }
}

const removeFile = (index: number) => {
  const fileName = files.value[index].name
  files.value.splice(index, 1)
  addLog(`Arquivo removido: ${fileName}`)
}

const clearFiles = () => {
  files.value = []
  logs.value = []
  processedFile.value = null
  progress.value = 0
  currentStep.value = 1
  addLog('Arquivos limpos')
}

const resetProcess = () => {
  files.value = []
  logs.value = []
  processedFile.value = null
  progress.value = 0
  currentStep.value = 1
  isProcessing.value = false
  addLog('Processo reiniciado - Pronto para novos arquivos')
}

const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push(`[${timestamp}] ${message}`)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const processFiles = async () => {
  if (files.value.length < 2) {
    addLog('É necessário pelo menos 2 arquivos para unificar')
    return
  }
  
  isProcessing.value = true
  progress.value = 0
  currentStep.value = 2
  addLog('🚀 Iniciando processamento...')
  
  try {
    const result = await processXmlFiles(files.value, (progressValue, message) => {
      progress.value = progressValue
      if (message) addLog(message)
    })
    
    processedFile.value = {
      name: 'arquivo_unificado.meta',
      content: result,
      size: new Blob([result]).size
    }
    
    currentStep.value = 3
    addLog('✅ Processamento concluído com sucesso!')
  } catch (error) {
    addLog(`❌ Erro no processamento: ${error}`)
    currentStep.value = 1
  } finally {
    isProcessing.value = false
  }
}

const downloadFile = () => {
  if (!processedFile.value) return
  
  const blob = new Blob([processedFile.value.content], { type: 'application/xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = processedFile.value.name
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  addLog('📥 Download iniciado')
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #475569 #1e293b;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #1e293b;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>