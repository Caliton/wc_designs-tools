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
            <button 
              @click="goToStep(1)"
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-110',
                currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              ]"
            >
              1
            </button>
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
            <button 
              @click="goToStep(2)"
              :disabled="files.length === 0"
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-110',
                currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300',
                files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              2
            </button>
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
            <button 
              @click="goToStep(3)"
              :disabled="!processedFile"
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-110',
                currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300',
                !processedFile ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              3
            </button>
            <span :class="[
              'ml-2 text-sm font-medium transition-colors duration-300',
              currentStep >= 3 ? 'text-emerald-600' : 'text-gray-500'
            ]">Download</span>
          </div>
        </div>
      </div>

      <!-- Carousel Container -->
      <div class="relative overflow-hidden bg-white rounded-2xl shadow-lg">
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${(currentStep - 1) * 100}%)` }"
        >

          <!-- Step 1: Upload Area -->
          <div class="w-full flex-shrink-0 p-8">
            <div class="text-center mb-8">
              <Upload class="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Selecione os arquivos .meta</h2>
              <p class="text-gray-600">Arraste e solte ou clique para selecionar múltiplos arquivos .meta</p>
            </div>
        
            <div 
              @drop="handleDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-400 transition-colors duration-300 cursor-pointer"
              @click="$refs.fileInput.click()"
            >
              <div class="space-y-4">
                <div class="text-gray-500">
                  <FileText class="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p class="text-lg font-medium">Arraste arquivos .meta aqui</p>
                  <p class="text-sm">ou clique para selecionar</p>
                </div>
              </div>
            </div>

            <input
              ref="fileInput"
              type="file"
              multiple
              accept=".meta"
              @change="handleFileSelect"
              class="hidden"
            />

            <!-- File List -->
            <div v-if="files.length > 0" class="mt-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Arquivos selecionados ({{ files.length }})</h3>
              <div class="space-y-3 max-h-64 overflow-y-auto">
                <div 
                  v-for="(file, index) in files" 
                  :key="index"
                  class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div class="flex items-center space-x-3">
                    <FileText class="w-5 h-5 text-emerald-600" />
                    <span class="text-sm font-medium text-gray-900">{{ file.name }}</span>
                    <span class="text-xs text-gray-500">({{ formatFileSize(file.size) }})</span>
                  </div>
                  <button 
                    @click="removeFile(index)"
                    class="text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <X class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div class="mt-6 flex justify-between">
                <button
                  @click="clearFiles"
                  class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  <X class="w-4 h-4 mr-2" />
                  Limpar Tudo
                </button>
                <button
                  @click="goToStep(2)"
                  class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
                >
                  Próximo
                  <ChevronRight class="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          <!-- Step 2: Processing Section -->
          <div class="w-full flex-shrink-0 p-8">
            <div class="text-center mb-8">
              <Settings class="w-12 h-12 text-emerald-600 mx-auto mb-4" :class="{ 'animate-spin': isProcessing }" />
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Processamento</h2>
              <p class="text-gray-600">Unificando arquivos .meta em um único XML</p>
            </div>
        
            <div class="space-y-6">
              <!-- Files Summary -->
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumo dos Arquivos</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="text-center">
                    <div class="text-2xl font-bold text-emerald-600">{{ files.length }}</div>
                    <div class="text-sm text-gray-600">Arquivos .meta</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">{{ totalSize }}</div>
                    <div class="text-sm text-gray-600">Tamanho Total</div>
                  </div>
                  <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">1</div>
                    <div class="text-sm text-gray-600">Arquivo XML Final</div>
                  </div>
                </div>
              </div>

              <!-- Processing Status -->
              <div v-if="isProcessing" class="space-y-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span class="text-blue-800 font-medium">Processando arquivos...</span>
                  </div>
                  <div class="mt-3 bg-blue-200 rounded-full h-2">
                    <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
                  </div>
                  <p class="text-sm text-blue-600 mt-2">{{ progress }}% concluído</p>
                </div>
              </div>

              <div v-else-if="processedFile" class="space-y-4">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div class="flex items-center space-x-3">
                    <CheckCircle class="w-5 h-5 text-green-600" />
                    <span class="text-green-800 font-medium">Processamento concluído!</span>
                  </div>
                  <p class="text-sm text-green-600 mt-2">{{ files.length }} arquivos foram unificados com sucesso</p>
                </div>
              </div>

              <div v-else>
                <div class="text-center py-8">
                  <button
                    @click="processFiles"
                    :disabled="files.length === 0"
                    class="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    <Zap class="w-6 h-6 mr-3" />
                    Iniciar Processamento
                  </button>
                </div>
              </div>

              <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center space-x-3">
                  <AlertCircle class="w-5 h-5 text-red-600" />
                  <span class="text-red-800 font-medium">Erro no processamento</span>
                </div>
                <p class="text-sm text-red-600 mt-2">{{ error }}</p>
              </div>

              <!-- Navigation -->
              <div class="flex justify-between pt-6">
                <button
                  @click="goToStep(1)"
                  class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300"
                >
                  <ChevronLeft class="w-4 h-4 mr-2" />
                  Voltar
                </button>
                <button
                  @click="goToStep(3)"
                  :disabled="!processedFile"
                  class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  Próximo
                  <ChevronRight class="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3: Download Section -->
          <div class="w-full flex-shrink-0 p-8">
            <div class="text-center mb-8">
              <Download class="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Download</h2>
              <p class="text-gray-600">Seu arquivo XML unificado está pronto para download</p>
            </div>
        
            <div v-if="processedFile" class="space-y-6">
              <!-- Success Message -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                <div class="flex items-center justify-center space-x-3 mb-4">
                  <CheckCircle class="w-8 h-8 text-green-600" />
                  <span class="text-xl font-semibold text-green-900">Processamento Concluído!</span>
                </div>
                <p class="text-center text-green-700">Todos os arquivos .meta foram unificados com sucesso</p>
              </div>

              <!-- File Info -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="bg-emerald-100 p-3 rounded-lg">
                      <FileText class="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-900">vehicles_unified.xml</h3>
                      <p class="text-sm text-gray-600">Arquivo XML unificado</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-emerald-600">{{ files.length }}</div>
                    <div class="text-sm text-gray-600">veículos processados</div>
                  </div>
                </div>
              </div>
        
              <!-- Download Actions -->
              <div class="text-center space-y-4">
                <button
                  @click="downloadFile"
                  class="inline-flex items-center px-8 py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Download class="w-6 h-6 mr-3" />
                  Baixar Arquivo XML
                </button>
                
                <div class="flex justify-center space-x-4">
                  <button
                    @click="goToStep(2)"
                    class="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    <ChevronLeft class="w-4 h-4 mr-2" />
                    Voltar
                  </button>
                  <button
                    @click="resetProcess"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    <RotateCcw class="w-4 h-4 mr-2" />
                    Novo Processamento
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <FileText class="w-16 h-16 mx-auto opacity-50" />
              </div>
              <h3 class="text-lg font-medium text-gray-500 mb-2">Nenhum arquivo processado</h3>
              <p class="text-gray-400 mb-6">Complete as etapas anteriores para gerar o arquivo XML</p>
              <button
                @click="goToStep(1)"
                class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-300"
              >
                <ChevronLeft class="w-5 h-5 mr-2" />
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  Upload, FileText, X, Settings, Zap, Loader2, 
  Trash2, Download, CheckCircle, ChevronLeft,
  ChevronRight, RotateCcw, AlertCircle 
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
const error = ref('')

// Computed property for total file size
const totalSize = computed(() => {
  const total = files.value.reduce((sum, file) => sum + file.size, 0)
  return formatFileSize(total)
})

// Carousel navigation functions
const goToStep = (step: number) => {
  if (step >= 1 && step <= 3) {
    currentStep.value = step
  }
}

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
  error.value = ''
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