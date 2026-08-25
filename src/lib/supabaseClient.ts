import { createClient } from '@supabase/supabase-js'

// Reemplaza estas dos cadenas con los datos reales de tu proyecto en Supabase
const supabaseUrl = 'https://lujkllkfcgtxubswpzsx.supabase.co' 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1amtsbGtmY2d0eHVic3dwenN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2MTk2OTksImV4cCI6MjEwMzE5NTY5OX0.ecNfoXQlCVFzfP5AS6ItceFiOZKBVC2YjnCfWkZBM9A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)