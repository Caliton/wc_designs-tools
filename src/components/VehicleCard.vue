<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 group">
    <!-- Header do Card -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <Car class="w-5 h-5 text-emerald-600" />
        <h3 class="text-lg font-semibold text-gray-900 truncate">{{ vehicle.modelName }}</h3>
      </div>
      <button
        @click="$emit('delete', vehicle)"
        class="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-red-50 hover:bg-red-100 transition-all duration-200"
        title="Excluir veículo"
      >
        <Trash2 class="w-4 h-4 text-red-500" />
      </button>
    </div>

    <!-- Informações do Veículo -->
    <div class="space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-gray-600">Nome do Jogo:</span>
        <span class="text-gray-900 font-medium">{{ vehicle.gameName }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">Fabricante:</span>
        <span class="text-gray-900 font-medium">{{ vehicle.vehicleMakeName }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">Tipo:</span>
        <span class="text-emerald-600 font-medium">{{ formatVehicleType(vehicle.type) }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">Classe:</span>
        <span class="text-blue-600 font-medium">{{ formatVehicleClass(vehicle.vehicleClass) }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">Handling ID:</span>
        <span class="text-gray-700 font-mono text-xs">{{ vehicle.handlingId }}</span>
      </div>
    </div>

    <!-- Badge de Status -->
    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
        <span class="text-xs text-emerald-600">Ativo</span>
      </div>
      
      <!-- Ícone de Drag -->
      <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical class="w-4 h-4 text-gray-400 cursor-move" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Car, Trash2, GripVertical } from 'lucide-vue-next'

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

interface Props {
  vehicle: Vehicle
}

defineProps<Props>()
defineEmits<{
  delete: [vehicle: Vehicle]
}>()

function formatVehicleType(type: string): string {
  return type.replace('VEHICLE_TYPE_', '').replace(/_/g, ' ').toLowerCase()
    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function formatVehicleClass(vehicleClass: string): string {
  return vehicleClass.replace('VC_', '').replace(/_/g, ' ').toLowerCase()
    .split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}
</script>