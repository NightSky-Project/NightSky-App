import { supabase } from './supabaseClient';
import { unzip } from 'react-native-zip-archive';
import * as FileSystem from 'expo-file-system';

/**
 * Downloads a plugin from the Supabase storage and extracts it to the plugins directory.
 * @param {string} pluginName - Name of the plugin to be downloaded.
 * @returns {Promise<string>} Path to the extracted plugin directory.
 */
export async function downloadPlugin(pluginName) {
    const downloadPath = `${FileSystem.documentDirectory}plugins/${pluginName}.zip`;
    const extractPath = `${FileSystem.documentDirectory}plugins/${pluginName}`;

    try {
        const { data, error } = await supabase.storage
            .from('plugins')
            .download(`${pluginName}/plugin.zip`);

        if (error) {
            console.error('Erro ao baixar o plugin:', error.message);
            return null;
        }

        const zipContent = await data.arrayBuffer();

        await FileSystem.writeAsStringAsync(downloadPath, zipContent, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await extractZip(downloadPath, extractPath);
        await FileSystem.deleteAsync(downloadPath, { idempotent: true });

        console.log('Plugin downloaded and extracted:', extractPath);
        return extractPath;
    } catch (error) {
        console.error('Erro ao carregar o plugin:', error);
        return null;
    }
}

async function extractZip(zipPath, extractPath) {
    const zipContent = await FileSystem.readAsStringAsync(zipPath, {
        encoding: FileSystem.EncodingType.Base64,
    });
    const zip = await unzip(zipContent, extractPath);

    await FileSystem.makeDirectoryAsync(extractPath, { intermediates: true });

    const files = Object.keys(zip.files);
    for (const fileName of files) {
        const file = zip.files[fileName];
        const filePath = `${extractPath}/${fileName}`;

        if (file.dir) {
            await FileSystem.makeDirectoryAsync(filePath, { intermediates: true });
        } else {
            const fileData = await file.async('base64');
            await FileSystem.writeAsStringAsync(filePath, fileData, {
                encoding: FileSystem.EncodingType.Base64,
            });
        }
    }
}
