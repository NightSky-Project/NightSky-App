import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const pluginsActive = createSlice({
    name: 'pluginsActive',
    initialState: {
        plugins: []
    },
    reducers: {
        addActivePlugin: (state, action) => {
            if (!action.payload.pluginSlug || !action.payload.pluginName) {
                throw new Error('Invalid plugin');
            }
            state.plugins.push(action.payload);
        }
    }
});

export const { addActivePlugin } = pluginsActive.actions;
export default pluginsActive.reducer;