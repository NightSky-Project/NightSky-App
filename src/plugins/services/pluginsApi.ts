import axios from 'axios';
import { Plugin } from '../../types/plugin';

const API_URL = 'nightsky-app-services.deno.dev';

const getPlugins = async (start: number, end: number): Promise<Plugin[]> => {
    const response = await axios.get(`https://${API_URL}/plugins?start=${start}&end=${end}`);
    return response.data;
}

const searchPlugins = async (query: string): Promise<Plugin[]> => {
    const response = await axios.get(`https://${API_URL}/plugins/search?query=${query}`);
    return response.data;
}

const getCategories = async (): Promise<string[]> => {
    const response = await axios.get(`https://${API_URL}/plugins/categories`);
    return response.data;
}

export { getPlugins, searchPlugins, getCategories };