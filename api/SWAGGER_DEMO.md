# Swagger Demo Notes

## Open Swagger

- URL: `http://localhost:3000/api-docs`

## Review endpoints worth showing

- `GET /api/health`
- `GET /api/search?q=iphone`
- `GET /api/admin/statistics`
- `GET /api/seller/dashboard`

For cached endpoints, run the same request twice and show the `X-Cache` header changing from `MISS` to `HIT` when Redis is enabled.

## Seeded Credentials

### Admin

- Username: `ADMIN001`
- Password: `Admin@123`
- Security token: `TOKEN001`

### Supervisor

- Username: `supervisor@se.com`
- Password: `Supervisor@123`

## Important Notes

- Swagger is configured to send cookies with requests.
- After a successful login, stay in the same browser tab/session when trying protected routes.
- Seller accounts are not seeded by default. For seller demo, first use the signup flow.
- Customer accounts are not seeded by default. For customer demo, use an existing user account or the signup flow if email OTP is available.
- This project uses REST for exposed APIs. It also consumes third-party service APIs such as Razorpay and Cloudinary.

## Safe Demo Order

### Public APIs

1. `GET /api/latest-products`
2. `GET /api/latest-accessories`
3. `GET /api/phones`
4. `GET /api/laptops`
5. `GET /api/search?q=phone`

### Supervisor Demo

1. `POST /api/supervisor-auth/signin`
2. `GET /api/supervisor/dashboard`
3. `GET /api/supervisor/statistics`
4. `GET /api/supervisor/verify-applications`
5. `GET /api/supervisor/profile`

### Admin Demo

1. `POST /api/admin-auth/admin-signin`
2. `GET /api/admin/statistics`
3. `GET /api/admin/supervisors`
4. `GET /api/admin/product-analytics/totals`
5. `GET /api/admin/sales-analytics/categories`
6. `GET /api/admin/seller-activity/top`

### Customer Demo

1. `POST /api/auth/signin`
2. `GET /api/auth/profile`
3. `GET /api/customer/profile`
4. `GET /api/customer/notifications`
5. `POST /api/orders`

## Request Bodies To Paste

### Admin Login

```json
{
  "username": "ADMIN001",
  "password": "Admin@123",
  "securityToken": "TOKEN001"
}
```

### Supervisor Login

```json
{
  "username": "supervisor@se.com",
  "password": "Supervisor@123"
}
```

## If Swagger Looks Wrong

1. Hard refresh the browser.
2. Reopen `http://localhost:3000/api-docs`.
3. Make sure the request body JSON is valid before clicking `Execute`.
