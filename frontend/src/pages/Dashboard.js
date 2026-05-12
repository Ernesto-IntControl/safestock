import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Boxes,
  CheckCircle2,
  Clock3,
  Package,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { alertService, reportService } from '../services/api';
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
          ...expirationRes.data.map((alert) => ({ ...alert, type: 'Peremption proche' })),
          ...expiredRes.data.map((alert) => ({ ...alert, type: 'Perime' })),
          ...lowStockRes.data.map((alert) => ({ ...alert, type: 'Stock faible' }))
        ]);
      } catch (error) {
        console.error('Erreur lors du chargement du tableau de bord:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <div className="loader">Chargement...</div>;

  const cards = [
    { label: 'Produits', value: stats?.totalProducts || 0, icon: Package, tone: 'blue' },
    { label: 'Unites en stock', value: stats?.totalStock || 0, icon: Boxes, tone: 'green' },
    { label: 'Perimes', value: stats?.expiredCount || 0, icon: Clock3, tone: 'orange' },
    { label: 'Critiques', value: stats?.criticalCount || 0, icon: AlertTriangle, tone: 'red' }
  ];

  const alertIcon = (type) => {
    if (type === 'Perime') return AlertTriangle;
    if (type === 'Peremption proche') return Clock3;
    return TrendingDown;
  };

  return (
    <div className="dashboard-container page-shell">
      <div className="page-hero glass-panel dashboard-hero">
        <div>
          <p className="eyebrow">Vue operationnelle</p>
          <h1>Tableau de bord</h1>
          <p className="page-description">
            Bienvenue, <strong>{user?.nom}</strong>. Votre role: <span className="role-badge">{user?.role}</span>
          </p>
        </div>
        <div className="hero-signal">
          <CheckCircle2 size={22} />
          Systeme actif
        </div>
      </div>

      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className={`stat-card stat-${tone}`}>
            <div className="stat-icon"><Icon size={25} /></div>
            <div className="stat-info">
              <div className="stat-number">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-body">
        <section className="dashboard-panel glass-panel">
          <div className="section-header">
            <h2><Bell size={20} /> Alertes recentes</h2>
            <Link to="/alerts" className="view-all">Voir plus <ArrowRight size={15} /></Link>
          </div>

          <div className="alerts-list">
            {alerts.length > 0 ? (
              alerts.slice(0, 8).map((alert, idx) => {
                const Icon = alertIcon(alert.type);
                return (
                  <div key={`${alert.type}-${idx}`} className={`alert-item ${alert.type.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="alert-badge"><Icon size={20} /></div>
                    <div className="alert-content">
                      <div className="alert-product">{alert.nom || alert.produit?.nom}</div>
                      <div className="alert-type">{alert.type}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <CheckCircle2 size={20} />
                Aucune alerte actuellement
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-panel glass-panel">
          <div className="section-header">
            <h2><TrendingUp size={20} /> Mouvements recents</h2>
            <Link to="/stock" className="view-all">Voir tout <ArrowRight size={15} /></Link>
          </div>

          {stats?.recentMovements?.length > 0 ? (
            <div className="movements-table">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Type</th>
                    <th>Quantite</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentMovements.slice(0, 6).map((movement, idx) => (
                    <tr key={`${movement.id || movement.date}-${idx}`}>
                      <td className="product-name">{movement.lot?.produit?.nom || 'N/A'}</td>
                      <td>
                        <span className={`type-badge ${movement.type.toLowerCase()}`}>{movement.type}</span>
                      </td>
                      <td>{movement.quantite}</td>
                      <td>{new Date(movement.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">Aucun mouvement recent</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
