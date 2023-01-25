import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { serverTimestamp, collection, addDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const description = e.target[1].value;
    const price = e.target[2].value;
    const image = e.target[3].files[0];

    try {
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `image-produits/${name + date}`);

      await uploadBytesResumable(storageRef, image).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await addDoc(collection(db, "produits"), {
              name,
              description,
              price,
              timeStamp: serverTimestamp(),
              image: downloadURL,
            });
            navigate("/");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch {
      setErr("problème d'ajout de produit");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">
        <form action="" onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
          <div className="mb-4">
            {loading && "Uploading and compressing the image please wait..."}
            {err && <div className="email-error">{err}</div>}
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input type="text" className="border border-gray-400 p-2 w-full" required/>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              type="description"
              required
              className="border border-gray-400 p-2 w-full"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="text"
              name="price"
              id="price"
              className="border border-gray-400 p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="image"
            >
              Image
            </label>
            <input type="file" className="border border-gray-400 p-2 w-full" required/>
          </div>
          <input
            type="submit"
            disabled={loading}
            value="Add Product"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          />
        </form>
      </div>
    </>
  );
};

export default AddProduct;
