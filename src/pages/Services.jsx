import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Services() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: 'company-profile',
    budget: '',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setFormData({
        name: '', email: '', company: '', projectType: 'company-profile', budget: '', description: ''
      });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-5">
          <h1 className="hero-title mb-2" style={{ fontSize: '3rem' }}>Jasa Pembuatan <span className="text-gradient">Website</span></h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Kami membantu mewujudkan ide bisnis Anda menjadi sebuah website profesional dengan desain premium dan performa tinggi.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '3rem' }}>
          {submitted ? (
            <div className="text-center py-5">
              <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--success)' }}>
                <Send size={40} />
              </div>
              <h2 className="mb-2">Permintaan Berhasil Terkirim!</h2>
              <p className="text-muted mb-4">Tim kami akan segera menghubungi Anda melalui email untuk mendiskusikan proyek ini lebih lanjut.</p>
              <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Kirim Permintaan Lain</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Aktif</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
                </div>
              </div>
              
              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Nama Perusahaan / Bisnis</label>
                  <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Tipe Website</label>
                  <select name="projectType" value={formData.projectType} onChange={handleChange} className="form-input" required style={{ appearance: 'none', background: 'rgba(255,255,255,0.03) url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 1rem center / 12px' }}>
                    <option value="company-profile" style={{ color: '#000' }}>Company Profile</option>
                    <option value="ecommerce" style={{ color: '#000' }}>E-Commerce / Toko Online</option>
                    <option value="portfolio" style={{ color: '#000' }}>Portfolio Pribadi</option>
                    <option value="custom" style={{ color: '#000' }}>Custom Web App</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimasi Budget</label>
                <select name="budget" value={formData.budget} onChange={handleChange} className="form-input" required style={{ appearance: 'none', background: 'rgba(255,255,255,0.03) url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E") no-repeat right 1rem center / 12px' }}>
                  <option value="" style={{ color: '#000' }}>Pilih Estimasi Budget</option>
                  <option value="<5M" style={{ color: '#000' }}>Di bawah RM 1,500</option>
                  <option value="5M-15M" style={{ color: '#000' }}>RM 1,500 - RM 4,500</option>
                  <option value=">15M" style={{ color: '#000' }}>Di atas RM 4,500</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Proyek</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="5" placeholder="Ceritakan tentang kebutuhan website Anda..." required></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                <Send size={18} /> Kirim Permintaan
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
