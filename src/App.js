import React, { useContext } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AddProduct from "./pages/admin/AddProduct.jsx";
import ProductsList from "./pages/admin/ProductsList.jsx";
import Updateproduct from "./pages/admin/Updateproduct.jsx";
import SignupPage from "./pages/admin/SignupPage.jsx";
import LoginPage from "./pages/admin/LoginPage.jsx";
import { AuthContext } from "./contexts/AuthContext.js";
import ProfilePage from "./pages/admin/auth/ProfilePage.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Test from "./pages/Test.jsx";

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/creer-un-compte" exact element={<SignupPage />} />
        <Route path="/product/:id" exact element={<Product />} />
        <Route path="/cart" exact element={<Cart />} />
        <Route path="/se-connecter" exact element={<LoginPage />} />
        <Route path="/test" exact element={<Test />} />
        <Route
          path="/mise-a-jour"
          exact
          element={currentUser ? <ProfilePage /> : <LoginPage />}
        />
        <Route
          path="/ajouter"
          element={currentUser ? <AddProduct /> : <LoginPage />}
        />
        <Route
          path="/admin"
          element={currentUser ? <ProductsList /> : <LoginPage />}
        />
        <Route
          path="/modifier/:id"
          element={currentUser ? <Updateproduct /> : <LoginPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
