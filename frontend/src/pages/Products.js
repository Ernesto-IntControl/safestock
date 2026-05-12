import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { productService } from '../services/api';
import SearchBar from '../components/SearchBar';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    categorie: '',
    codeBarre: '',
    dureeVie: '',
    unite: ''
  });
  const user = JSON.parse(localStorage.getItem('user'));

  const loadProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filterProducts = useCallback((query) => {
    const filtered = products.filter(product =>
      product.nom.toLowerCase().includes(query.toLowerCase()) ||
      product.categorie.toLowerCase().includes(query.toLowerCase()) ||
      product.codeBarre.includes(query)
    );
    setFilteredProducts(filtered);
  }, [products]);

  useEffect(() => {
    filterProducts(searchQuery);
  }, [searchQuery, filterProducts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productService.updateProduct(editingId, formData);
      } else {
        await productService.createProduct(formData);
      }
      loadProducts();
      setShowForm(false);
      setEditingId(null);
      setFormData({ nom: '', categorie: '', codeBarre: '', dureeVie: '', unite: '' });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await productService.deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  if (loading) return <div>Chargement...</div>;

  const canEdit = ['Administrateur', 'Magasinier'].includes(user?.role);
  const canDelete = user?.role === 'Administrateur';

  return (
    <div className="products-container">
      <div className="page-header">
        <div>
          <h1>Gestion des produits</h1>
          <p className="page-description">Tableau de bord produit pour créer, modifier et suivre vos articles.</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowForm(true)} className="btn-primary">
            <Plus size={18} /> Nouveau produit
          </button>
        )}
      </div>

      <div className="page-toolbar">
        <SearchBar 
          onSearch={setSearchQuery}
          placeholder="Rechercher par nom, catégorie ou code-barres..."
        />
        <div className="results-info">
          {filteredProducts.length > 0 ? (
            <span>{filteredProducts.length} produit(s) trouvé(s)</span>
          ) : (
            <span>Aucun produit ne correspond à votre recherche</span>
          )}
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? 'Modifier' : 'Ajouter'} un produit</h2>
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
              <label>Catégorie</label>
              <input
                type="text"
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Code-barres</label>
              <input
                type="text"
                value={formData.codeBarre}
                onChange={(e) => setFormData({ ...formData, codeBarre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Durée de vie (jours)</label>
              <input
                type="number"
                value={formData.dureeVie}
                onChange={(e) => setFormData({ ...formData, dureeVie: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Unité</label>
              <input
                type="text"
                value={formData.unite}
                onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">Enregistrer</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Code-barres</th>
            <th>Durée de vie</th>
            <th>Unité</th>
            {canEdit && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.nom}</td>
              <td>{product.categorie}</td>
              <td>{product.codeBarre}</td>
              <td>{product.dureeVie} jours</td>
              <td>{product.unite}</td>
              {canEdit && (
                <td className="actions">
                  <button onClick={() => handleEdit(product)} className="btn-edit"><Pencil size={15} /> Modifier</button>
                  {canDelete && (
                    <button onClick={() => handleDelete(product.id)} className="btn-delete"><Trash2 size={15} /> Supprimer</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
