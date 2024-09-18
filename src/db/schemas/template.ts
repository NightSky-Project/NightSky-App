import Realm from 'realm';

class Template extends Realm.Object {
    static schema: { name: string; properties: { id: string; title: string; }; primaryKey: string; };
}
Template.schema = {
    name: 'Task',
    properties: {
        id: 'string',
        title: 'string',
    },
    primaryKey: 'id',
};


export { Template };