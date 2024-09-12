import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const pluginResourcesSlice = createSlice({
    name: 'pluginResources',
    initialState: {
        resources: []
    },
    reducers: {
        addPluginResources: (state, action) => {
            // Validate the action payload
            if (!action.payload.pluginSlug|| !action.payload.resources || !Array.isArray(action.payload.resources) || action.payload.resources.length === 0
                || !action.payload.resources.every(resource => resource.resource && resource.uri)) {
                throw new Error('Invalid plugin resource');
            }
            state.resources.push(action.payload);
        }
    }
});


export const { addPluginResources } = pluginResourcesSlice.actions;
export default pluginResourcesSlice.reducer;