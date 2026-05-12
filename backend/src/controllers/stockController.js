const prisma = require('../lib/prisma');

// Add stock entry
const addStockEntry = async (req, res) => {
  try {
    const { produitId, quantite, dateProduction } = req.body;

    // Check if product exists
    const product = await prisma.produit.findUnique({ where: { id: produitId } });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Calculate expiration date
    const dateExpiration = new Date(dateProduction);
    dateExpiration.setDate(dateExpiration.getDate() + product.dureeVie);

    // Create lot
    const lot = await prisma.lotStock.create({
      data: {
        produitId,
        quantite,
        dateProduction: new Date(dateProduction),
        dateExpiration
      }
    });

    // Record movement
    await prisma.mouvement.create({
      data: {
        lotId: lot.id,
        type: 'entree',
        quantite
      }
    });

    res.status(201).json({ message: 'Entrée de stock enregistrée', lot });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Remove stock
const removeStock = async (req, res) => {
  try {
    const { lotId, quantite } = req.body;

    // Check if lot exists
    const lot = await prisma.lotStock.findUnique({ where: { id: lotId } });
    if (!lot) {
      return res.status(404).json({ message: 'Lot non trouvé' });
    }

    if (lot.quantite < quantite) {
      return res.status(400).json({ message: 'Quantité insuffisante' });
    }

    // Update lot quantity
    const updatedLot = await prisma.lotStock.update({
      where: { id: lotId },
      data: { quantite: lot.quantite - quantite }
    });

    // Record movement
    await prisma.mouvement.create({
      data: {
        lotId,
        type: 'sortie',
        quantite
      }
    });

    res.json({ message: 'Sortie de stock enregistrée', lot: updatedLot });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get stock history
const getStockHistory = async (req, res) => {
  try {
    const { lotId } = req.params;

    const mouvements = await prisma.mouvement.findMany({
      where: { lotId: parseInt(lotId) },
      orderBy: { date: 'desc' }
    });

    res.json(mouvements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get all stock lots
const getAllLots = async (req, res) => {
  try {
    const lots = await prisma.lotStock.findMany({
      include: { produit: true }
    });

    res.json(lots);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { addStockEntry, removeStock, getStockHistory, getAllLots };
