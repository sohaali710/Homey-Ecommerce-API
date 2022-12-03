var express = require('express');
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const cartRouter = require('./routers/cart')
const orderRouter = require('./routers/order')

const adminRouter = require('./routers/admin')

require('./db/mongoose')

const port = process.env.PORT

var app = express();

app.use(express.json())


app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

app.use('/admins', adminRouter);


app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(port, () => console.log('Starting Server at : http://localhost:' + port));