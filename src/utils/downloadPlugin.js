import * as FileSystem from 'expo-file-system';
import unzipPlugin from './unzipPlugin';

/**
 * Downloads a plugin from the Supabase storage and extracts it to the plugins directory.
 * @param {string} pluginName - Name of the plugin to be downloaded.
 * @returns {Promise<string>} Path to the extracted plugin directory.
 */
export async function downloadPlugin(pluginName) {
    const downloadPath = `${FileSystem.documentDirectory}plugins/${pluginName}.zip`;
    const extractPath = `${FileSystem.documentDirectory}plugins/${pluginName}`;
    const bucketUrl = `https://tfauntitwhcdwztqqgbp.supabase.co/storage/v1/object/public/Plugins/${pluginName}.zip`;
    const PLUGINS_DIRECTORY = FileSystem.documentDirectory + 'plugins';

    const checkDirectoryExists = async (directory) => {
        try {
            const stats = await FileSystem.getInfoAsync(directory);
            return stats.exists;
            } catch (error) {
            console.error('Error checking directory:', error);
            return false;
        }
    };

    if (!await checkDirectoryExists(PLUGINS_DIRECTORY)) {
        await FileSystem.makeDirectoryAsync(PLUGINS_DIRECTORY, { intermediates: true });
    }

    const pluginExists = await FileSystem.getInfoAsync(extractPath);
    if (pluginExists.exists) {
        console.log('Plugin already installed:', extractPath);
        return extractPath;
    }

    try {
        if(!await FileSystem.getInfoAsync(downloadPath)) {
            const response = await FileSystem.downloadAsync(bucketUrl, downloadPath);
            if (!response.ok) {
                console.error('Erro ao baixar o plugin:', response.statusText);
                return null;
            }

            const arrayBuffer = await response.arrayBuffer();
            const base64String = arrayBufferToBase64(arrayBuffer);

            await FileSystem.writeAsStringAsync(downloadPath, base64String, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const pluginDone = await FileSystem.getInfoAsync(downloadPath);
            console.log('Plugin downloaded:', pluginDone);
            
        } else {
            console.log('Plugin already downloaded:', downloadPath);
        }
        
        try {
            const unzipResult = await unzipPlugin(downloadPath, extractPath);
            await FileSystem.deleteAsync(downloadPath, { idempotent: true });
        } catch (error) {
            console.error('Error during unzip operation:', error);
            return null;
        }


        console.log('Plugin downloaded and extracted:', extractPath);
        return extractPath;
    } catch (error) {
        console.error('Erro ao carregar o plugin:', error);
        return null;
    }
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
