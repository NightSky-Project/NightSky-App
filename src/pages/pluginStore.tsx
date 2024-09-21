import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Dimensions, Text, View } from 'react-native';
import * as api from "../plugins/services/pluginsApi";
import NavBar from '../components/storeNavBar';
import { Plugin } from '../types/plugin';
import PluginCard from '../components/pluginCard';
import { downloadPlugin } from '../plugins/scripts/downloadPlugin';
import { loadPlugins } from '../plugins/scripts/pluginsLoader';
import { addPluginResources } from '../redux/slices/pluginResourcesSlice';

const { width, height } = Dimensions.get('window');

const PluginsListContainer = styled(View)`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 10px;
    margin-top: ${height * 0.15}px;
    background-color: ${props => props.theme.backgroundColor};
`;

const filterByCategory = (plugins: Plugin[], categories: string[]) => {
    if(categories.length === 0) return plugins;
    return plugins.filter((plugin) => plugin.categories.some((category) => categories.includes(category)));
}

const PluginStore = () => {
    const [plugins, setPlugins] = useState([] as Plugin[]);
    const [loading, setLoading] = useState(true);
    const [categoriesFilter, setCategoriesFilter] = useState([] as string[]);
    const [dowloading, setDownloading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchPlugins = async () => {
            const plugins = await api.getPlugins(0, 10);
            setPlugins(filterByCategory(plugins, categoriesFilter));
            await loadPlugins(dispatch, addPluginResources);
            setLoading(false);
        }

        fetchPlugins();
    }, []);

    const handleSearch = async (searchText: string) => {
        const plugins = await api.searchPlugins(searchText);
        setPlugins(filterByCategory(plugins, categoriesFilter));
    }

    const handleSelectCategory = async (category: string) => {
        if(categoriesFilter.includes(category)) {
            setCategoriesFilter(categoriesFilter.filter((c) => c !== category));
        } else {
            setCategoriesFilter([...categoriesFilter, category]);
        }
    }

    const handleDownloadPlugin = async (plugin: Plugin): Promise<boolean> => {
        return new Promise((resolve) => {
            Alert.alert(
                'Download Plugin',
                `Do you want to download ${plugin.plugin_name}?`,
                [
                    {
                        text: 'Cancel',
                        onPress: () => { setDownloading(false); resolve(false); },
                    },
                    {
                        text: 'OK',
                        onPress: () => { 
                            handleDownload(plugin);
                            resolve(true);
                        }
                    }
                ]
            );
        });
    }

    const handleDownload = async (plugin: Plugin) => {
        setDownloading(true);
        downloadPlugin(plugin.bucket_url, plugin.plugin_name).then(() => reloadPlugins());
    }

    const reloadPlugins = async () => {
        setDownloading(false);
        await loadPlugins(dispatch, addPluginResources);
    }

    return (
        <>
            <NavBar handleSearch={handleSearch} />
            {
                loading ? (
                    <Text>Loading...</Text>
                ) : (
                    <PluginsListContainer>
                        {
                            plugins.map((plugin) => (
                                <PluginCard key={plugin.plugin_id} plugin={plugin} handleDownload={handleDownloadPlugin} downloading={dowloading} />
                            ))
                        }
                    </PluginsListContainer>
                )
            }
        </>
    )
}

export default PluginStore;