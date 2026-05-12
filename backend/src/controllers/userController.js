const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

const userSelect = {
  id: true,
  nom: true,
  email: true,
  role: true,
  createdAt: true
};

const getProfile = async (req, res) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.user.id },
      select: userSelect
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nom, email, currentPassword, newPassword } = req.body;

    if (!nom || !email) {
      return res.status(400).json({ message: 'Nom et email requis' });
    }

    const currentUser = await prisma.utilisateur.findUnique({
      where: { id: req.user.id }
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'Utilisateur non trouve' });
    }

    const existingEmail = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingEmail && existingEmail.id !== req.user.id) {
      return res.status(400).json({ message: 'Cet email est deja utilise' });
    }

    const data = { nom, email };

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel requis' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.motDePasse);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }

      data.motDePasse = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.utilisateur.update({
      where: { id: req.user.id },
      data,
      select: userSelect
    });

    res.json({ message: 'Profil mis a jour', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: userSelect
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

module.exports = { getProfile, updateProfile, getUsers, deleteUser, updateUserRole };
