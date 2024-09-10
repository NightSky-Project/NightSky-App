import * as FileSystem from 'expo-file-system';
import getLocalStorageData from '../plugins/default/getLocalStorage';
import monitorHtmlChanges from '../plugins/default/monitorHtmlChanges';

export async function loadPluginsFromDirectory() {
    const PLUGINS_DIRECTORY = FileSystem.documentDirectory + 'plugins';

    const checkDirectoryExists = async (directory) => {
        try {
            const stats = await FileSystem.getInfoAsync(directory);
            if(stats.exists) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error checking directory:', error);
            return false;
        }
    };

    try {
        if(!await checkDirectoryExists(PLUGINS_DIRECTORY)) {
            await FileSystem.makeDirectoryAsync(PLUGINS_DIRECTORY, { intermediates: true });
        }
        const files = await FileSystem.readDirectoryAsync(PLUGINS_DIRECTORY)
        const scripts = [getLocalStorageData, monitorHtmlChanges];

        for (const file of files) {
            if (file.endsWith('.js')) {
                const path = `${directory}/${file}`;
                const scriptContent = await FileSystem.readAsStringAsync(path);
                scripts.push(scriptContent);
            }
            }

        return scripts;
    } catch (error) {
        console.error('Error loading scripts:', error);
        return [];
    }
}
