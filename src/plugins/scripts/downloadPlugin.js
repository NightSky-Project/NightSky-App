import * as FileSystem from 'expo-file-system';
import unzipPlugin from '../../utils/unzipPlugin';
import createPluginDirs from './createPluginDirs';

/**
 * Downloads a plugin from the Supabase storage and extracts it to the plugins directory.
 * @param {string} pluginName - Name of the plugin to be downloaded.
 * @returns {Promise<string>} Path to the extracted plugin directory.
 */
export async function downloadPlugin(bucketUrl, pluginName) {
    const downloadPath = `${FileSystem.documentDirectory}plugins/downloads/${pluginName}.zip`;
    const extractPath = `${FileSystem.documentDirectory}plugins/${pluginName}`;

    await createPluginDirs();

    const pluginExists = await FileSystem.getInfoAsync(extractPath);
    if (pluginExists.exists) {
        return extractPath;
    }

    const pluginDownloaded = await FileSystem.getInfoAsync(downloadPath);
    if (!pluginDownloaded.exists) {
        try {
            const downloadResult = await FileSystem.downloadAsync(bucketUrl, downloadPath);
            if (downloadResult.status !== 200) {
                console.error('Error during download operation:', downloadResult);
                return null;
            }
            console.info('Plugin downloaded:', downloadResult.uri);
        } catch (error) {
            console.error('Error during download operation:', error);
            return null;
        }
    }

    const unzipResult = await unzipPlugin(downloadPath, extractPath);
    
    await FileSystem.deleteAsync(downloadPath, { idempotent: true }).then(() => {
        console.log('Downloaded plugin deleted:', downloadPath);
    }).catch((error) => {
        console.error('Error deleting downloaded plugin:', error);
    });

    if (!unzipResult) {
        return null;
    }



    return extractPath;
}
