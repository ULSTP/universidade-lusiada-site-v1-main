import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configuração para uso no servidor
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      // Adicione os tipos das tabelas aqui se necessário
    }
  }
} 