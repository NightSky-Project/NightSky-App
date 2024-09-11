import * as FileSystem from 'expo-file-system';

export default async function createPluginDirs() {
    const DOWNLOADS_DIR = FileSystem.documentDirectory + 'plugins/downloads';
    const PLUGINS_DIRECTORY = FileSystem.documentDirectory + 'plugins';

    await checkIfDirExists(DOWNLOADS_DIR).then(async (downloadsDirExists) => {
        if (!downloadsDirExists) {
            await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, { intermediates: true }).catch((error) => {
                console.error('Error creating downloads directory:', error);
            });
        }
    });

    await checkIfDirExists(PLUGINS_DIRECTORY).then(async (pluginsDirExists) => {
        if (!pluginsDirExists) {
            await FileSystem.makeDirectoryAsync(PLUGINS_DIRECTORY, { intermediates: true }).catch((error) => {
                console.error('Error creating plugins directory:', error);
            });
        }
    });
}

async function checkIfDirExists(directory) {
    try {
        const stats = await FileSystem.getInfoAsync(directory);
        return stats.exists === true && stats.isDirectory === true;
    } catch (error) {
        console.error('Error checking directory:', error);
        return false;
    }
}