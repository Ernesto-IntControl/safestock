import React, { useState, useEffect } from 'react';
import { reportService } from '../services/api';
import '../styles/Reports.css';

const Reports = () => {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [inventoryRes, movementsRes] = await Promise.all([
        reportService.getInventoryReport(),
        reportService.getMovementStats()
      ]);
      setInventory(inventoryRes.data);
      setMovements(movementsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports">
      <h1>Rapports</h1>
      <button onClick={handlePrint} className="btn-primary">Imprimer</button>

      <div className="report-section">
        <h2>Statistiques des mouvements</h2>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{movements?.totalEntries}</div>
            <div className="stat-name">Entrées</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{movements?.quantityEntered}</div>
            <div className="stat-name">Quantité entrée</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{movements?.totalRemovals}</div>
            <div className="stat-name">Sorties</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{movements?.quantityRemoved}</div>
            <div className="stat-name">Quantité sortie</div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Rapport d'inventaire</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Catégorie</th>
              <th>Code-barres</th>
              <th>Quantité totale</th>
              <th>Nombre de lots</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.nom}</td>
                <td>{item.categorie}</td>
                <td>{item.codeBarre}</td>
                <td>{item.quantiteTotal}</td>
                <td>{item.nombreLots}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;