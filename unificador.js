import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import xml2js from 'xml2js';
const parser = new xml2js.Parser({ explicitArray: false });
const builder = new xml2js.Builder({
  renderOpts: { pretty: true, indent: '  ', newline: '\n' },
  xmldec: { version: '1.0', encoding: 'UTF-8' }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const directoryPath = path.join(__dirname, '/metas');

async function convertXmlToJson() {
    try {
        const jsonDatas = []
        const files = await fs.readdir(directoryPath);

        for (const file of files) {
            const xmlData = await fs.readFile(directoryPath + '/' + file, 'utf8')

            const jsonData = await parser.parseStringPromise(xmlData);

            jsonDatas.push(jsonData)
    
            console.log('JSON convertido');
        }

        console.log(`Arquivo que sera usado para unificar: ${files[0]}`);
        return jsonDatas;
    } catch (error) {
        console.error('Erro ao converter XML para JSON:', error);
        throw error;
    }
}

const getArrayOrData = (data) => {
    if (!data) {
        return [];
    }

    if (Array.isArray(data)) {
        return data;
    }
    return [data];
}

function mergeData(jsonData, newJsonData, path) {
    const data = getArrayOrData(jsonData.CVehicleModelInfo__InitDataList?.[path]?.Item);
    if (data.length) {
        if (!Array.isArray(newJsonData.CVehicleModelInfo__InitDataList?.[path]?.Item)) {
            newJsonData.CVehicleModelInfo__InitDataList[path].Item = [newJsonData.CVehicleModelInfo__InitDataList[path].Item];
        }
        newJsonData.CVehicleModelInfo__InitDataList[path].Item.push(...data);
    }
}

async function modifyJson(jsonDatas) {
    try {
        console.log('Modificando JSON...');
        let newJsonData = jsonDatas.shift();

        for (const jsonData of jsonDatas) {
            mergeData(jsonData, newJsonData, "InitDatas");
            mergeData(jsonData, newJsonData, "txdRelationships");
        }

        return newJsonData;
    } catch (error) {
        console.error('Erro ao modificar JSON:', error);
        throw error;
    }
}

async function convertJsonToXml(jsonData, outputFilePath) {
    try {
        let xmlData = builder.buildObject(jsonData);

        xmlData = xmlData.replace(/&#xD;/g, '');
        xmlData = xmlData.replace(/\r/g, '');

        await fs.writeFile(outputFilePath, xmlData);
        console.log('Novo arquivo XML criado com sucesso!');
    } catch (error) {
        console.error('Erro ao converter JSON para XML:', error);
        throw error;
    }
}

async function main() {
    try {
        // Converter XML para JSON
        let jsonDatas = await convertXmlToJson();

        // Modificar JSON conforme necessário
        let jsonData = await modifyJson(jsonDatas);

        // Converter JSON de volta para XML
        const outputFilePath = 'novo_arquivo_unificado.meta';
        await convertJsonToXml(jsonData, outputFilePath);
    } catch (error) {
        console.error('Erro no processo:', error);
    }
}

// Executar o processo
main();
