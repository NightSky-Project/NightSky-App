import { configureStore } from '@reduxjs/toolkit'
import pluginResourcesReducer from './slices/pluginResourcesSlice'


export default configureStore({
    reducer: {
        pluginResources: pluginResourcesReducer
    }
})