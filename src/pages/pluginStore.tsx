import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Dimensions, Text, View } from 'react-native';
import * as api from "../plugins/services/pluginsApi";
import NavBar from '../components/storeNavBar';
import { Plugin } from '../types/plugin';

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

    useEffect(() => {
        const fetchPlugins = async () => {
            const plugins = await api.getPlugins(0, 10);
            setPlugins(filterByCategory(plugins, categoriesFilter));
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
                                <View key={plugin.plugin_id}>
                                    <Text>{plugin.plugin_name}</Text>
                                    <Text>{plugin.downloads}</Text>
                                </View>
                            ))
                        }
                    </PluginsListContainer>
                )
            }
        </>
    )
}

export default PluginStore;