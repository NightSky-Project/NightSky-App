import React, { useEffect, useRef, useState } from 'react';
import Constants from 'expo-constants';
import { StyleSheet, View, Text, Animated } from 'react-native';
import WebViewComponent from '../components/webView';
import { loadPlugins } from '../plugins/scripts/pluginsLoader';
import { downloadPlugin } from '../plugins/scripts/downloadPlugin';
import { useDispatch } from 'react-redux';
import { addPluginResources } from '../redux/slices/pluginResourcesSlice';
import SplashScreen from '../components/splashscreen';
import { Host, Portal } from 'react-native-paper-portal';

export default function BskyPage() {
    const [pluginsList, setPluginsList] = useState([]);
    const dispatch = useDispatch();
    const [pluginsLoaded, setPluginsLoaded] = useState(false);

    useEffect(() => {
        const loadPlugins_ = async () => {
            if(!pluginsLoaded) {
                const plugins = await loadPlugins(dispatch, addPluginResources);
                setPluginsList(plugins);
                setPluginsLoaded(true);
            }
        };

        loadPlugins_();
    }, []);

    if(!pluginsLoaded) {
        return (
            <Portal>
                <Host>
                    <SplashScreen />
                </Host>
            </Portal>
        );
    }

    return (
        <View style={styles.container}>
            <WebViewComponent plugins={pluginsList}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});
