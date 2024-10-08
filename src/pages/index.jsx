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
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={styles.container}>
            <Host>
                {
                    (loading || !pluginsLoaded) && (
                        <Portal>
                            <SplashScreen />
                        </Portal>
                    )
                }
                <WebViewComponent plugins={pluginsList}/>
            </Host>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
});
