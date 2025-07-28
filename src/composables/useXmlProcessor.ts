import { ref } from 'vue'

interface ProgressCallback {
  (progress: number, message?: string): void
}

interface VehicleData {
  CVehicleModelInfo__InitDataList?: {
    InitDatas?: {
      Item: any[] | any
    }
    txdRelationships?: {
      Item: any[] | any
    }
  }
}

export function useXmlProcessor() {
  // Usar DOMParser nativo do navegador para evitar problemas com EventEmitter
  const parseXmlToObject = async (xmlString: string): Promise<any> => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml')
      
      // Verificar se há erros de parsing
      const parseError = xmlDoc.querySelector('parsererror')
      if (parseError) {
        throw new Error(`Erro de parsing XML: ${parseError.textContent}`)
      }
      
      return xmlToJson(xmlDoc.documentElement)
    } catch (error) {
      throw new Error(`Erro ao fazer parse do XML: ${error}`)
    }
  }
  
  // Função para converter elemento XML para objeto JSON
  const xmlToJson = (element: Element): any => {
    const result: any = {}
    
    // Adicionar atributos
    if (element.attributes.length > 0) {
      result['$'] = {}
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        result['$'][attr.name] = attr.value
      }
    }
    
    // Processar nós filhos
    const children = Array.from(element.children)
    if (children.length === 0) {
      // Se não há filhos, retornar o texto do elemento
      const textContent = element.textContent?.trim()
      if (textContent) {
        if (result['$']) {
          result['_'] = textContent
        } else {
          return textContent
        }
      }
      return Object.keys(result).length > 0 ? result : null
    }
    
    // Agrupar elementos filhos por nome
    const childGroups: { [key: string]: any[] } = {}
    children.forEach(child => {
      const childName = child.tagName
      if (!childGroups[childName]) {
        childGroups[childName] = []
      }
      childGroups[childName].push(xmlToJson(child))
    })
    
    // Converter grupos em propriedades do resultado
    Object.keys(childGroups).forEach(childName => {
      const group = childGroups[childName]
      // SEMPRE manter como array para elementos Item para garantir consistência
      if (childName === 'Item') {
        result[childName] = group
      } else if (group.length === 1) {
        result[childName] = group[0]
      } else {
        result[childName] = group
      }
    })
    
    return result
  }
  
  // Função para converter objeto para XML
  const convertObjectToXml = (obj: any): string => {
    try {
      const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n'
      
      // Se o objeto já tem a tag raiz CVehicleModelInfo__InitDataList, usar diretamente
      if (obj.CVehicleModelInfo__InitDataList) {
        const xmlBody = jsonToXml(obj, '')
        return xmlHeader + xmlBody
      }
      
      // Caso contrário, envolver o conteúdo na tag raiz
      const xmlBody = `<CVehicleModelInfo__InitDataList>\n${jsonToXml(obj, '  ')}</CVehicleModelInfo__InitDataList>\n`
      return xmlHeader + xmlBody
    } catch (error) {
      throw new Error(`Erro ao construir XML: ${error}`)
    }
  }
  
  // Função para converter JSON para XML
  const jsonToXml = (obj: any, indent: string): string => {
    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
      return String(obj)
    }
    
    if (obj === null || obj === undefined) {
      return ''
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => jsonToXml(item, indent)).join('')
    }
    
    let xml = ''
    const nextIndent = indent + '  '
    
    Object.keys(obj).forEach(key => {
      if (key === '$') {
        // Atributos são processados separadamente
        return
      }
      
      if (key === '_') {
        // Conteúdo de texto
        xml += String(obj[key])
        return
      }
      
      const value = obj[key]
      
      if (Array.isArray(value)) {
        value.forEach(item => {
          xml += `${indent}<${key}`
          
          // Adicionar atributos se existirem
          if (item && typeof item === 'object' && item['$']) {
            Object.keys(item['$']).forEach(attrName => {
              xml += ` ${attrName}="${item['$'][attrName]}"`
            })
          }
          
          const content = item && typeof item === 'object' && item['$'] ? 
            Object.keys(item).filter(k => k !== '$').reduce((acc, k) => ({ ...acc, [k]: item[k] }), {}) : item
          
          if (content === null || content === undefined || 
              (typeof content === 'object' && Object.keys(content).length === 0)) {
            xml += ' />\n'
          } else {
            xml += '>'
            if (typeof content === 'object' && Object.keys(content).length > 0) {
              xml += '\n' + jsonToXml(content, nextIndent) + indent
            } else {
              xml += jsonToXml(content, '')
            }
            xml += `</${key}>\n`
          }
        })
      } else {
        xml += `${indent}<${key}`
        
        // Adicionar atributos se existirem
        if (value && typeof value === 'object' && value['$']) {
          Object.keys(value['$']).forEach(attrName => {
            xml += ` ${attrName}="${value['$'][attrName]}"`
          })
        }
        
        const content = value && typeof value === 'object' && value['$'] ? 
          Object.keys(value).filter(k => k !== '$').reduce((acc, k) => ({ ...acc, [k]: value[k] }), {}) : value
        
        if (content === null || content === undefined) {
          xml += ' />\n'
        } else if (typeof content === 'object' && Object.keys(content).length === 0) {
          // Para elementos vazios como txdRelationships, manter a tag completa
          if (key === 'txdRelationships') {
            xml += '>\n\n' + indent + `</${key}>\n`
          } else {
            xml += ' />\n'
          }
        } else {
          xml += '>'
          if (typeof content === 'object' && Object.keys(content).length > 0) {
            xml += '\n' + jsonToXml(content, nextIndent) + indent
          } else {
            xml += jsonToXml(content, '')
          }
          xml += `</${key}>\n`
        }
      }
    })
    
    return xml
  }



  const getArrayOrData = (data: any): any[] => {
    if (!data) {
      return []
    }
    if (Array.isArray(data)) {
      return data
    }
    return [data]
  }

  const mergeData = (jsonData: VehicleData, newJsonData: VehicleData, path: 'InitDatas' | 'txdRelationships') => {
    // Replicar exatamente a lógica do arquivo de referência unificador.js
    
    // Garantir que o elemento existe no target, mesmo que vazio
    if (!newJsonData[path]) {
      newJsonData[path] = {}
    }
    
    const data = getArrayOrData(jsonData[path]?.Item)
    if (data.length) {
      // Verificar se o target tem a estrutura necessária para itens
      if (!newJsonData[path].Item) {
        newJsonData[path].Item = []
      } else if (!Array.isArray(newJsonData[path].Item)) {
        newJsonData[path].Item = [newJsonData[path].Item]
      }
      
      // Adicionar todos os itens do source ao target
      data.forEach((item: any) => {
        if (item && typeof item === 'object') {
          newJsonData[path].Item.push(item)
        }
      })
    }
  }

  const convertXmlToJson = async (files: File[], progressCallback: ProgressCallback): Promise<VehicleData[]> => {
    const jsonDatas: VehicleData[] = []
    const totalFiles = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      progressCallback(Math.round((i / totalFiles) * 30), `Convertendo ${file.name} para JSON...`)
      
      try {
        const xmlContent = await file.text()
        const jsonData = await parseXmlToObject(xmlContent) as VehicleData
        jsonDatas.push(jsonData)
        progressCallback(Math.round(((i + 1) / totalFiles) * 30), `${file.name} convertido com sucesso`)
      } catch (error) {
        throw new Error(`Erro ao converter ${file.name}: ${error}`)
      }
    }

    return jsonDatas
  }

  const modifyJson = async (jsonDatas: VehicleData[], progressCallback: ProgressCallback): Promise<VehicleData> => {
    progressCallback(40, 'Iniciando unificação dos dados...')
    
    if (jsonDatas.length === 0) {
      throw new Error('Nenhum arquivo válido para processar')
    }

    // Replicar exatamente a lógica do arquivo de referência unificador.js
    let newJsonData = jsonDatas.shift()!
    const totalFiles = jsonDatas.length

    for (let i = 0; i < jsonDatas.length; i++) {
      const jsonData = jsonDatas[i]
      progressCallback(40 + Math.round((i / totalFiles) * 40), `Unificando dados do arquivo ${i + 2}...`)
      
      try {
        mergeData(jsonData, newJsonData, 'InitDatas')
        mergeData(jsonData, newJsonData, 'txdRelationships')
      } catch (error) {
        throw new Error(`Erro ao unificar dados: ${error}`)
      }
    }

    progressCallback(80, 'Unificação concluída')
    return newJsonData
  }

  const convertJsonToXml = async (jsonData: VehicleData, progressCallback: ProgressCallback): Promise<string> => {
    progressCallback(90, 'Convertendo para XML...')
    
    try {
      let xmlData = convertObjectToXml(jsonData)
      
      // Limpar caracteres indesejados como no script original
      xmlData = xmlData.replace(/&#xD;/g, '')
      xmlData = xmlData.replace(/\r/g, '')
      
      progressCallback(100, 'Conversão para XML concluída')
      return xmlData
    } catch (error) {
      throw new Error(`Erro ao converter para XML: ${error}`)
    }
  }

  const processXmlFiles = async (files: File[], progressCallback: ProgressCallback): Promise<string> => {
    try {
      // Validar arquivos
      if (files.length < 2) {
        throw new Error('É necessário pelo menos 2 arquivos para unificar')
      }

      progressCallback(0, 'Iniciando processamento...')
      
      // Converter XML para JSON
      const jsonDatas = await convertXmlToJson(files, progressCallback)
      
      // Modificar e unificar JSON
      const unifiedData = await modifyJson(jsonDatas, progressCallback)
      
      // Converter de volta para XML
      const xmlResult = await convertJsonToXml(unifiedData, progressCallback)
      
      return xmlResult
    } catch (error) {
      throw error
    }
  }

  // Funções auxiliares para o gerenciador de veículos
  const parseXmlString = async (xmlString: string): Promise<any> => {
    try {
      return await parseXmlToObject(xmlString)
    } catch (error) {
      throw new Error(`Erro ao fazer parse do XML: ${error}`)
    }
  }

  const buildXmlFromJson = (jsonData: any): string => {
    try {
      return convertObjectToXml(jsonData)
    } catch (error) {
      throw new Error(`Erro ao construir XML: ${error}`)
    }
  }

  return {
    processXmlFiles,
    parseXmlString,
    buildXmlFromJson
  }
}

export type { ProgressCallback }