<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <!-- Logo -->
            <router-link to="/" class="flex items-center space-x-3">
              <img 
                src="/src/assets/1LOGO-WR.png" 
                alt="WR Design" 
                class="h-8 w-auto"
              />
              <span class="text-xl font-semibold text-gray-900">
                WR Tools
              </span>
            </router-link>
          </div>
          
          <div class="flex items-center space-x-1">
            <router-link 
              to="/"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="{ 'text-emerald-600 bg-emerald-50': $route.name === 'home' }"
            >
              Início
            </router-link>
            
            <router-link 
              to="/unificador"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="{ 'text-emerald-600 bg-emerald-50': $route.name === 'unificador' }"
            >
              Unificador
            </router-link>
            
            <router-link 
              to="/vehicle-manager"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="{ 'text-emerald-600 bg-emerald-50': $route.name === 'vehicle-manager' }"
            >
              Gerenciador
            </router-link>
            
            <router-link 
              to="/ajuda"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              :class="{ 'text-emerald-600 bg-emerald-50': $route.name === 'ajuda' }"
            >
              Ajuda
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>