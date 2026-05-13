const prisma = require('../lib/prisma');

const normalizeProductPayload = ({ nom, categorie, codeBarre, dureeVie, unite }) => ({
  nom: String(nom || '').trim(),
  categorie: String(categorie || '').trim(),
  codeBarre: String(codeBarre || '').trim(),
  dureeVie: Number(dureeVie),
  unite: String(unite || '').trim()
});

const validateProductPayload = (product) => {
  if (!product.nom || !product.categorie || !product.codeBarre || !product.unite) {
    return 'Tous les champs du produit sont requis';
  }

  if (!Number.isInteger(product.dureeVie) || product.dureeVie <= 0) {
    return 'La duree de vie doit etre un nombre entier superieur a 0';
  }

  return null;
};

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.produit.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.produit.findUnique({
      where: { id: parseInt(id, 10) },
      include: { lots: true }
    });

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouve' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = normalizeProductPayload(req.body);
    const validationError = validateProductPayload(productData);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await prisma.produit.create({
      data: productData
    });

    res.status(201).json({ message: 'Produit cree', product });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Ce code-barres est deja utilise' });
    }

    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = normalizeProductPayload(req.body);
    const validationError = validateProductPayload(productData);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await prisma.produit.update({
      where: { id: parseInt(id, 10) },
      data: productData
    });

    res.json({ message: 'Produit modifie', product });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Ce code-barres est deja utilise' });
    }

    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.produit.delete({
      where: { id: parseInt(id, 10) }
    });

    res.json({ message: 'Produit supprime' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
