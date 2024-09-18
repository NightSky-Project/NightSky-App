import Realm from 'realm';

let realmInstance = null;

export const getRealmInstance = async () => {
    // Realm.deleteFile({ schema: [] });  
    // if (!realmInstance) {
    //     realmInstance = await Realm.open({
    //         schema: [],
    //         schemaVersion: 1, 
    //     });
    // }

    return realmInstance;
};