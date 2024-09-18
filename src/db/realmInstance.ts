import Realm from 'realm';
import { Template } from './schemas/template';

let realmInstance = null;

export const getRealmInstance = async () => {
    // Realm.deleteFile({ schema: [] });  
    if (!realmInstance) {
        realmInstance = await Realm.open({
            schema: [Template],
            schemaVersion: 1, 
        });
    }

    return realmInstance;
};