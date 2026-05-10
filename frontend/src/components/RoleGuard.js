import React from 'react';

const RoleGuard = ({ children, requiredRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <div className="access-denied">Accès refusé</div>;
  }

  return children;
};

export default RoleGuard;