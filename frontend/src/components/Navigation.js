import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Boxes,
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  UserRound,
  UsersRound,
  Warehouse
} from 'lucide-react';
import '../styles/Navigation.css';

const Navigation = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => setUser(JSON.parse(localStorage.getItem('user')));
    window.addEventListener('safestock:user-updated', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('safestock:user-updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const navItems = [
    { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/products', label: 'Produits', icon: Package },
    { to: '/stock', label: 'Stock', icon: Boxes },
    { to: '/alerts', label: 'Alertes', icon: AlertTriangle },
    { to: '/reports', label: 'Rapports', icon: ChartNoAxesCombined }
  ];

  if (user?.role === 'Administrateur') {
    navItems.push({ to: '/users', label: 'Utilisateurs', icon: UsersRound });
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-mark">
          <span><Warehouse size={22} /></span>
          SafeStock
        </Link>
      </div>

      <ul className="navbar-menu">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink to={to}>
              <Icon size={17} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-user">
        <NavLink to="/profile" className="user-chip">
          <UserRound size={18} />
          <span>
            <strong>{user?.nom}</strong>
            <small><Shield size={12} /> {user?.role}</small>
          </span>
        </NavLink>
        <button onClick={handleLogout} className="btn-logout" title="Deconnexion">
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
