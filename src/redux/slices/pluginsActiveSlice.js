import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const pluginsActive = createSlice({
    name: 'pluginsActive',
    initialState: {
        plugins: []
    },
    reducers: {
        addActivePlugin: (state, action) => {
            if (!action.payload.pluginSlug || !action.payload.pluginName || !action.payload.pluginVersion || !action.payload.pluginId) {
                throw new Error('Invalid plugin');
            }
            const existingPluginIndex = state.plugins.findIndex(plugin => plugin.pluginId === action.payload.pluginId);
            if (existingPluginIndex !== -1) {
                state.plugins[existingPluginIndex] = action.payload;
            } else {
                state.plugins.push(action.payload);
            }
        }
    }
});

export const { addActivePlugin } = pluginsActive.actions;
export default pluginsActive.reducer;