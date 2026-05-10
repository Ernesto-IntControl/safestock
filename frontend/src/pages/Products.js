import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts(searchQuery);
  }, [products, searchQuery]);

  const loadProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (query) => {
    const filtered = products.filter(product =>
      product.nom.toLowerCase().includes(query.toLowerCase()) ||
      product.categorie.toLowerCase().includes(query.toLowerCase()) ||
      product.codeBarre.includes(query)
    );
    setFilteredProducts(filtered);
  };

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
    <div className="products">
      <h1>Gestion des produits</h1>
      {canEdit && (
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Nouveau produit
        </button>
      )}

      <SearchBar 
        onSearch={setSearchQuery}
        placeholder="Rechercher par nom, catégorie ou code-barres..."
      />

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

      <div className="results-info">
        {filteredProducts.length > 0 ? (
          <p>{filteredProducts.length} produit(s) trouvé(s)</p>
        ) : (
          <p>Aucun produit ne correspond à votre recherche</p>
        )}
      </div>

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
                  <button onClick={() => handleEdit(product)} className="btn-edit">Modifier</button>
                  {canDelete && (
                    <button onClick={() => handleDelete(product.id)} className="btn-delete">Supprimer</button>
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