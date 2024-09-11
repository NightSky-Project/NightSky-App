import * as FileSystem from 'expo-file-system';
import getLocalStorageData from '../plugins/default/getLocalStorage';
import monitorHtmlChanges from '../plugins/default/monitorHtmlChanges';


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
        if (!await checkDirectoryExists(PLUGINS_DIRECTORY)) {
            await FileSystem.makeDirectoryAsync(PLUGINS_DIRECTORY, { intermediates: true });
        }

        const pluginFolders = await FileSystem.readDirectoryAsync(PLUGINS_DIRECTORY);
        const plugins = [];

        for (const folder of pluginFolders) {
            const pluginPath = `${PLUGINS_DIRECTORY}/${folder}`;
            const manifestPath = `${pluginPath}/appmanifest.json`;

            try {
                const manifestExists = await checkDirectoryExists(manifestPath);

                if (manifestExists) {
                    const manifestContent = await FileSystem.readAsStringAsync(manifestPath);
                    const manifest = JSON.parse(manifestContent);

                    // Collect scripts and styles based on the custom manifest
                    const scripts = [];
                    const styles = [];

                    if (manifest.content_scripts) {
                        // Handle JavaScript files
                        if (manifest.content_scripts.js) {
                            for (const jsFile of manifest.content_scripts.js) {
                                const scriptPath = `${pluginPath}/${jsFile}`;
                                const scriptContent = await FileSystem.readAsStringAsync(scriptPath);
                                // Wrap the script in a self-contained function to avoid conflicts
                                scripts.push(`(function() {\n${scriptContent}\n})();`);
                            }
                        }

                        // Handle CSS files
                        if (manifest.content_scripts.css) {
                            for (const cssFile of manifest.content_scripts.css) {
                                const cssPath = `${pluginPath}/${cssFile}`;
                                const cssContent = await FileSystem.readAsStringAsync(cssPath);
                                styles.push(cssContent);
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

        // Include default scripts
        plugins.push({ name: 'Default', scripts: [getLocalStorageData, monitorHtmlChanges], styles: [] });
        console.log('Plugins loaded');

        return plugins;
    } catch (error) {
        console.error('Error loading plugins:', error);
        return [];
    }
}
