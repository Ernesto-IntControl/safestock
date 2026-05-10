const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Create user
    const user = await prisma.utilisateur.create({
      data: { nom, email, motDePasse: hashedPassword, role }
    });

    res.status(201).json({ message: 'Utilisateur créé', user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Find user
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Check password
    const isValid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isValid) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Connexion réussie', token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { register, login };