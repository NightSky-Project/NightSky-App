// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Substitua com sua URL e chave de API do Supabase
const supabaseUrl = 'https://<sua-supabase-url>.supabase.co';
const supabaseKey = '<sua-chave-publica>';
export const supabase = createClient(supabaseUrl, supabaseKey);
