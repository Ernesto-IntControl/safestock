import React, { useEffect, useState } from 'react';
import { authService, userService } from '../services/api';
import { Loader, ErrorMessage } from '../components/UIComponents';
import RoleGuard from '../components/RoleGuard';
import '../styles/UserManagement.css';

const UserManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ role: '' });

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
      await fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setFetching(true);
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de récupérer les utilisateurs');
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;

    try {
      await userService.deleteUser(id);
      setSuccess('Utilisateur supprimé avec succès');
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEditRole = (user) => {
    setEditingUser(user.id);
    setEditFormData({ role: user.role });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({ role: '' });
  };

  const handleUpdateRole = async (userId) => {
    try {
      await userService.updateUserRole(userId, editFormData.role);
      setSuccess('Rôle mis à jour avec succès');
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: editFormData.role } : user
        )
      );
      setEditingUser(null);
      setEditFormData({ role: '' });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du rôle');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

        <div className="users-table-section">
          <h2>Utilisateurs existants</h2>
          {fetching ? (
            <Loader />
          ) : (
            <div className="users-table-wrapper">
              {users.length === 0 ? (
                <p>Aucun utilisateur trouvé.</p>
              ) : (
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Créé le</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.nom}</td>
                        <td>{user.email}</td>
                        <td>
                          {editingUser === user.id ? (
                            <select
                              value={editFormData.role}
                              onChange={(e) => setEditFormData({ role: e.target.value })}
                              className="role-select"
                            >
                              <option value="Magasinier">Magasinier</option>
                              <option value="Superviseur">Superviseur</option>
                              <option value="Administrateur">Administrateur</option>
                            </select>
                          ) : (
                            user.role
                          )}
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          {editingUser === user.id ? (
                            <div className="edit-actions">
                              <button
                                className="btn-primary"
                                onClick={() => handleUpdateRole(user.id)}
                              >
                                Sauvegarder
                              </button>
                              <button
                                className="btn-secondary"
                                onClick={handleCancelEdit}
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <div className="edit-actions">
                              <button
                                className="btn-edit"
                                onClick={() => handleEditRole(user)}
                              >
                                Modifier rôle
                              </button>
                              <button
                                className="btn-danger"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                Supprimer
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
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