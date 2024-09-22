import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as api from "../plugins/services/pluginsApi";
import NavBar from '../components/storeNavBar';
import { Plugin } from '../types/plugin';
import PluginCard from '../components/pluginCard';
import { downloadPlugin } from '../plugins/scripts/downloadPlugin';
import { loadPlugins } from '../plugins/scripts/pluginsLoader';
import { addPluginResources } from '../redux/slices/pluginResourcesSlice';

const { width, height } = Dimensions.get('window');

const PluginsListContainer = styled(ScrollView)`
    flex: 1;
    padding: 10px;
    background-color: ${props => props.theme.backgroundColor};
`;

const ClearSearchBtn = styled(TouchableOpacity)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    background-color: ${props => props.theme.tertiaryColor};
    border-radius: 5px;
`;

const ClearSearchBtnText = styled(Text)`
    color: ${props => props.theme.primaryColor};
    font-size: 14px;
`;

const FilterContainer = styled(View)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px 20px;
    margin-top: ${height * 0.15}px;
`;

const filterByCategory = (plugins: Plugin[], categories: string[]) => {
    if(categories.length === 0) return plugins;
    return plugins.filter((plugin) => plugin.categories.some((category) => categories.includes(category)));
}

const PluginStore = () => {
    const theme = useTheme();
    const [plugins, setPlugins] = useState([] as Plugin[]);
    const [loading, setLoading] = useState(true);
    const [categoriesFilter, setCategoriesFilter] = useState([] as string[]);
    const [dowloading, setDownloading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchPlugins();
    }, []);

    const fetchPlugins = async () => {
        const plugins = await api.getPlugins(0, 10);
        setPlugins(filterByCategory(plugins, categoriesFilter));
        await loadPlugins(dispatch, addPluginResources);
        setLoading(false);
    }

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
        downloadPlugin(plugin.bucket_url, plugin.plugin_id).then(() => reloadPlugins());
    }

    const handleClearFilters = async () => {
        setCategoriesFilter([]);
        await fetchPlugins();
    }

    const reloadPlugins = async () => {
        setDownloading(false);
        await loadPlugins(dispatch, addPluginResources);
    }

    return (
        <View style={{backgroundColor: theme.backgroundColor, flex:1}}>
            <NavBar handleSearch={handleSearch} />
            <FilterContainer>
                <ClearSearchBtn onPress={handleClearFilters}>
                    <ClearSearchBtnText>Clear Filters</ClearSearchBtnText>
                </ClearSearchBtn>
            </FilterContainer>
            {
                loading ? (
                    <ActivityIndicator size="large" color={theme.tertiaryColor} />
                ) : (
                    <PluginsListContainer contentContainerStyle={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}>
                        {
                            plugins.length === 0 ? (
                                <Text style={{color: theme.primaryColor, fontSize: 14}}>No plugins found</Text>
                            ) : (
                                plugins.map((plugin) => (
                                    <PluginCard key={plugin.plugin_id} plugin={plugin} handleDownload={handleDownloadPlugin} downloading={dowloading} />
                                ))
                            )
                        }
                    </PluginsListContainer>
                )
            }
        </View>
    )
}

export default PluginStore;