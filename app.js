const cors = require('cors');
var express = require('express');
var app = express();

app.use(express.static('public'))//to mention express that the frontend (static files) are in public folder

const bodyparser = require('body-parser')
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


require('./db/mongoose')
const adminRoute = require('./routes/adminRoute')
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const cartRoute = require('./routes/cartRoute')
const orderRoute = require('./routes/orderRoute')
const favoritesRoute = require('./routes/favoritesRoute')
const fileUploadRoute = require('./routes/fileUpload')

const port = process.env.PORT


app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/order', orderRoute);
app.use('/favorites', favoritesRoute);
app.use('/admins', adminRoute);
app.use('/file', fileUploadRoute);



app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, () => console.log('Starting Server at : http://localhost:' + port));