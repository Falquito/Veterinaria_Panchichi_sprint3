import React, { useState } from 'react';
import EcommerceHeader from '../components/ecommerce/Ecommerceheader';
import ProductList from '../components/ecommerce/ProductList';
import CartSidebar from '../components/ecommerce/CartSidebar';
import LoginModal from '../components/ecommerce/login-modal';

const CatalogoComplete = ({user,setUser}) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOpenUser,setOpenUser] = useState(false)
  

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const onCloseLoginModal = ()=>{
    setOpenUser(false)
  }

  const onOpenLoginModal = ()=>{
    setOpenUser(true)
  }

  const saveUser = (data)=>{
    setUser(data)
  }

  return (
    <div className="min-h-screen">
      {isOpenUser && <LoginModal saveUser={saveUser} onClose={onCloseLoginModal} ></LoginModal>}
      <EcommerceHeader 
        cartItems={cartItems} 
        onCartClick={handleCartClick}
        onOpenLoginModal={onOpenLoginModal}
        User={user}
      />
      {user && console.log(user)}
      
      <ProductList onAddToCart={handleAddToCart} />
      
      <CartSidebar
        isOpen={isCartOpen}
        onClose={handleCloseCart}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default CatalogoComplete;