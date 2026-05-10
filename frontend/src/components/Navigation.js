import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

const Navigation = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">SafeStock</Link>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/dashboard">Tableau de bord</Link></li>
        <li><Link to="/products">Produits</Link></li>
        <li><Link to="/stock">Stock</Link></li>
        <li><Link to="/alerts">Alertes</Link></li>
        <li><Link to="/reports">Rapports</Link></li>
      </ul>
      <div className="navbar-user">
        <span>{user?.nom}</span>
        <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
      </div>
    </nav>
  );
};

export default Navigation;