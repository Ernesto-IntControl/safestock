# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All endpoints (except `/auth/*`) require JWT token in header:
```
Authorization: Bearer <token>
```

### Login
- **POST** `/auth/login`
- Body: `{ email, motDePasse }`
- Returns: `{ token, user }`

### Register
- **POST** `/auth/register`
- Body: `{ nom, email, motDePasse, role }`
- Returns: `{ message, user }`

---

## Products

### Get All Products
- **GET** `/products`
- Returns: Array of products

### Get Product by ID
- **GET** `/products/:id`
- Returns: Product with lots

### Create Product
- **POST** `/products`
- Body: `{ nom, categorie, codeBarre, dureeVie, unite }`
- Role: Administrateur, Magasinier

### Update Product
- **PUT** `/products/:id`
- Body: Same as create
- Role: Administrateur, Magasinier

### Delete Product
- **DELETE** `/products/:id`
- Role: Administrateur

---

## Stock Management

### Get All Stock Lots
- **GET** `/stock`
- Returns: Array of lots with products

### Add Stock Entry
- **POST** `/stock/entry`
- Body: `{ produitId, quantite, dateProduction }`
- Auto-calculates expiration date
- Role: Administrateur, Magasinier

### Remove Stock
- **POST** `/stock/remove`
- Body: `{ lotId, quantite }`
- Role: Administrateur, Magasinier

### Get Stock History
- **GET** `/stock/history/:lotId`
- Returns: Movement history for lot

---

## Alerts

### Get Expiration Alerts
- **GET** `/alerts/expiration`
- Returns: Lots expiring in 5 days

### Get Expired Products
- **GET** `/alerts/expired`
- Returns: Expired lots

### Get Low Stock Alerts
- **GET** `/alerts/low-stock`
- Returns: Products with < 10 units

---

## Reports

### Get Dashboard Stats
- **GET** `/reports/dashboard`
- Returns: 
  - totalProducts
  - totalStock
  - expiredCount
  - criticalCount
  - recentMovements

### Get Inventory Report
- **GET** `/reports/inventory`
- Returns: Products with total quantities

### Get Movement Stats
- **GET** `/reports/movements`
- Returns:
  - totalEntries
  - totalRemovals
  - quantityEntered
  - quantityRemoved

---

## User Roles

1. **Administrateur**: Full access to all features
2. **Superviseur**: Read-only access to reports and stock
3. **Magasinier**: Stock management and product viewing

---

## Error Responses

All errors return JSON with `message` field:
```json
{
  "message": "Error description",
  "error": "Error details"
}
```

Common status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 500: Server error
