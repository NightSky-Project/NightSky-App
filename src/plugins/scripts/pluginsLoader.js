import * as FileSystem from 'expo-file-system';
import getLocalStorageData from '../default/getLocalStorage';
import monitorHtmlChanges from '../default/monitorHtmlChanges';
import getWebViewLogs from '../default/getWebViewLogs';


/**
 * Loads plugins from the plugins directory and returns a list of plugins with their scripts and styles.
 * @returns {Promise<Array>} List of plugins with their scripts and styles
 */
export async function loadPluginsFromDirectory() {
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

    try {
        const plugins = [];

        if (await checkDirectoryExists(PLUGINS_DIRECTORY)) {
            const pluginFolders = await FileSystem.readDirectoryAsync(PLUGINS_DIRECTORY);

            for (const folder of pluginFolders) {
                const pluginFolderContents = await FileSystem.readDirectoryAsync(`${PLUGINS_DIRECTORY}/${folder}`);
                const pluginPath = `${PLUGINS_DIRECTORY}/${folder}/${pluginFolderContents[0]}`;
                const manifestPath = `${pluginPath}/appmanifest.json`;

                try {
                    const manifestExists = await checkDirectoryExists(manifestPath);

                    if (manifestExists) {
                        const manifestContent = await FileSystem.readAsStringAsync(manifestPath);
                        const manifest = JSON.parse(manifestContent);

                        // Collect scripts and styles based on the custom manifest
                        const scripts = [];
                        const styles = [];

                        if (manifest.content) {
                            if (manifest.content.scripts) {
                                for (const jsFile of manifest.content.scripts) {
                                    const scriptPath = `${pluginPath}/${jsFile}`;
                                    try {
                                        const scriptContent = await FileSystem.readAsStringAsync(scriptPath);
                                        // Wrap the script in an IIFE to avoid polluting the global scope
                                        scripts.push(`(function() {\n`+ scriptContent + `\n})();`);
                                    } catch (error) {
                                        console.error(`Error loading script: ${jsFile}`, error);
                                    }
                                }
                            }

                            // Carregar estilos CSS conforme especificado no manifest
                            if (manifest.content.styles) {
                                for (const cssFile of manifest.content.styles) {
                                    const cssPath = `${pluginPath}/${cssFile}`;
                                    try {
                                        const cssContent = await FileSystem.readAsStringAsync(cssPath);
                                        styles.push(cssContent);
                                    } catch (error) {
                                        console.error(`Error loading style: ${cssFile}`, error);
                                    }
                                }
                            }
                        }


                        // Add the plugin's resources to the list
                        plugins.push({ name: manifest.name, scripts, styles });
                    }
                } catch (error) {
                    console.error(`Error loading plugin from ${folder}:`, error);
                }
            }
        }


        // Include default scripts
        plugins.push({ name: 'Default', scripts: [getLocalStorageData, monitorHtmlChanges, getWebViewLogs], styles: [] });
        console.log('Plugins loaded');

        return plugins;
    } catch (error) {
        console.error('Error loading plugins:', error);
        return [];
    }
}
