# Homey-Ecommerce-API
## Features :
### Admin
- Can login with his pre-registered email and password.
- Can view products page.

    - Search by name.
    - View all products.
    - Create, update, edit and delete any product.
    - Create product with title, image, price, details.
  
- Can view orders page (pending, accepted, rejected).
    - View all orders (username, date, total price, product titles only).
    - Take an action to modify order state.
  
### User
- Can view [home ,about] without login.
- home page (products with promotions).
- about page some information about the store.
- Can register with his (email. username, password, image, gender).
- Can view [products page and profile] on login.
- Products page
    - Search by name.
    - View all products.
    - Add products to his cart.
    - View added products and checkout to make order.
  
- Profile
    - View his own info.
    - Edit his own info.
    - View his orders (accepted, rejected, pending).
    - Cancel order if pending.




##### Server deployed domain:

```

https://homey-ecommerce-api.onrender.com/

```

## APIS

### Products

- Get products with promotions

  method --> GET
  
  access --> public
```
https://homey-ecommerce-api.onrender.com/products/promotions
```


- Get all products

  method --> GET
  
  access --> private [logged in user]
```
https://homey-ecommerce-api.onrender.com/products/user/all-products
```


- Only accessed by Admin
  - Get all products

    method --> GET
  
    access --> private [Admin]
```
https://homey-ecommerce-api.onrender.com/products/admin/all-products
```

- Create new product

    method --> POST
  
    access --> private [Admin]
```
https://homey-ecommerce-api.onrender.com/products/newProduct
```


