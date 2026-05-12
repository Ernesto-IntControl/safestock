const prisma = require('../lib/prisma');

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.produit.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.produit.findUnique({
      where: { id: parseInt(id) },
      include: { lots: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const { nom, categorie, codeBarre, dureeVie, unite } = req.body;

    const product = await prisma.produit.create({
      data: { nom, categorie, codeBarre, dureeVie, unite }
    });

    res.status(201).json({ message: 'Produit créé', product });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, categorie, codeBarre, dureeVie, unite } = req.body;

    const product = await prisma.produit.update({
      where: { id: parseInt(id) },
      data: { nom, categorie, codeBarre, dureeVie, unite }
    });

    res.json({ message: 'Produit modifié', product });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produit.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
