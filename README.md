# Homey-Ecommerce-API
## Features :
### Admin
- Can login with his pre-registered email and password.
- Can view products page.
    - View all products.
    - Create, update, edit and delete any product.
  
- Can view orders page (pending, accepted, rejected).
    - View all orders (username, date, total price, product title and image).
    - Take an action to modify order state.
  
### User
- Can view [home ,about] without login.
- home page (products with promotions).
- about page some information about the store.
- Can register with his (email. username, password, image, gender).
- Can view [products page and profile] on login.
- Products page
    - View all products.
    - Add products to his cart.
    - View added products and checkout to make order.
  
- Profile
    - View his own info.
    - Edit his own info.
    - View his orders (accepted, rejected, pending).
    - Cancel order if pending.
- Favorites
    - Add product to favories.
    - remove product from favories.
    - View favorites page.

### To run the server locally:
      
#### 1) Install packages :
   
```
npm i
```

#### 2) Run the server :

```
npm run dev
```

## APIS

### Admin

- Login

  method --> POST
  
  access --> private [Admin]
```
/admin/login
```

- Logout

  method --> POST
  
  access --> private [Admin]
```
/admin/logout
```


<hr/>

### User

- User signup

  method --> POST
  
  access --> private [User]
```
/user/signup
```

- User login

  method --> POST
  
  access --> private [User]
```
/user/login
```

- User logout

  method --> POST
  
  access --> private [User]
```
/user/logout
```

- User logout from all sessions (devices) 

  method --> POST
  
  access --> private [User]
```
/user/logout-all
```

- Get user profile

  method --> GET
  
  access --> private [User]
```
/user/profile
```

- Update user profile

  method --> PUT
  
  access --> private [User]
```
/user/profile/update
```


<hr/>

### Products

- Get products with promotions

  method --> GET
  
  access --> public
```
/products/promotions
```


- Get all products

  method --> GET
  
  access --> private [logged in user]
```
/products/user/all-products
```


#### Only accessed by Admin
- Get all products

    method --> GET
  
    access --> private [Admin]
```
/products/admin/all-products
```

- Create new product

    method --> POST
  
    access --> private [Admin]
```
/products/newProduct
```


- Update product

    method --> PUT
  
    access --> private [Admin]
```
/products/:id
```

- Delete product

    method --> DELETE
  
    access --> private [Admin]
```
/products/:id
```

- Add promotions to product

    method --> DELETE
  
    access --> private [Admin]
```
/products/promotions/:id
```


### Order

- Order checkout (using stripe payment gate)

  method --> POST
  
  access --> private [User]
```
/order/checkout
```

- User get his all previous orders

  method --> GET
  
  access --> private [User]
```
/order/user/orders
```

- User cancel (delete) order if it's in pending state

  method --> Delete
  
  access --> private [User]
```
/order/user/:orderId
```



- Get all orders (by admin)

  method --> GET
  
  access --> private [Admin]
```
/order/all
```

- Modify order state

  method --> PUT
  
  access --> private [Admin]
```
/order/:orderId
```

- Filter Orders by state

  method --> GET
  
  access --> private [Admin]
```
/order/state/:state
```



- Get order by id (by his user or by admin)

  method --> GET
  
  access --> private [User & Admin]
```
/order/:orderId
```


<hr/>

### Favorites
- Get all products in favorites

  method --> GET
  
  access --> private [User]
```
/favorites
```

- Add product in favorites

  method --> POST
  
  access --> private [User]
```
/favorites
```

- Remove product from favorites

  method --> DELETE
  
  access --> private [User]
```
/favorites
```
