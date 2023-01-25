import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

 

  const { dispatch, cart} = useContext(CartContext);
  console.log(cart.totalQty);

  useEffect(() => {
    // LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "produits"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((product, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <img
                src={product.image}
                className="w-50 rounded-lg mb-4"
                alt={product.name}
              />
              <h2 className="text-lg font-medium mb-2">{product.name}</h2>
              <p className="text-gray-700 mb-4 truncate">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-medium text-red-500">
                  {product.price}
                </span>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => dispatch({ type: "ADD_TO_CART", id: product.id, product })}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  Buy Now
                </button>
              </div>
              <div className="absolute top-9 right-14 flex items-center gap-1">
                <Link to="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-white" />
                </Link>
                <span className="bg-blue-500 text-white py-0 px-1 rounded-lg absolute bottom-3 left-3">
                  {cart.totalQty}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
