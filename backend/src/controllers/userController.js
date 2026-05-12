const prisma = require('../lib/prisma');

const getUsers = async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (req.user.id === userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await prisma.utilisateur.delete({ where: { id: userId } });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Rôle manquant' });
    }

    const updatedUser = await prisma.utilisateur.update({
      where: { id: userId },
      data: { role }
    });

    res.json({ message: 'Rôle mis à jour', user: { id: updatedUser.id, nom: updatedUser.nom, email: updatedUser.email, role: updatedUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { getUsers, deleteUser, updateUserRole };
