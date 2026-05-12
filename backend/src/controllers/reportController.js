const prisma = require('../lib/prisma');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Total products
    const totalProducts = await prisma.produit.count();

    // Total stock
    const stockData = await prisma.lotStock.aggregate({
      _sum: { quantite: true }
    });
    const totalStock = stockData._sum.quantite || 0;

    // Expired products
    const today = new Date();
    const expiredData = await prisma.lotStock.findMany({
      where: {
        dateExpiration: { lt: today },
        quantite: { gt: 0 }
      }
    });
    const expiredCount = expiredData.length;

    // Critical products (< 10 units)
    const products = await prisma.produit.findMany();
    let criticalCount = 0;

    for (const product of products) {
      const qty = await prisma.lotStock.aggregate({
        where: { produitId: product.id },
        _sum: { quantite: true }
      });

      if ((qty._sum.quantite || 0) < 10) {
        criticalCount++;
      }
    }

    // Recent movements
    const recentMovements = await prisma.mouvement.findMany({
      take: 10,
      orderBy: { date: 'desc' },
      include: { lot: { include: { produit: true } } }
    });

    res.json({
      totalProducts,
      totalStock,
      expiredCount,
      criticalCount,
      recentMovements
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get inventory report
const getInventoryReport = async (req, res) => {
  try {
    const products = await prisma.produit.findMany({
      include: { lots: true }
    });

    const report = products.map(product => {
      const totalQty = product.lots.reduce((sum, lot) => sum + lot.quantite, 0);
      return {
        id: product.id,
        nom: product.nom,
        categorie: product.categorie,
        codeBarre: product.codeBarre,
        quantiteTotal: totalQty,
        nombreLots: product.lots.length
      };
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get movement statistics
const getMovementStats = async (req, res) => {
  try {
    const entries = await prisma.mouvement.count({ where: { type: 'entree' } });
    const removals = await prisma.mouvement.count({ where: { type: 'sortie' } });

    const entryData = await prisma.mouvement.aggregate({
      where: { type: 'entree' },
      _sum: { quantite: true }
    });

    const removalData = await prisma.mouvement.aggregate({
      where: { type: 'sortie' },
      _sum: { quantite: true }
    });

    res.json({
      totalEntries: entries,
      totalRemovals: removals,
      quantityEntered: entryData._sum.quantite || 0,
      quantityRemoved: removalData._sum.quantite || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getDashboardStats, getInventoryReport, getMovementStats };
