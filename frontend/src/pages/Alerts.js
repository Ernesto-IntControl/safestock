import React, { useEffect, useState } from 'react';
import { Bell, RotateCcw } from 'lucide-react';
import { EmptyState, ErrorMessage, Loader } from '../components/UIComponents';
import { alertService } from '../services/api';
import '../styles/Alerts.css';

const Alerts = () => {
  const [expirationAlerts, setExpirationAlerts] = useState([]);
  const [expiredProducts, setExpiredProducts] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('expiration');

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const [expirationRes, expiredRes, lowStockRes] = await Promise.all([
        alertService.getExpirationAlerts(),
        alertService.getExpiredProducts(),
        alertService.getLowStockAlerts()
      ]);

      setExpirationAlerts(expirationRes.data);
      setExpiredProducts(expiredRes.data);
      setLowStockAlerts(lowStockRes.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des alertes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="alerts-page">
      <div className="page-hero glass-panel">
        <div>
          <p className="eyebrow">Surveillance</p>
          <h1>Alertes</h1>
          <p className="page-description">Suivez les produits sensibles, perimes ou en stock faible.</p>
        </div>
        <Bell size={30} />
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      <div className="alerts-tabs">
        <button className={`tab ${activeTab === 'expiration' ? 'active' : ''}`} onClick={() => setActiveTab('expiration')}>
          Peremption proche ({expirationAlerts.length})
        </button>
        <button className={`tab ${activeTab === 'expired' ? 'active' : ''}`} onClick={() => setActiveTab('expired')}>
          Produits perimes ({expiredProducts.length})
        </button>
        <button className={`tab ${activeTab === 'low-stock' ? 'active' : ''}`} onClick={() => setActiveTab('low-stock')}>
          Stock faible ({lowStockAlerts.length})
        </button>
      </div>

      <div className="alerts-content">
        {activeTab === 'expiration' && (
          <div className="alerts-list">
            <h2>Produits approchant de la peremption</h2>
            {expirationAlerts.length > 0 ? (
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantite</th>
                    <th>Date production</th>
                    <th>Date expiration</th>
                  </tr>
                </thead>
                <tbody>
                  {expirationAlerts.map((alert) => (
                    <tr key={alert.id} className="alert-warning">
                      <td>{alert.produit.nom}</td>
                      <td>{alert.quantite}</td>
                      <td>{new Date(alert.dateProduction).toLocaleDateString()}</td>
                      <td>{new Date(alert.dateExpiration).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun produit proche de la peremption" />
            )}
          </div>
        )}

        {activeTab === 'expired' && (
          <div className="alerts-list">
            <h2>Produits perimes</h2>
            {expiredProducts.length > 0 ? (
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantite</th>
                    <th>Date production</th>
                    <th>Date expiration</th>
                  </tr>
                </thead>
                <tbody>
                  {expiredProducts.map((alert) => (
                    <tr key={alert.id} className="alert-danger">
                      <td>{alert.produit.nom}</td>
                      <td>{alert.quantite}</td>
                      <td>{new Date(alert.dateProduction).toLocaleDateString()}</td>
                      <td>{new Date(alert.dateExpiration).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun produit perime" />
            )}
          </div>
        )}

        {activeTab === 'low-stock' && (
          <div className="alerts-list">
            <h2>Stock faible</h2>
            {lowStockAlerts.length > 0 ? (
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantite</th>
                    <th>Seuil</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockAlerts.map((alert) => (
                    <tr key={alert.produitId} className="alert-info">
                      <td>{alert.nom}</td>
                      <td>{alert.quantite}</td>
                      <td>{alert.seuil}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState message="Aucun stock faible" />
            )}
          </div>
        )}
      </div>

      <button onClick={loadAlerts} className="btn-refresh">
        <RotateCcw size={17} /> Actualiser
      </button>
    </div>
  );
};

export default Alerts;
