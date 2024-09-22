import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Plugin } from "../types/plugin";
import { Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { height } = Dimensions.get('window');

const PluginCardContainer = styled(View)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px;
    width: 90%;
    height: ${height * 0.15}px;
    margin: 10px;
    border-radius: 10px;
    background-color: ${props => props.theme.backgroundColor};
    border: 1px solid ${props => props.theme.tertiaryColor};
`;

const PluginTitle = styled(Text)`
    color: ${props => props.theme.primaryColor};
    font-size: 18px;
    font-weight: bold;
`;

const PluginDescription = styled(Text)`
    color: ${props => props.theme.primaryColor};
    font-size: 14px;
`;

const CategoriesContainer = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
`;

const Category = styled(Text)`
    color: ${props => props.theme.primaryColor};
    font-size: 12px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid ${props => props.theme.tertiaryColor};
    align-items: center;
    justify-content: center;
    display: flex;
    padding: 3px;
    text-align: center;
`;

const DownloadBtnContainer = styled(View)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0px 5px;
`;

const DownloadBtn = styled(TouchableOpacity)`

`;

const PluginCard = ({ plugin, handleDownload, downloading }: { plugin: Plugin, handleDownload: (plugin: Plugin) => Promise<boolean>, downloading: boolean }) => {
    const { plugins } = useSelector((state: any) => state.pluginsActive);
    const [pluginDownloading, setPluginDownloading] = useState('');

    const handleDownloadPlugin = async (plugin: Plugin) => {
        setPluginDownloading(plugin.plugin_name);
        handleDownload(plugin);
    }

    const isUpdateAvailable = (installedVersion: string, listedVersion: string) => {
        if(!installedVersion || !listedVersion) return false;
        const installed = Number(installedVersion)
        const listed = Number(listedVersion)
        if(installed < listed) return true;
        return false;
    }

    const installedPlugin = plugins.find((p: any) => p.pluginName === plugin.plugin_name);
    const updateAvailable = installedPlugin && isUpdateAvailable(installedPlugin.pluginVersion, plugin.version.toString());

    return (
        <PluginCardContainer>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <PluginTitle>{plugin.plugin_name}</PluginTitle>
                    <PluginTitle style={{ color: 'gray', fontSize: 16, marginLeft: 10 }}>v{plugin.version}</PluginTitle>
                </View>
                <DownloadBtnContainer>
                    {
                        installedPlugin ? 
                        updateAvailable ? 
                        <DownloadBtn onPress={() => handleDownloadPlugin(plugin)}>
                            {
                                (pluginDownloading === plugin.plugin_name && downloading) ? 
                                <MaterialIcons name="hourglass-empty" size={24} color="black" /> :
                                <FontAwesome name="refresh" size={24} color="black" />
                            }
                        </DownloadBtn> :
                        <AntDesign name="check" size={24} color="green" /> :
                        <DownloadBtn onPress={() => handleDownloadPlugin(plugin)}>
                            {
                                (pluginDownloading === plugin.plugin_name && downloading) ? 
                                <MaterialIcons name="hourglass-empty" size={24} color="black" /> :
                                <Feather name="download" size={24} color="black" />
                            }
                        </DownloadBtn>
                    }
                </DownloadBtnContainer>
            </View>
            <CategoriesContainer>
                {plugin.categories.map((category, index) => (
                    <Category key={index}>{category}</Category>
                ))}
            </CategoriesContainer>
            <PluginDescription>Downloads: {plugin.downloads}</PluginDescription>
        </PluginCardContainer>
    );
}

export default PluginCard;