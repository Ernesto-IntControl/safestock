import React, { useState } from 'react';
import { authService } from '../services/api';
import { Loader, ErrorMessage } from '../components/UIComponents';
import RoleGuard from '../components/RoleGuard';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'Magasinier'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(
        formData.nom,
        formData.email,
        formData.motDePasse,
        formData.role
      );
      setSuccess('Utilisateur créé avec succès');
      setFormData({ nom: '', email: '', motDePasse: '', role: 'Magasinier' });
      setShowForm(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard requiredRoles={['Administrateur']}>
      <div className="user-management">
        <h1>Gestion des utilisateurs</h1>

        {error && (
          <ErrorMessage 
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {success && (
          <div className="success-message">{success}</div>
        )}

        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Créer un utilisateur
        </button>

        {showForm && (
          <div className="form-container">
            <h2>Créer un nouvel utilisateur</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mot de passe</label>
                <input
                  type="password"
                  value={formData.motDePasse}
                  onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rôle</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Magasinier">Magasinier</option>
                  <option value="Superviseur">Superviseur</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Création...' : 'Créer'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="users-info">
          <h2>Rôles disponibles</h2>
          <div className="roles-grid">
            <div className="role-card">
              <h3>Administrateur</h3>
              <p>Accès complet au système</p>
              <ul>
                <li>Gestion des utilisateurs</li>
                <li>Gestion des produits (CRUD)</li>
                <li>Gestion du stock</li>
                <li>Accès aux alertes</li>
                <li>Rapports complets</li>
              </ul>
            </div>
            <div className="role-card">
              <h3>Superviseur</h3>
              <p>Accès en lecture seule</p>
              <ul>
                <li>Consultation des produits</li>
                <li>Consultation du stock</li>
                <li>Consultation des alertes</li>
                <li>Rapports consultables</li>
              </ul>
            </div>
            <div className="role-card">
              <h3>Magasinier</h3>
              <p>Gestion du stock</p>
              <ul>
                <li>Consultation des produits</li>
                <li>Entrées/Sorties de stock</li>
                <li>Consultation des alertes</li>
                <li>Scan de codes-barres</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default UserManagement;