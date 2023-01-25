import { collection, deleteDoc, doc, onSnapshot } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { db } from "../../firebase";

const ProductsList = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "produits", id));
      setData(data.filter((product) => product.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-2xl font-medium mb-4">Product List</h1>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2"></th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.id}>
                <td className="border px-4 py-2">{product.name}</td>
                <td className="border px-4 py-2"></td>
                <td className="border px-4 py-2">{product.price}</td>
                <td className="border px-4 py-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg"
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/ajouter`)}
                    className="bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-600"
                  >
                    add
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/modifier/${product.id}`)}
                    className="bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-600"
                  >
                    Modify
                  </button>
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;
