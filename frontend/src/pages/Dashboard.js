import React, { useState, useEffect } from 'react';
import { reportService, alertService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    expiredCount: 0,
    criticalCount: 0,
    recentMovements: []
  });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, expirationRes, expiredRes, lowStockRes] = await Promise.all([
        reportService.getDashboardStats(),
        alertService.getExpirationAlerts(),
        alertService.getExpiredProducts(),
        alertService.getLowStockAlerts()
      ]);

      setStats(statsRes.data || {
        totalProducts: 0,
        totalStock: 0,
        expiredCount: 0,
        criticalCount: 0,
        recentMovements: []
      });
      setAlerts([
        ...expirationRes.data.map(a => ({ ...a, type: 'Péremption proche' })),
        ...expiredRes.data.map(a => ({ ...a, type: 'Périmé' })),
        ...lowStockRes.data.map(a => ({ ...a, type: 'Stock faible' }))
      ]);
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loader">Chargement...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Tableau de bord</h1>
          <p className="welcome-text">Bienvenue, <strong>{user?.nom}</strong> • <span className="role-badge">{user?.role}</span></p>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Statistiques principales */}
        <div className="stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.totalProducts || 0}</div>
              <div className="stat-label">Produits</div>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.totalStock || 0}</div>
              <div className="stat-label">Unités en stock</div>
            </div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-icon">⏰</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.expiredCount || 0}</div>
              <div className="stat-label">Périmés</div>
            </div>
          </div>
          <div className="stat-card stat-red">
            <div className="stat-icon">🚨</div>
            <div className="stat-info">
              <div className="stat-number">{stats?.criticalCount || 0}</div>
              <div className="stat-label">Critiques</div>
            </div>
          </div>
        </div>

        <div className="dashboard-body">
          {/* Section alertes */}
          <div className="alerts-section">
            <div className="section-header">
              <h2>🔔 Alertes récentes</h2>
              <a href="/alerts" className="view-all">Voir plus</a>
            </div>
            <div className="alerts-list">
              {alerts.length > 0 ? (
                alerts.slice(0, 8).map((alert, idx) => (
                  <div key={idx} className={`alert-item alert-${alert.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="alert-badge">
                      {alert.type === 'Périmé' ? '⚠️' : alert.type === 'Péremption proche' ? '⏱️' : '📉'}
                    </div>
                    <div className="alert-content">
                      <div className="alert-product">{alert.nom || alert.produit?.nom}</div>
                      <div className="alert-type">{alert.type}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>✓ Aucune alerte actuellement</p>
                </div>
              )}
            </div>
          </div>

          {/* Section mouvements */}
          <div className="movements-section">
            <div className="section-header">
              <h2>📈 Mouvements récents</h2>
              <a href="/stock" className="view-all">Voir tout</a>
            </div>
            {stats?.recentMovements && stats.recentMovements.length > 0 ? (
              <div className="movements-table">
                <table>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Type</th>
                      <th>Quantité</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentMovements.slice(0, 6).map((mv, idx) => (
                      <tr key={idx} className={`movement-${mv.type.toLowerCase()}`}>
                        <td className="product-name">{mv.lot?.produit?.nom || 'N/A'}</td>
                        <td className="movement-type">
                          <span className={`type-badge ${mv.type.toLowerCase()}`}>{mv.type}</span>
                        </td>
                        <td className="quantity">{mv.quantite}</td>
                        <td className="date">{new Date(mv.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>Aucun mouvement récent</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;