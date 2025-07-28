const fs = require('fs');
const { DOMParser } = require('@xmldom/xmldom');

console.log('🔍 DEBUG DETALHADO DO PARSING XML');
console.log('================================');

// Simular a função parseXmlToObject
const parseXmlToObject = async (xmlContent) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    if (!xmlDoc || !xmlDoc.documentElement) {
      throw new Error('XML inválido ou vazio');
    }
    
    return xmlToJson(xmlDoc.documentElement);
  } catch (error) {
    throw new Error(`Erro ao fazer parse do XML: ${error}`);
  }
};

// Função para converter elemento XML para objeto JSON
const xmlToJson = (element) => {
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
  const children = [];
  if (element.childNodes) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];
      if (child.nodeType === 1) { // Element node
        children.push(child);
      }
    }
  }
  
  if (children.length === 0) {
    // Se não há filhos, retornar o texto do elemento
    const textContent = element.textContent ? element.textContent.trim() : '';
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
    const childName = child.tagName || child.nodeName;
    if (!childGroups[childName]) {
      childGroups[childName] = [];
    }
    childGroups[childName].push(xmlToJson(child));
  });
  
  // Converter grupos em propriedades do resultado
  Object.keys(childGroups).forEach(childName => {
    const group = childGroups[childName];
    // SEMPRE manter como array para elementos Item para garantir consistência
    if (childName === 'Item') {
      result[childName] = group;
      console.log(`📊 Encontrados ${group.length} itens do tipo '${childName}'`);
    } else if (group.length === 1) {
      result[childName] = group[0];
    } else {
      result[childName] = group;
    }
  });
  
  return result;
};

// Função para testar o parsing
const testParsing = async () => {
  try {
    console.log('\n📁 Testando vehicles1.meta...');
    const vehicles1Content = fs.readFileSync('metas/vehicles1.meta', 'utf8');
    const vehicles1Json = await parseXmlToObject(vehicles1Content);
    
    console.log('🔍 Estrutura do vehicles1.meta:');
    console.log('- CVehicleModelInfo__InitDataList:', !!vehicles1Json.CVehicleModelInfo__InitDataList);
    
    if (vehicles1Json.CVehicleModelInfo__InitDataList) {
      console.log('- InitDatas:', !!vehicles1Json.CVehicleModelInfo__InitDataList.InitDatas);
      console.log('- txdRelationships:', !!vehicles1Json.CVehicleModelInfo__InitDataList.txdRelationships);
      
      if (vehicles1Json.CVehicleModelInfo__InitDataList.InitDatas) {
        const initItems = vehicles1Json.CVehicleModelInfo__InitDataList.InitDatas.Item;
        console.log(`📊 InitDatas.Item: ${Array.isArray(initItems) ? initItems.length : (initItems ? 1 : 0)} itens`);
        
        if (Array.isArray(initItems)) {
          console.log('🔍 Primeiros 5 itens:');
          initItems.slice(0, 5).forEach((item, index) => {
            if (item && item.$ && item.$.src) {
              console.log(`  ${index + 1}. ${item.$.src}`);
            }
          });
        }
      }
      
      if (vehicles1Json.CVehicleModelInfo__InitDataList.txdRelationships) {
        const txdItems = vehicles1Json.CVehicleModelInfo__InitDataList.txdRelationships.Item;
        console.log(`📊 txdRelationships.Item: ${Array.isArray(txdItems) ? txdItems.length : (txdItems ? 1 : 0)} itens`);
      }
    }
    
    console.log('\n📁 Testando vehicles2.meta...');
    const vehicles2Content = fs.readFileSync('metas/vehicles2.meta', 'utf8');
    const vehicles2Json = await parseXmlToObject(vehicles2Content);
    
    console.log('🔍 Estrutura do vehicles2.meta:');
    console.log('- CVehicleModelInfo__InitDataList:', !!vehicles2Json.CVehicleModelInfo__InitDataList);
    
    if (vehicles2Json.CVehicleModelInfo__InitDataList) {
      console.log('- InitDatas:', !!vehicles2Json.CVehicleModelInfo__InitDataList.InitDatas);
      console.log('- txdRelationships:', !!vehicles2Json.CVehicleModelInfo__InitDataList.txdRelationships);
      
      if (vehicles2Json.CVehicleModelInfo__InitDataList.InitDatas) {
        const initItems = vehicles2Json.CVehicleModelInfo__InitDataList.InitDatas.Item;
        console.log(`📊 InitDatas.Item: ${Array.isArray(initItems) ? initItems.length : (initItems ? 1 : 0)} itens`);
        
        if (Array.isArray(initItems)) {
          console.log('🔍 Primeiros 5 itens:');
          initItems.slice(0, 5).forEach((item, index) => {
            if (item && item.$ && item.$.src) {
              console.log(`  ${index + 1}. ${item.$.src}`);
            }
          });
        }
      }
      
      if (vehicles2Json.CVehicleModelInfo__InitDataList.txdRelationships) {
        const txdItems = vehicles2Json.CVehicleModelInfo__InitDataList.txdRelationships.Item;
        console.log(`📊 txdRelationships.Item: ${Array.isArray(txdItems) ? txdItems.length : (txdItems ? 1 : 0)} itens`);
      }
    }
    
    // Testar merge
    console.log('\n🔄 Testando merge...');
    const getArrayOrData = (data) => {
      if (!data) return [];
      if (Array.isArray(data)) return data;
      return [data];
    };
    
    const mergeData = (sourceData, targetData, path) => {
      const data = getArrayOrData(sourceData.CVehicleModelInfo__InitDataList?.[path]?.Item);
      console.log(`📊 Merge ${path}: ${data.length} itens do source`);
      
      if (data.length) {
        if (!targetData.CVehicleModelInfo__InitDataList) {
          targetData.CVehicleModelInfo__InitDataList = {};
        }
        if (!targetData.CVehicleModelInfo__InitDataList[path]) {
          targetData.CVehicleModelInfo__InitDataList[path] = { Item: [] };
        }
        
        if (!targetData.CVehicleModelInfo__InitDataList[path].Item) {
          targetData.CVehicleModelInfo__InitDataList[path].Item = [];
        } else if (!Array.isArray(targetData.CVehicleModelInfo__InitDataList[path].Item)) {
          targetData.CVehicleModelInfo__InitDataList[path].Item = [targetData.CVehicleModelInfo__InitDataList[path].Item];
        }
        
        const beforeCount = targetData.CVehicleModelInfo__InitDataList[path].Item.length;
        
        data.forEach((item) => {
          if (item && typeof item === 'object') {
            targetData.CVehicleModelInfo__InitDataList[path].Item.push(item);
          }
        });
        
        const afterCount = targetData.CVehicleModelInfo__InitDataList[path].Item.length;
        console.log(`📊 Target ${path}: ${beforeCount} -> ${afterCount} itens`);
      }
    };
    
    let newJsonData = JSON.parse(JSON.stringify(vehicles1Json));
    mergeData(vehicles2Json, newJsonData, 'InitDatas');
    mergeData(vehicles2Json, newJsonData, 'txdRelationships');
    
    const totalInitItems = newJsonData.CVehicleModelInfo__InitDataList?.InitDatas?.Item?.length || 0;
    const totalTxdItems = newJsonData.CVehicleModelInfo__InitDataList?.txdRelationships?.Item?.length || 0;
    
    console.log('\n📊 RESULTADO FINAL:');
    console.log(`- InitDatas: ${totalInitItems} itens`);
    console.log(`- txdRelationships: ${totalTxdItems} itens`);
    console.log(`- Total: ${totalInitItems + totalTxdItems} itens`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
};

testParsing();