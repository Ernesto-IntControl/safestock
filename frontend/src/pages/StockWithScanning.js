import React, { useEffect, useState } from 'react';
import { Minus, Plus, ScanBarcode } from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';
import { productService, stockService } from '../services/api';
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

  useEffect(() => {
    loadData();
  }, []);

  const handleBarcodeScanned = (barcode) => {
    const product = products.find((item) => item.codeBarre === barcode);
    if (product) {
      setFormData({ ...formData, produitId: product.id });
      setShowScanner(false);
    } else {
      alert('Produit non trouve');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (formType === 'entry') {
        await stockService.addStockEntry({
          produitId: parseInt(formData.produitId, 10),
          quantite: parseInt(formData.quantite, 10),
          dateProduction: formData.dateProduction
        });
      } else {
        await stockService.removeStock({
          lotId: parseInt(formData.lotId, 10),
          quantite: parseInt(formData.quantite, 10)
        });
      }
      loadData();
      setShowForm(false);
      setFormData({ produitId: '', quantite: '', dateProduction: '', lotId: '' });
    } catch (error) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) return <div className="loader">Chargement...</div>;

  const canManage = ['Administrateur', 'Magasinier'].includes(user?.role);

  return (
    <div className="stock-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mouvements</p>
          <h1>Gestion du stock</h1>
          <p className="page-description">Suivi des lots, entrees et sorties avec scanner de code-barres.</p>
        </div>
        {canManage && (
          <div className="stock-actions">
            <button onClick={() => { setFormType('entry'); setShowForm(true); }} className="btn-primary">
              <Plus size={18} /> Entree de stock
            </button>
            <button onClick={() => { setFormType('removal'); setShowForm(true); }} className="btn-secondary">
              <Minus size={18} /> Sortie de stock
            </button>
            <button onClick={() => setShowScanner(true)} className="btn-scan">
              <ScanBarcode size={18} /> Scanner
            </button>
          </div>
        )}
      </div>

      {showScanner && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showForm && (
        <div className="form-container">
          <h2>{formType === 'entry' ? 'Entree de stock' : 'Sortie de stock'}</h2>
          <form onSubmit={handleSubmit}>
            {formType === 'entry' ? (
              <>
                <div className="form-group">
                  <label>Produit</label>
                  <div className="stock-select-row">
                    <select
                      value={formData.produitId}
                      onChange={(event) => setFormData({ ...formData, produitId: event.target.value })}
                      required
                    >
                      <option value="">Selectionner un produit</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>{product.nom}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => setShowScanner(true)} className="btn-scan">
                      <ScanBarcode size={18} />
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Quantite</label>
                  <input
                    type="number"
                    value={formData.quantite}
                    onChange={(event) => setFormData({ ...formData, quantite: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date de production</label>
                  <input
                    type="date"
                    value={formData.dateProduction}
                    onChange={(event) => setFormData({ ...formData, dateProduction: event.target.value })}
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
                    onChange={(event) => setFormData({ ...formData, lotId: event.target.value })}
                    required
                  >
                    <option value="">Selectionner un lot</option>
                    {lots.filter((lot) => lot.quantite > 0).map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.produit.nom} - {lot.quantite} unites
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantite a retirer</label>
                  <input
                    type="number"
                    value={formData.quantite}
                    onChange={(event) => setFormData({ ...formData, quantite: event.target.value })}
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
              <th>Quantite</th>
              <th>Date production</th>
              <th>Date expiration</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => {
              const today = new Date();
              const expDate = new Date(lot.dateExpiration);
              let statut = 'OK';
              if (expDate < today) statut = 'Perime';
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
