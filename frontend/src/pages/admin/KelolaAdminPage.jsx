import { useState, useEffect } from 'react';
import { Menu, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import './KelolaAdminPage.css';

function KelolaAdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: '', nip: '', email: '', nama: '', password: '', role: 'admin', is_active: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/users.php');
      const data = await res.json();
      if (data.success) {
        setAdmins(data.data);
      } else {
        showToast('error', 'Gagal mengambil data admin.');
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setFormData({ id: '', nip: '', email: '', nama: '', password: '', role: 'admin', is_active: 1 });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (admin) => {
    setFormData({
      id: admin.id,
      nip: admin.nip,
      email: admin.email,
      nama: admin.nama,
      password: '', // Kosongkan password untuk edit, hanya isi jika ingin mengubah
      role: admin.role,
      is_active: admin.is_active
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = 'http://localhost:8000/api/users.php';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        showToast('success', data.message);
        fetchAdmins();
        closeModal();
      } else {
        showToast('error', data.message || 'Terjadi kesalahan.');
      }
    } catch (error) {
      showToast('error', 'Kesalahan jaringan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus admin ini?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/users.php?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message);
        fetchAdmins();
      } else {
        showToast('error', data.message || 'Gagal menghapus admin.');
      }
    } catch (error) {
      showToast('error', 'Kesalahan jaringan.');
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`ka-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />

      <div className="ka-main">
        {/* Top Bar */}
        <header className="ka-topbar">
          <div className="topbar-left">
            <button
              className="topbar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={20} />
            </button>
          </div>
          <div className="topbar-right">
            <div className="topbar-profile">
              <div className="profile-avatar" style={{ background: localStorage.getItem('userRole') === 'superadmin' ? '#7c3aed' : '#2563eb' }}>
                {localStorage.getItem('userRole') === 'superadmin' ? 'SA' : 'A'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{localStorage.getItem('userRole') === 'superadmin' ? 'Super Admin' : 'Admin'}</span>
                <span className="profile-role">{localStorage.getItem('userRole') === 'superadmin' ? 'Root Access' : 'Administrator'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="ka-content">
          <div className="ka-page-header">
            <div>
              <h1 className="ka-page-title">Kelola Akun Admin</h1>
              <p className="ka-page-subtitle">Tambah, edit, atau hapus akun admin sistem.</p>
            </div>
            <button className="btn-tambah" onClick={openAddModal}>
              <Plus size={18} />
              Tambah Admin
            </button>
          </div>
          
          <div className="ka-table-card">
            <div className="ka-filters">
              <div className="ka-search-box">
                <Search size={16} color="#94a3b8" />
                <input 
                  type="text" 
                  placeholder="Cari NIP, Email, atau Nama..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="ka-table-wrapper">
              <table className="ka-table">
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>NIP</th>
                    <th>NAMA</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin, idx) => (
                      <tr key={admin.id}>
                        <td>{idx + 1}</td>
                        <td style={{ fontWeight: 500 }}>{admin.nip}</td>
                        <td>{admin.nama}</td>
                        <td style={{ color: '#64748b' }}>{admin.email}</td>
                        <td>
                          <span className={`role-badge role-${admin.role}`}>
                            {admin.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-status ${admin.is_active == 1 ? 'aktif' : 'non-aktif'}`}>
                            {admin.is_active == 1 ? 'Aktif' : 'Non-Aktif'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="table-actions">
                            <button className="btn-icon edit" onClick={() => openEditModal(admin)}>
                              <Edit2 size={15} />
                            </button>
                            <button className="btn-icon delete" onClick={() => handleDelete(admin.id)}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                        Tidak ada data admin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="ka-modal-overlay">
          <div className="ka-modal-content">
            <div className="ka-modal-header">
              <h2 className="ka-modal-title">{isEditMode ? 'Edit Admin' : 'Tambah Admin Baru'}</h2>
              <button className="ka-modal-close" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="ka-modal-body">
                <div className="form-group">
                  <label className="form-label">NIP</label>
                  <input 
                    type="text" 
                    className="form-input"
                    name="nip"
                    value={formData.nip}
                    onChange={handleInputChange}
                    placeholder="Masukkan NIP"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap</label>
                  <input 
                    type="text" 
                    className="form-input"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    placeholder="Masukkan Nama Lengkap"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan Email"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Password {isEditMode && <span style={{fontSize: 11, color: '#94a3b8', fontWeight: 'normal'}}>(Kosongkan jika tidak ingin mengubah)</span>}
                  </label>
                  <input 
                    type="password" 
                    className="form-input"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Masukkan Password"
                    required={!isEditMode} 
                  />
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Role</label>
                    <select 
                      className="form-input"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Status</label>
                    <select 
                      className="form-input"
                      name="is_active"
                      value={formData.is_active}
                      onChange={handleInputChange}
                    >
                      <option value="1">Aktif</option>
                      <option value="0">Non-Aktif</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="ka-modal-footer">
                <button type="button" className="ka-btn-outline" onClick={closeModal}>Batal</button>
                <button type="submit" className="ka-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <div className="toast-content">
              <span className="toast-title">{toast.type === 'success' ? 'Sukses' : 'Gagal'}</span>
              <span className="toast-message">{toast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KelolaAdminPage;
