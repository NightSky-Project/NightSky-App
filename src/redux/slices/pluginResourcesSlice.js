import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const pluginResourcesSlice = createSlice({
    name: 'pluginResources',
    initialState: {
        resources: []
    },
    reducers: {
        addPluginResources: (state, action) => {
            // Validate the action payload
            if (!action.payload.pluginSlug|| !action.payload.resources) {
                throw new Error('Invalid plugin resource');
            }
            state.resources.push(action.payload);
        }
    }
});


export const { addPluginResources } = pluginResourcesSlice.actions;
export default pluginResourcesSlice.reducer;