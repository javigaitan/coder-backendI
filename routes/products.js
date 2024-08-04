const express  = require('express');
const router = express.Router();
const fs =require('fs');
const { v4: uuidv4 } = require('uuid');


const productsFilePath = './data/products.json';

const readListProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
};


const writeProducts = (products) =>  {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
};

// Ruteos 

router.get('/', (req, res) => {
    const products = readListProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
  });

router.get('/:pid', (req, res) => {
    const products = readListProducts();
    const product = products.find(p => p.id === req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });



router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }
  
    const newProduct = {
      id: uuidv4(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    };
  
    const products = readListProducts();
    products.push(newProduct);
    writeProducts(products);
  
    res.status(201).json(newProduct);
  });


  router.put('/:pid', (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const products = readListProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    const updatedProduct = {
      ...products[productIndex],
      title: title || products[productIndex].title,
      description: description || products[productIndex].description,
      code: code || products[productIndex].code,
      price: price || products[productIndex].price,
      status: (status !== undefined) ? status : products[productIndex].status,
      stock: stock || products[productIndex].stock,
      category: category || products[productIndex].category,
      thumbnails: thumbnails || products[productIndex].thumbnails
    };
  
    products[productIndex] = updatedProduct;
    writeProducts(products);
  
    res.json(updatedProduct);
  });


  //Eliminar

router.delete('/:pid', (req, res) => {
    const products = readListProducts();
    const newProducts = products.filter(p => p.id !== req.params.pid);
    if (products.length === newProducts.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    writeProducts(newProducts);
    res.status(204).send();
  });
  
  module.exports = router;