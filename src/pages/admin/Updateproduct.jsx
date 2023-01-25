import React, { useState, useEffect } from "react";
import { doc, deleteDoc, onSnapshot } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { db, storage } from "../../firebase";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { updateProfile } from "@firebase/auth";

const Updateproduct = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `image-produits/${product.name + date}`);
      const image = event.target[3].files[0];

      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            // Update the product data in Firestore
            await updateProfile(doc(db, "produits", id), {
              name: event.target[0].value,
              description: event.target[1].value,
              price: event.target[2].value,
              image: downloadURL,
            });
            navigate("/admin");
          } catch (err) {
            console.log(err);
          }
        });
      });
    } catch {
      console.log("problème de modification de produit");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "produits", id));
      navigate("/admin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="text-center text-3xl">Loading...</div>
      ) : (
        <div className="bg-gray-200 min-h-screen flex items-center justify-center">
          <form className="bg-white p-6 rounded-lg" onSubmit={handleSubmit}>
            <label className="block text-gray-700 font-medium mb-2">
              Name:
              <input
                type="text"
                value={product.name}
                onChange={(event) =>
                  setProduct({ ...product, name: event.target.value })
                }
                className="bg-gray-200 p-2 rounded-lg w-full"
                required
              />
            </label>
            <br />
            <label className="block text-gray-700 font-medium mb-2">
              Description:
              <input
                type="text"
                value={product.description}
                onChange={(event) =>
                  setProduct({ ...product, description: event.target.value })
                }
                className="bg-gray-200 p-2 rounded-lg w-full"
                required
              />
            </label>
            <br />
            <label className="block text-gray-700 font-medium mb-2">
              Price:
              <input
                type="text"
                value={product.price}
                onChange={(event) =>
                  setProduct({ ...product, price: event.target.value })
                }
                className="bg-gray-200 p-2 rounded-lg w-full"
                required
              />
            </label>
            <br />
            <label className="block text-gray-700 font-medium mb-2">
              Image:
              <input
                type="file"
                className="bg-gray-200 p-2 rounded-lg w-full"
                required
              />
            </label>
            <br />
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Update Product
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Updateproduct;
