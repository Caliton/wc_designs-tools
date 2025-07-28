<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          <Car class="inline-block w-8 h-8 mr-3 text-emerald-600" />
          Gerenciador de Veículos
        </h1>
        <p class="text-gray-600 text-lg">
          Visualize, organize e edite os veículos dos seus arquivos XML
        </p>
      </div>

      <!-- Upload Area -->
      <div v-if="!vehicles.length" class="mb-8">
        <div
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-emerald-400 transition-colors duration-300 bg-white"
        >
          <Upload class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Arraste seu arquivo XML aqui</h3>
          <p class="text-gray-600 mb-4">ou clique para selecionar</p>
          <input
            ref="fileInput"
            type="file"
            accept=".xml,.meta"
            @change="handleFileSelect"
            class="hidden"
          />
          <button
            @click="fileInput?.click()"
            class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Selecionar Arquivo
          </button>
        </div>
      </div>

      <!-- Vehicle Stats -->
      <div v-if="vehicles.length" class="mb-6">
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-8">
              <div class="text-center">
                <div class="text-2xl font-bold text-emerald-600">{{ vehicles.length }}</div>
                <div class="text-sm text-gray-600">Veículos</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">{{ uniqueTypes.length }}</div>
                <div class="text-sm text-gray-600">Tipos</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">{{ uniqueClasses.length }}</div>
                <div class="text-sm text-gray-600">Classes</div>
              </div>
            </div>
            
            <div class="flex space-x-3">
              <button
                @click="resetManager"
                class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <RotateCcw class="w-4 h-4" />
                <span>Novo Arquivo</span>
              </button>
              
              <button
                @click="downloadModifiedXml"
                :disabled="!hasChanges"
                class="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <Download class="w-4 h-4" />
                <span>Baixar XML</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vehicle Grid -->
      <div v-if="vehicles.length" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900">Lista de Veículos</h2>
          <div class="text-sm text-gray-600">
            Arraste os cards para reordenar
          </div>
        </div>
        
        <draggable
          v-model="vehicles"
          item-key="modelName"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          :animation="200"
          ghost-class="opacity-50"
          @change="markAsChanged"
        >
          <template #item="{ element }">
            <VehicleCard
              :vehicle="element"
              @delete="deleteVehicle"
            />
          </template>
        </draggable>
      </div>

      <!-- Empty State -->
      <div v-if="vehicles.length === 0 && hasProcessedFile" class="text-center py-12">
        <AlertCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum veículo encontrado</h3>
        <p class="text-gray-600">O arquivo XML não contém dados de veículos válidos.</p>
      </div>

      <!-- Loading State -->
      <div v-if="isProcessing" class="text-center py-12">
        <div class="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-gray-900">Processando arquivo...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import draggable from 'vuedraggable'
import { Car, Upload, Download, RotateCcw, AlertCircle } from 'lucide-vue-next'
import VehicleCard from '../components/VehicleCard.vue'
import { useXmlProcessor } from '../composables/useXmlProcessor'

interface Vehicle {
  modelName: string
  gameName: string
  vehicleMakeName: string
  handlingId: string
  type: string
  vehicleClass: string
  txdName: string
  [key: string]: any
}

const vehicles = ref<Vehicle[]>([])
const isProcessing = ref(false)
const hasProcessedFile = ref(false)
const hasChanges = ref(false)
const originalXmlData = ref<any>(null)
const fileInput = ref<HTMLInputElement>()

const { parseXmlString, buildXmlFromJson } = useXmlProcessor()

const uniqueTypes = computed(() => {
  const types = vehicles.value.map(v => v.type).filter(Boolean)
  return [...new Set(types)]
})

const uniqueClasses = computed(() => {
  const classes = vehicles.value.map(v => v.vehicleClass).filter(Boolean)
  return [...new Set(classes)]
})

function handleDrop(event: DragEvent) {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

async function processFile(file: File) {
  if (!file.name.endsWith('.xml') && !file.name.endsWith('.meta')) {
    alert('Por favor, selecione um arquivo XML ou .meta válido.')
    return
  }

  isProcessing.value = true
  hasProcessedFile.value = true
  
  try {
    const xmlContent = await file.text()
    const jsonData = await parseXmlString(xmlContent)
    
    // Armazenar dados originais para reconstrução
    originalXmlData.value = jsonData
    
    // Extrair veículos
    const initDatas = jsonData?.CVehicleModelInfo__InitDataList?.InitDatas
    if (initDatas) {
      const vehicleArray = Array.isArray(initDatas.Item) ? initDatas.Item : [initDatas.Item]
      vehicles.value = vehicleArray.filter(Boolean)
    } else {
      vehicles.value = []
    }
    
    hasChanges.value = false
  } catch (error) {
    console.error('Erro ao processar arquivo:', error)
    alert('Erro ao processar o arquivo XML. Verifique se o formato está correto.')
  } finally {
    isProcessing.value = false
  }
}

function deleteVehicle(vehicleToDelete: Vehicle) {
  const index = vehicles.value.findIndex(v => v.modelName === vehicleToDelete.modelName)
  if (index !== -1) {
    vehicles.value.splice(index, 1)
    markAsChanged()
  }
}

function markAsChanged() {
  hasChanges.value = true
}

function resetManager() {
  vehicles.value = []
  hasProcessedFile.value = false
  hasChanges.value = false
  originalXmlData.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function downloadModifiedXml() {
  if (!originalXmlData.value || !hasChanges.value) return
  
  try {
    // Reconstruir o JSON com a nova ordem/veículos
    const modifiedData = { ...originalXmlData.value }
    
    if (vehicles.value.length > 0) {
      modifiedData.CVehicleModelInfo__InitDataList.InitDatas.Item = vehicles.value
    } else {
      // Se não há veículos, remover a seção InitDatas
      delete modifiedData.CVehicleModelInfo__InitDataList.InitDatas
    }
    
    // Converter de volta para XML
    const xmlContent = buildXmlFromJson(modifiedData)
    
    // Download do arquivo
    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vehicles_modified.meta'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    hasChanges.value = false
  } catch (error) {
    console.error('Erro ao gerar XML:', error)
    alert('Erro ao gerar o arquivo XML modificado.')
  }
}
</script>