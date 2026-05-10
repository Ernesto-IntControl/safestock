import React, { useState, useEffect } from 'react';
import { stockService, productService } from '../services/api';
import BarcodeScanner from '../components/BarcodeScanner';
import '../styles/Stock.css';

const StockWithScanning = () => {
  const [lots, setLots] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [formType, setFormType] = useState('entry');
  const [formData, setFormData] = useState({
    produitId: '',
    quantite: '',
    dateProduction: '',
    lotId: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [lotsRes, productsRes] = await Promise.all([
        stockService.getAllLots(),
        productService.getAllProducts()
      ]);
      setLots(lotsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = (barcode) => {
    const product = products.find(p => p.codeBarre === barcode);
    if (product) {
      setFormData({ ...formData, produitId: product.id });
      setShowScanner(false);
    } else {
      alert('Produit non trouvé');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formType === 'entry') {
        await stockService.addStockEntry({
          produitId: parseInt(formData.produitId),
          quantite: parseInt(formData.quantite),
          dateProduction: formData.dateProduction
        });
      } else {
        await stockService.removeStock({
          lotId: parseInt(formData.lotId),
          quantite: parseInt(formData.quantite)
        });
      }
      loadData();
      setShowForm(false);
      setFormData({ produitId: '', quantite: '', dateProduction: '', lotId: '' });
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div>Chargement...</div>;

  const canManage = ['Administrateur', 'Magasinier'].includes(user?.role);

  return (
    <div className="stock">
      <h1>Gestion du stock</h1>
      {canManage && (
        <div className="actions">
          <button onClick={() => { setFormType('entry'); setShowForm(true); }} className="btn-primary">
            + Entrée de stock
          </button>
          <button onClick={() => { setFormType('removal'); setShowForm(true); }} className="btn-primary">
            - Sortie de stock
          </button>
          <button onClick={() => setShowScanner(true)} className="btn-primary">
            📱 Scanner
          </button>
        </div>
      )}

      {showScanner && (
        <BarcodeScanner 
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showForm && (
        <div className="form-container">
          <h2>{formType === 'entry' ? 'Entrée de stock' : 'Sortie de stock'}</h2>
          <form onSubmit={handleSubmit}>
            {formType === 'entry' ? (
              <>
                <div className="form-group">
                  <label>Produit</label>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <select
                      value={formData.produitId}
                      onChange={(e) => setFormData({ ...formData, produitId: e.target.value })}
                      required
                    >
                      <option value="">Sélectionner un produit</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.nom}</option>
                      ))}
                    </select>
                    <button 
                      type="button" 
                      onClick={() => setShowScanner(true)}
                      className="btn-scanner"
                    >
                      📱
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Quantité</label>
                  <input
                    type="number"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date de production</label>
                  <input
                    type="date"
                    value={formData.dateProduction}
                    onChange={(e) => setFormData({ ...formData, dateProduction: e.target.value })}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Lot</label>
                  <select
                    value={formData.lotId}
                    onChange={(e) => setFormData({ ...formData, lotId: e.target.value })}
                    required
                  >
                    <option value="">Sélectionner un lot</option>
                    {lots.filter(l => l.quantite > 0).map(l => (
                      <option key={l.id} value={l.id}>
                        {l.produit.nom} - {l.quantite} unités
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantité à retirer</label>
                  <input
                    type="number"
                    value={formData.quantite}
                    onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="lots-section">
        <h2>Lots de stock</h2>
        <table className="lots-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Date production</th>
              <th>Date expiration</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {lots.map(lot => {
              const today = new Date();
              const expDate = new Date(lot.dateExpiration);
              let statut = 'OK';
              if (expDate < today) statut = 'Périmé';
              else if (expDate.getTime() - today.getTime() < 5 * 24 * 60 * 60 * 1000) statut = 'Alerte';

              return (
                <tr key={lot.id} className={`status-${statut.toLowerCase()}`}>
                  <td>{lot.produit.nom}</td>
                  <td>{lot.quantite}</td>
                  <td>{new Date(lot.dateProduction).toLocaleDateString()}</td>
                  <td>{new Date(lot.dateExpiration).toLocaleDateString()}</td>
                  <td>{statut}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockWithScanning;