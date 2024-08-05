const express = require('express');
const app = express();

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');


app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);



const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Felicitaciones! Pusiste en marcha el portal ${PORT}`);
});