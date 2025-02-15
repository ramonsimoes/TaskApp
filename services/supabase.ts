import "react-native-url-polyfill"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vbfokuiadnattsyxkjut.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZiZm9rdWlhZG5hdHRzeXhranV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NzMyNDEsImV4cCI6MjA1NTE0OTI0MX0.dFpI9U4M88vrbhHZ54hUJRYA40u5ndiuk-_uaPSAJxM";

export const supabase = createClient(supabaseUrl, supabaseKey);
