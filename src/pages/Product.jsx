import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { doc, onSnapshot } from "@firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";

const Product = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0); // state to keep track of cart count

  let { id } = useParams();

  useEffect(() => {
    // Retrieve product data from Firestore
    const unsub = onSnapshot(
      doc(db, "produits", id),
      (snapShot) => {
        setProduct({ id: snapShot.id, ...snapShot.data() });
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex gap-10">
          <img
            src={product.image}
            className="w-48 rounded-lg mb-4"
            alt={product.name}
          />
          <div>
            <h2 className="text-lg font-medium mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-4">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-medium text-red-500">
                {product.price}
              </span>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                Buy Now
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-9 right-14 flex items-center gap-1">
          <FontAwesomeIcon icon={faCartPlus} className="text-white" />
          <span className="bg-blue-500 text-white py-0 px-1 rounded-lg absolute bottom-3 left-3">
            {cartCount}
          </span>
        </div>
      </div>
    </>
  );
};

export default Product;
