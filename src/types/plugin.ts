export type Plugin = {
    plugin_id: bigint;
    created_at: string;
    plugin_name: string;
    repo_url: string;
    bucket_url: string;
    owner: string; 
    categories: string[]; 
    updated_at: string; 
    downloads: number;
    version: number;
    uuid: string;
};