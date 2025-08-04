# User Service Backend

Ini adalah backend untuk sisi **user-service**.

User service ini dibangun menggunakan **NestJS** dan **Prisma ORM**. Layanan ini bertanggung jawab untuk manajemen data user, seperti pembuatan user, update profile, pengambilan data user, dan pengelolaan password.

Secara default, user-service berjalan di port **3001**.

---

## Cara Menjalankan

Pindah direktori ke folder user-service:
```
cd user-service
```
Install dependencies:
```
npm install
```
Lakukan seeding dengan:
```
npx prisma db seed
```
---

# Endpoint Utama

# GET /users/profile
Mendapatkan profile user yang sedang login.

## PUT /users/profile
Update profile user yang sedang login.

**Request Body**
```json
{
    "name": "string",
    "email": "string",
    "phone": "string",
    "photo": "string"
}
```

## PUT /users/change-password
Mengganti password user yang sedang login.

**Request Body**
```json
{
    "newPassword": "string",
    "confirmPassword": "string",
}
```

Jika berhasil akan mengembalikan
```json
{
    "message": "Password updated successfully",
}
```

Jika password tidak sama akan mengembalikan error
```json
{
    "message": "Passwords do not match",
}
```

## GET /users/all
Mengambil seluruh data user (khusus ADMIN).

## GET /users/:id
Mengambil detail user berdasarkan ID (khusus ADMIN).

## POST /users/create
Membuat user baru (khusus ADMIN).

**Request Body**:

```json
{
  "email": "user@email.com",
  "password": "yourpassword",
  "name": "Nama User",
  "phone": "08123456789",
  "position": "Staff"
}
```



## PUT /users/:id
Update data user berdasarkan ID (khusus ADMIN).

**Request Body**:
```json
{
  "email": "user@email.com",
  "name": "Nama User",
  "phone": "08123456789",
  "position": "Staff"
}
```