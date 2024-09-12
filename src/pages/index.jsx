import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text } from 'react-native';
import WebViewComponent from '../components/webView';
import { loadPlugins } from '../plugins/scripts/pluginsLoader';
import { downloadPlugin } from '../plugins/scripts/downloadPlugin';
import { useDispatch } from 'react-redux';
import { addPluginResources } from '../redux/slices/pluginResourcesSlice';


export default function BskyPage() {
    const [pluginsList, setPluginsList] = useState([]);
    const [loaded, setLoaded] = useState(false);
    // const [downloaded, setDownloaded] = useState(false);
    const webViewRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadPlugins_ = async () => {
            // if(!downloaded) { // Test only
            //     await downloadPlugin('pluginDefault');
            //     setDownloaded(true);
            // }
            const plugins = await loadPlugins(dispatch, addPluginResources);
            setPluginsList(plugins);
            setLoaded(true);
        };

        loadPlugins_();
    }, []);


    return (
        <View style={styles.container}>
            {
                loaded
                    ? <WebViewComponent plugins={pluginsList} webViewRef={webViewRef} />
                    : <Text>Loading...</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});
