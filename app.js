const cors = require('cors');
var express = require('express');
var app = express();
// app.use(express.json())
app.use(express.static('public'))//to mention express that the frontend (static files) are in public folder

const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


require('./db/mongoose')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const cartRouter = require('./routers/cart')
const orderRouter = require('./routers/order')
const favoritesRouter = require('./routers/favorites')
const adminRouter = require('./routers/admin')
const fileUploadRouter = require('./routers/fileUpload')

const port = process.env.PORT


app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/favorites', favoritesRouter);
app.use('/admins', adminRouter);
app.use('/file', fileUploadRouter);



app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, () => console.log('Starting Server at : http://localhost:' + port));