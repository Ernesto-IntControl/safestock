import React, { useState, useEffect } from 'react';
import { reportService, alertService } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
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

      setStats(statsRes.data);
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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      <div className="welcome">Bienvenue, {user?.nom} ({user?.role})</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats?.totalProducts}</div>
          <div className="stat-label">Produits</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats?.totalStock}</div>
          <div className="stat-label">Unités en stock</div>
        </div>
        <div className="stat-card alert-warning">
          <div className="stat-number">{stats?.expiredCount}</div>
          <div className="stat-label">Produits périmés</div>
        </div>
        <div className="stat-card alert-critical">
          <div className="stat-number">{stats?.criticalCount}</div>
          <div className="stat-label">Produits critiques</div>
        </div>
      </div>

      <div className="alerts-section">
        <h2>Alertes récentes</h2>
        <div className="alerts-list">
          {alerts.length > 0 ? (
            alerts.slice(0, 10).map((alert, idx) => (
              <div key={idx} className={`alert-item alert-${alert.type.toLowerCase().replace(' ', '-')}`}>
                <span className="alert-type">{alert.type}</span>
                <span className="alert-product">{alert.nom || alert.produit?.nom}</span>
              </div>
            ))
          ) : (
            <p>Aucune alerte</p>
          )}
        </div>
      </div>

      <div className="movements-section">
        <h2>Mouvements récents</h2>
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
            {stats?.recentMovements?.map((mv, idx) => (
              <tr key={idx}>
                <td>{mv.lot.produit.nom}</td>
                <td>{mv.type}</td>
                <td>{mv.quantite}</td>
                <td>{new Date(mv.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;