const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const cartsFilePath = './data/carts.json';
const productsFilePath = './data/products.json';

// Función para leer los carritos del archivo
const readCarts = () => {
    const data = fs.readFileSync(cartsFilePath);
    return JSON.parse(data);
  };
  
  // Función para escribir los carritos al archivo
  const writeCarts = (carts) => {
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  };
  
  // Función para leer los productos del archivo
  const readProducts = () => {
    const data = fs.readFileSync(productsFilePath);
    return JSON.parse(data);
  };
  
  // Crear un nuevo carrito
  router.post('/', (req, res) => {
    const newCart = {
      id: uuidv4(),
      products: []
    };
  
    const carts = readCarts();
    carts.push(newCart);
    writeCarts(carts);
  
    res.status(201).json(newCart);
  });
  
  // Listar los productos de un carrito por ID
  router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  });
  
  // Agregar un producto a un carrito por ID
  router.post('/:cid/product/:pid', (req, res) => {
    const carts = readCarts();
    const products = readProducts();
    const cart = carts.find(c => c.id === req.params.cid);
    const product = products.find(p => p.id === req.params.pid);
  
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
  
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    const existingProduct = cart.products.find(p => p.product === req.params.pid);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
  
    writeCarts(carts);
    res.status(201).json(cart);
  });
  
  module.exports = router;