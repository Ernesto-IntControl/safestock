const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get expiration alerts
const getExpirationAlerts = async (req, res) => {
  try {
    const today = new Date();
    const warningDays = 5;
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + warningDays);

    const alerts = await prisma.lotStock.findMany({
      where: {
        dateExpiration: {
          lte: warningDate,
          gte: today
        },
        quantite: { gt: 0 }
      },
      include: { produit: true }
    });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get expired products
const getExpiredProducts = async (req, res) => {
  try {
    const today = new Date();

    const expired = await prisma.lotStock.findMany({
      where: {
        dateExpiration: { lt: today },
        quantite: { gt: 0 }
      },
      include: { produit: true }
    });

    res.json(expired);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Get low stock alerts
const getLowStockAlerts = async (req, res) => {
  try {
    const products = await prisma.produit.findMany();
    const alerts = [];

    for (const product of products) {
      const totalQuantity = await prisma.lotStock.aggregate({
        where: { produitId: product.id },
        _sum: { quantite: true }
      });

      // Alert if stock below 10 units
      if ((totalQuantity._sum.quantite || 0) < 10) {
        alerts.push({
          produitId: product.id,
          nom: product.nom,
          quantite: totalQuantity._sum.quantite || 0,
          seuil: 10
        });
      }
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getExpirationAlerts, getExpiredProducts, getLowStockAlerts };