import { configureStore } from '@reduxjs/toolkit'
import pluginResourcesReducer from './slices/pluginResourcesSlice'
import pluginsActiveReducer from './slices/pluginsActiveSlice'


export default configureStore({
    reducer: {
        pluginResources: pluginResourcesReducer,
        pluginsActive: pluginsActiveReducer
    }
})