const fs = require('fs').promises;
const path = require('path');

// Simular a implementação web do unificador com debug detalhado
class WebXmlProcessor {
  parseXmlString(xmlString) {
    console.log('🔍 Iniciando parsing do XML...');
    
    // Contar itens no XML original
    const originalItemCount = (xmlString.match(/<Item>/g) || []).length;
    console.log(`📊 Itens encontrados no XML original: ${originalItemCount}`);
    
    // Simulação mais precisa do DOMParser
    const parser = new (require('jsdom').JSDOM)().window.DOMParser;
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    
    const result = this.xmlToJson(xmlDoc.documentElement);
    
    // Verificar quantos itens foram parseados
    const parsedItems = result.CVehicleModelInfo__InitDataList?.InitDatas?.Item;
    const parsedItemCount = Array.isArray(parsedItems) ? parsedItems.length : (parsedItems ? 1 : 0);
    console.log(`📊 Itens parseados para JSON: ${parsedItemCount}`);
    
    return result;
  }

  xmlToJson(element) {
    const result = {};
    
    // Adicionar atributos
    if (element.attributes && element.attributes.length > 0) {
      result['$'] = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        result['$'][attr.name] = attr.value;
      }
    }
    
    // Processar nós filhos
    const children = Array.from(element.children || []);
    if (children.length === 0) {
      const textContent = element.textContent?.trim();
      if (textContent) {
        if (result['$']) {
          result['_'] = textContent;
        } else {
          return textContent;
        }
      }
      return Object.keys(result).length > 0 ? result : null;
    }
    
    // Agrupar elementos filhos por nome
    const childGroups = {};
    children.forEach(child => {
      const childName = child.tagName;
      if (!childGroups[childName]) {
        childGroups[childName] = [];
      }
      childGroups[childName].push(this.xmlToJson(child));
    });
    
    // Converter grupos em propriedades do resultado
    Object.keys(childGroups).forEach(childName => {
      const group = childGroups[childName];
      if (group.length === 1) {
        result[childName] = group[0];
      } else {
        result[childName] = group;
      }
    });
    
    return result;
  }

  getArrayOrData(data) {
    if (!data) {
      return [];
    }
    if (Array.isArray(data)) {
      return data;
    }
    return [data];
  }

  mergeData(jsonData, newJsonData) {
    console.log('🔄 Iniciando merge de dados...');
    
    const sourceItems = this.getArrayOrData(jsonData.CVehicleModelInfo__InitDataList?.InitDatas?.Item);
    const targetItems = this.getArrayOrData(newJsonData.CVehicleModelInfo__InitDataList?.InitDatas?.Item);
    
    console.log(`📊 Itens no arquivo fonte: ${sourceItems.length}`);
    console.log(`📊 Itens no arquivo destino antes do merge: ${targetItems.length}`);
    
    if (sourceItems.length > 0) {
      // Garantir estrutura
      if (!newJsonData.CVehicleModelInfo__InitDataList) {
        newJsonData.CVehicleModelInfo__InitDataList = {};
      }
      if (!newJsonData.CVehicleModelInfo__InitDataList.InitDatas) {
        newJsonData.CVehicleModelInfo__InitDataList.InitDatas = { Item: [] };
      }
      
      // Combinar itens
      const allItems = [...targetItems, ...sourceItems];
      newJsonData.CVehicleModelInfo__InitDataList.InitDatas.Item = allItems;
      
      console.log(`📊 Total de itens após merge: ${allItems.length}`);
    }
    
    return newJsonData;
  }

  buildXmlFromJson(jsonData) {
    console.log('🔧 Construindo XML a partir do JSON...');
    
    const items = this.getArrayOrData(jsonData.CVehicleModelInfo__InitDataList?.InitDatas?.Item);
    console.log(`📊 Itens a serem convertidos para XML: ${items.length}`);
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<CVehicleModelInfo__InitDataList>\n';
    xml += '  <residentTxd>vehshare</residentTxd>\n';
    xml += '  <residentAnims/>\n';
    xml += '  <InitDatas>\n';
    
    items.forEach((item, index) => {
      if (item && item.modelName) {
        xml += `    <Item>\n`;
        xml += `      <modelName>${item.modelName}</modelName>\n`;
        xml += `      <!-- Item ${index + 1} - outros dados omitidos para brevidade -->\n`;
        xml += `    </Item>\n`;
      }
    });
    
    xml += '  </InitDatas>\n';
    xml += '  <txdRelationships>\n  </txdRelationships>\n';
    xml += '</CVehicleModelInfo__InitDataList>';
    
    return xml;
  }

  async processXmlFiles(files) {
    console.log(`🚀 Processando ${files.length} arquivos...`);
    
    if (files.length === 0) return null;

    // Usar o primeiro arquivo como base
    console.log(`📁 Processando arquivo base: ${files[0].name}`);
    let unifiedJson = this.parseXmlString(files[0].content);

    // Mesclar os arquivos subsequentes
    for (let i = 1; i < files.length; i++) {
      console.log(`📁 Processando arquivo ${i + 1}: ${files[i].name}`);
      const newJson = this.parseXmlString(files[i].content);
      unifiedJson = this.mergeData(newJson, unifiedJson);
    }

    return this.buildXmlFromJson(unifiedJson);
  }
}

async function testWebImplementation() {
  console.log('🧪 TESTANDO IMPLEMENTAÇÃO WEB DO UNIFICADOR COM DEBUG DETALHADO');
  console.log('================================================================\n');

  try {
    // Instalar jsdom se necessário
    try {
      require('jsdom');
    } catch (e) {
      console.log('⚠️  jsdom não encontrado, usando implementação simplificada...');
      // Fallback para implementação mais simples
      WebXmlProcessor.prototype.parseXmlString = function(xmlString) {
        const items = [];
        const itemMatches = xmlString.match(/<Item>[\s\S]*?<\/Item>/g);
        console.log(`📊 Regex encontrou ${itemMatches ? itemMatches.length : 0} itens`);
        
        if (itemMatches) {
          itemMatches.forEach((item, index) => {
            const modelNameMatch = item.match(/<modelName>([^<]+)<\/modelName>/);
            if (modelNameMatch) {
              console.log(`  ✅ Item ${index + 1}: ${modelNameMatch[1]}`);
              items.push({
                modelName: modelNameMatch[1],
                content: item
              });
            }
          });
        }
        
        return {
          CVehicleModelInfo__InitDataList: {
            residentTxd: ['vehshare'],
            residentAnims: [''],
            InitDatas: { Item: items },
            txdRelationships: { Item: [] }
          }
        };
      };
    }

    // Ler os arquivos de teste
    const vehicles1Content = await fs.readFile('./metas/vehicles1.meta', 'utf8');
    const vehicles2Content = await fs.readFile('./metas/vehicles2.meta', 'utf8');

    // Simular arquivos como na implementação web
    const files = [
      { name: 'vehicles1.meta', content: vehicles1Content },
      { name: 'vehicles2.meta', content: vehicles2Content }
    ];

    // Processar com a implementação web
    const processor = new WebXmlProcessor();
    const unifiedXml = await processor.processXmlFiles(files);

    if (!unifiedXml) {
      console.log('❌ ERRO: Não foi possível gerar o XML unificado');
      return;
    }

    // Salvar o resultado
    await fs.writeFile('./arquivo_unificado_web_debug.meta', unifiedXml);

    // Analisar o resultado
    const itemCount = (unifiedXml.match(/<Item>/g) || []).length;
    const hasHarryVI = unifiedXml.includes('WRharrypotterVI');
    const hasHarryIII = unifiedXml.includes('WRharrypotterIII');
    const hasCarruagem = unifiedXml.includes('wrcarruagem');

    console.log('\n📊 RESULTADO FINAL DA IMPLEMENTAÇÃO WEB:');
    console.log('========================================');
    console.log(`📁 Total de veículos unificados: ${itemCount}`);
    console.log(`🔍 WRharrypotterVI: ${hasHarryVI ? '✅' : '❌'}`);
    console.log(`🔍 WRharrypotterIII: ${hasHarryIII ? '✅' : '❌'}`);
    console.log(`🔍 wrcarruagem: ${hasCarruagem ? '✅' : '❌'}`);

    if (itemCount === 33 && hasHarryVI && hasHarryIII && hasCarruagem) {
      console.log('\n🎉 SUCESSO: A implementação web está funcionando perfeitamente!');
      console.log('✅ Todos os 33 veículos foram unificados corretamente');
    } else {
      console.log('\n❌ PROBLEMA IDENTIFICADO: A implementação web não está funcionando corretamente');
      console.log(`   Esperado: 33 veículos, Encontrado: ${itemCount}`);
      console.log('\n🔍 Verificando arquivo de debug gerado...');
    }

  } catch (error) {
    console.error('❌ ERRO durante o teste:', error.message);
  }
}

testWebImplementation();