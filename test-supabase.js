const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jvumaoqhjcsbeagmtqff.supabase.co';
const supabaseKey = 'sb_publishable_OOIWiSg_5D_8vwcwHmF4ew_Eyx6DuyQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Menguji koneksi ke Supabase...");
  try {
    // Kita coba panggil API auth secara ringan
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log("❌ Koneksi Gagal:", error.message);
    } else {
      console.log("✅ Sukses! Aplikasi Anda berhasil terhubung dengan proyek Supabase.");
    }
  } catch (err) {
    console.error("❌ Terjadi kesalahan jaringan:", err.message);
  }
}

testConnection();
