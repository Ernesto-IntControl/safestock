import React, { useEffect, useState } from 'react';
import { Printer, TrendingDown, TrendingUp } from 'lucide-react';
import { reportService } from '../services/api';
import '../styles/Reports.css';

const Reports = () => {
  const [inventory, setInventory] = useState([]);
  const [movements, setMovements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadReports();
  }, []);

  if (loading) return <div className="loader">Chargement...</div>;

  return (
    <div className="reports">
      <div className="page-hero glass-panel">
        <div>
          <p className="eyebrow">Analyse</p>
          <h1>Rapports</h1>
          <p className="page-description">Consultez les mouvements et l'etat d'inventaire.</p>
        </div>
        <button onClick={() => window.print()} className="btn-primary"><Printer size={18} /> Imprimer</button>
      </div>

      <div className="report-section">
        <h2>Statistiques des mouvements</h2>
        <div className="stats-grid reports-stats">
          <div className="stat-box">
            <TrendingUp size={20} />
            <div className="stat-value">{movements?.totalEntries}</div>
            <div className="stat-name">Entrees</div>
          </div>
          <div className="stat-box">
            <TrendingUp size={20} />
            <div className="stat-value">{movements?.quantityEntered}</div>
            <div className="stat-name">Quantite entree</div>
          </div>
          <div className="stat-box">
            <TrendingDown size={20} />
            <div className="stat-value">{movements?.totalRemovals}</div>
            <div className="stat-name">Sorties</div>
          </div>
          <div className="stat-box">
            <TrendingDown size={20} />
            <div className="stat-value">{movements?.quantityRemoved}</div>
            <div className="stat-name">Quantite sortie</div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Rapport d'inventaire</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Categorie</th>
              <th>Code-barres</th>
              <th>Quantite totale</th>
              <th>Nombre de lots</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
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
