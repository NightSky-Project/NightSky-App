import * as FileSystem from 'expo-file-system';
import getLocalStorageData from '../default/getLocalStorage';
import monitorHtmlChanges from '../default/monitorHtmlChanges';
import getWebViewLogs from '../default/getWebViewLogs';
import changeLogoColor from '../default/addStoreButton';
import { addActivePlugin } from '../../redux/slices/pluginsActiveSlice';
import addStoreButton from '../default/addStoreButton';

/**
 * Loads plugins from the plugins directory and returns a list of plugins with their scripts, styles, and assets.
 * @returns {Promise<Array>} List of plugins with their scripts, styles, and assets
 */
export async function loadPlugins(dispatch, addPluginResources) {
    const PLUGINS_DIRECTORY = FileSystem.documentDirectory + 'plugins';
    await FileSystem.deleteAsync(PLUGINS_DIRECTORY, { idempotent: true }); // TEST ONLY - Reset plugins directory

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

                        // Collect scripts, styles, and assets based on the custom manifest
                        const scripts = [];
                        const styles = [];
                        const assets = {
                            pluginSlug: manifest.slug,
                            resources: []
                        };

                        if (manifest.content) {
                            // Load scripts
                            if (manifest.content.scripts) {
                                for (const jsFile of manifest.content.scripts) {
                                    const scriptPath = `${pluginPath}/${jsFile}`;
                                    try {
                                        const scriptContent = await FileSystem.readAsStringAsync(scriptPath);
                                        scripts.push(`(function() {\n${scriptContent}\n})();`);
                                    } catch (error) {
                                        console.error(`Error loading script: ${jsFile}`, error);
                                    }
                                }
                            }
                            // Load styles
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

                            // Load assets
                            if (manifest.content.resources) {
                                for (const assetFile of manifest.content.resources) {
                                    const assetPath = `${pluginPath}/${assetFile}`;
                                    try {
                                        const assetUri = assetPath;
                                        const assetId = assetFile.split('/').pop();
                                        assets.resources.push({ resource: assetId, uri: assetUri });

                                    } catch (error) {
                                        console.error(`Error loading asset: ${assetFile}`, error);
                                    }
                                }

                                dispatch(addPluginResources(assets));
                            }
                        }

                        dispatch(addActivePlugin({ pluginSlug: manifest.slug, pluginName: manifest.name, pluginVersion: manifest.version_code, pluginId: manifest.id }));
                        plugins.push({ name: manifest.name, scripts, styles });
                    }
                } catch (error) {
                    console.error(`Error loading plugin from ${folder}:`, error);
                }
            }
        }

        // Include default scripts
        plugins.push({ name: 'Default', scripts: [getWebViewLogs, getLocalStorageData, monitorHtmlChanges, addStoreButton], styles: [] });
        console.info('Plugins loaded');

        return plugins;
    } catch (error) {
        console.error('Error loading plugins:', error);
        return [];
    }
}
