import React, { useEffect, useState } from 'react';
import { ShieldCheck, UserRound, KeyRound, Mail, Save } from 'lucide-react';
import { userService } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const [profile, setProfile] = useState(storedUser);
  const [formData, setFormData] = useState({
    nom: storedUser.nom || '',
    email: storedUser.email || '',
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfile(response.data);
        setFormData((prev) => ({
          ...prev,
          nom: response.data.nom,
          email: response.data.email
        }));
        localStorage.setItem('user', JSON.stringify(response.data));
        window.dispatchEvent(new Event('safestock:user-updated'));
      } catch (err) {
        setError(err.response?.data?.message || 'Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const payload = {
        nom: formData.nom,
        email: formData.email
      };

      if (formData.newPassword) {
        payload.currentPassword = formData.currentPassword;
        payload.newPassword = formData.newPassword;
      }

      const response = await userService.updateProfile(payload);
      setProfile(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.dispatchEvent(new Event('safestock:user-updated'));
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      setMessage('Profil mis a jour avec succes');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise a jour');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loader">Chargement du profil...</div>;
  }

  return (
    <div className="profile-page page-shell">
      <div className="page-hero glass-panel">
        <div>
          <p className="eyebrow">Compte utilisateur</p>
          <h1>Profil</h1>
          <p className="page-description">Gerez vos informations personnelles et securisez votre acces.</p>
        </div>
        <div className="profile-identity">
          <div className="profile-avatar">
            <UserRound size={30} />
          </div>
          <div>
            <strong>{profile.nom}</strong>
            <span>{profile.role}</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-summary glass-panel">
          <div className="summary-icon">
            <ShieldCheck size={26} />
          </div>
          <h2>Session active</h2>
          <div className="summary-list">
            <div>
              <span>Nom</span>
              <strong>{profile.nom}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{profile.role}</strong>
            </div>
          </div>
        </section>

        <section className="profile-form-card glass-panel">
          <h2>Modifier le profil</h2>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <div className="input-with-icon">
                <UserRound size={18} />
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="password-grid">
              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <div className="input-with-icon">
                  <KeyRound size={18} />
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <div className="input-with-icon">
                  <KeyRound size={18} />
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary icon-button" disabled={saving}>
              <Save size={18} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
