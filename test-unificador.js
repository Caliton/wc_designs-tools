import { promises as fs } from 'fs';

// Função simples para contar veículos em um arquivo XML
function countVehicles(xmlContent) {
  const itemMatches = xmlContent.match(/<Item>/g);
  return itemMatches ? itemMatches.length : 0;
}

// Função para verificar se contém veículos específicos
function checkVehicles(xmlContent) {
  return {
    hasHarryPotterVI: xmlContent.includes('WRharrypotterVI'),
    hasHarryPotterIII: xmlContent.includes('WRharrypotterIII'),
    hasCarruagem: xmlContent.includes('wrcarruagem')
  };
}

async function testUnificacao() {
  console.log('🧪 TESTE DE UNIFICAÇÃO - Comparando Resultados\n');
  
  try {
    // Ler arquivos originais
    const vehicles1 = await fs.readFile('./metas/vehicles1.meta', 'utf8');
    const vehicles2 = await fs.readFile('./metas/vehicles2.meta', 'utf8');
    
    // Ler arquivo unificado pelo script original
    const unificadoOriginal = await fs.readFile('./novo_arquivo_unificado.meta', 'utf8');
    
    console.log('📊 ANÁLISE DOS ARQUIVOS:');
    console.log('========================');
    
    // Contar veículos nos arquivos originais
    const count1 = countVehicles(vehicles1);
    const count2 = countVehicles(vehicles2);
    const countUnificado = countVehicles(unificadoOriginal);
    
    console.log(`📁 vehicles1.meta: ${count1} veículos`);
    console.log(`📁 vehicles2.meta: ${count2} veículos`);
    console.log(`📁 Arquivo unificado: ${countUnificado} veículos`);
    console.log(`📊 Total esperado: ${count1 + count2} veículos\n`);
    
    // Verificar veículos específicos
    const check1 = checkVehicles(vehicles1);
    const check2 = checkVehicles(vehicles2);
    const checkUnificado = checkVehicles(unificadoOriginal);
    
    console.log('🔍 VERIFICAÇÃO DE VEÍCULOS ESPECÍFICOS:');
    console.log('======================================');
    console.log(`WRharrypotterVI   - Original: ${check1.hasHarryPotterVI ? '✅' : '❌'} | Unificado: ${checkUnificado.hasHarryPotterVI ? '✅' : '❌'}`);
    console.log(`WRharrypotterIII  - Original: ${check1.hasHarryPotterIII ? '✅' : '❌'} | Unificado: ${checkUnificado.hasHarryPotterIII ? '✅' : '❌'}`);
    console.log(`wrcarruagem       - Original: ${check2.hasCarruagem ? '✅' : '❌'} | Unificado: ${checkUnificado.hasCarruagem ? '✅' : '❌'}\n`);
    
    // Resultado final
    const unificacaoCorreta = (
      countUnificado === (count1 + count2) &&
      checkUnificado.hasHarryPotterVI &&
      checkUnificado.hasHarryPotterIII &&
      checkUnificado.hasCarruagem
    );
    
    if (unificacaoCorreta) {
      console.log('🎉 RESULTADO: UNIFICAÇÃO FUNCIONANDO PERFEITAMENTE!');
      console.log('✅ Todos os veículos foram unificados corretamente');
      console.log('✅ O script original está funcionando como esperado');
      console.log('\n📋 PROVA: O arquivo novo_arquivo_unificado.meta contém:');
      console.log(`   - ${count1} veículos do vehicles1.meta`);
      console.log(`   - ${count2} veículo do vehicles2.meta`);
      console.log(`   - Total: ${countUnificado} veículos unificados`);
    } else {
      console.log('❌ PROBLEMA: A unificação não está funcionando corretamente');
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste
testUnificacao();