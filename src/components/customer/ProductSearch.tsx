import * as React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-nativescript';
import axios from 'axios';
import { useCart } from '../../contexts/CartContext';

export function ProductSearch({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (searchQuery) {
      fetchProducts();
    }
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products?query=${searchQuery}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // Optionally, show a confirmation message
  };

  return (
    <flexboxLayout style={styles.container}>
      <label className="text-2xl mb-4 font-bold">Product Search</label>
      <textField
        hint="Search products"
        style={styles.input}
        onTextChange={(args) => setSearchQuery(args.value)}
      />
      <scrollView style={styles.productList}>
        {products.map((product) => (
          <flexboxLayout key={product.id} style={styles.productItem}>
            <label>{product.name} - ${product.price}</label>
            <button style={styles.addButton} onTap={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </flexboxLayout>
        ))}
      </scrollView>
      <button style={styles.viewCartButton} onTap={() => navigation.navigate('OrderPlacement')}>
        View Cart
      </button>
    </flexboxLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    fontSize: 18,
  },
  productList: {
    width: '100%',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    fontSize: 14,
    color: '#2e6ddf',
  },
  viewCartButton: {
    fontSize: 18,
    color: '#2e6ddf',
    marginTop: 20,
  },
});