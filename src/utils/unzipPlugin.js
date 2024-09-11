import { unzip } from 'react-native-zip-archive';

async function unzipPlugin(pluginPath, extractPath) {
    return await unzip(pluginPath, extractPath).catch((error) => {
        console.error('Error during unzip operation:', error);
        return null;
    });
}

export default unzipPlugin;