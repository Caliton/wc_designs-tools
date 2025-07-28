<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50"></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div class="text-center">
          <!-- Main Title -->
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Ferramentas para
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">
              Modding GTA V
            </span>
          </h1>
          
          <!-- Subtitle -->
          <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Simplifique seu workflow de modding com ferramentas modernas e intuitivas
          </p>
      
          <!-- Main Tools -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <!-- XML Unificador -->
            <router-link 
              to="/unificador"
              class="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-xl mb-6 group-hover:bg-emerald-200 transition-colors">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Unificador XML</h3>
              <p class="text-gray-600 text-sm mb-6">
                Unifique múltiplos arquivos .meta de veículos em um único arquivo XML
              </p>
              <div class="flex items-center text-emerald-600 text-sm font-medium group-hover:text-emerald-700">
                Acessar ferramenta
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </router-link>
            
            <!-- Vehicle Manager -->
            <router-link 
              to="/vehicle-manager"
              class="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-200 transition-colors">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Gerenciador</h3>
              <p class="text-gray-600 text-sm mb-6">
                Visualize, organize e edite os veículos dos seus arquivos XML
              </p>
              <div class="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                Gerenciar veículos
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </router-link>
            
            <!-- Help -->
            <router-link 
              to="/ajuda"
              class="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-6 group-hover:bg-purple-200 transition-colors">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">Documentação</h3>
              <p class="text-gray-600 text-sm mb-6">
                Guias completos e instruções para usar todas as ferramentas
              </p>
              <div class="flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                Ver documentação
                <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </router-link>
          </div>
      
        </div>
      </div>
    </div>
    
    <!-- Features Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Por que escolher nossas ferramentas?</h2>
          <p class="text-lg text-gray-600">Desenvolvidas com foco na experiência do usuário e performance</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mx-auto mb-6">
              <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Rápido</h3>
            <p class="text-gray-600">Processamento otimizado para arquivos grandes com performance excepcional</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Moderno</h3>
            <p class="text-gray-600">Interface elegante e intuitiva, desenvolvida com as melhores práticas de UX</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-6">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Seguro</h3>
            <p class="text-gray-600">Processamento local no navegador, seus arquivos nunca saem do seu computador</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Status Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-6">
          <div class="flex items-center bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3">
            <div class="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
            <span class="text-emerald-700 text-sm font-medium">Sistema Online</span>
          </div>
          
          <div class="flex items-center bg-blue-50 border border-blue-200 rounded-full px-6 py-3">
            <div class="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            <span class="text-blue-700 text-sm font-medium">Ferramentas Ativas</span>
          </div>
          
          <div class="flex items-center bg-purple-50 border border-purple-200 rounded-full px-6 py-3">
            <div class="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
            <span class="text-purple-700 text-sm font-medium">Pronto para Usar</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
