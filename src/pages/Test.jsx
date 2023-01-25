import { async } from "@firebase/util";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, fs } from "../firebase";

const Test = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Product 1",
      price: 1,
      url: "https://images.pexels.com/photos/59945/strawberry-fruit-delicious-red-59945.jpeg",
      cart: false,
      quantity: 1,
    },
    {
      id: 2,
      name: "Product 2",
      price: 2,
      url: "https://images.pexels.com/photos/52533/orange-fruit-vitamins-healthy-eating-52533.jpeg",
      cart: false,
      quantity: 1,
    },
    {
      id: 3,
      name: "Product 3",
      price: 3,
      url: "https://images.pexels.com/photos/51312/kiwi-fruit-vitamins-healthy-eating-51312.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      cart: false,
      quantity: 1,
    },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "carts"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push(doc.data());
          products.map((i) => {
            if (i.id === doc.data().id) {
              i.cart = true;
            }
          });
        });
        setCart(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const addToCart = async (item) => {
    const newCartRef = doc(collection(db, "carts"));

    if (products.find((i) => i.id === item.id)) {
      console.log("found");
    } else {
      console.log("not found");
    }

    // later...
    await setDoc(newCartRef, {
      id: item.id,
      name: item.name,
      price: item.price,
      url: item.url,
      cart: true,
      quantity: 1,
    });
  };

  const removeFromCart = async (item) => {
  };

  const decreaseQuantity = (item) => {};

  const increaseQuantity = (item) => {};

  const total = () => {};

  return (
    <>
      <Navbar />
      <div className="container mt-2">
        <div className="flex ">
          {products.map((item) => (
            <div className="col-3" key={item.id}>
              <div className="card h-full">
                <img src={item.url} alt="" className="card-img-top h-32" />
                <div className="card-body">
                  <h6 className="card-title text-lg">
                    {item.name} - $ {item.price}
                  </h6>
                  {item.cart === false && (
                    <button
                      className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600"
                      onClick={() => addToCart(item)}
                    >
                      Add to cart
                    </button>
                  )}
                  {item.cart === true && (
                    <button
                      className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600"
                      onClick={() => addToCart(item)}
                    >
                      Added
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row mt-3">
          <table className="table text-center">
            <thead>
              <tr>
                <th scope="col" className="text-left px-4 py-2">
                  #
                </th>
                <th scope="col" className="text-left px-4 py-2">
                  Product
                </th>
                <th scope="col" className="text-left px-4 py-2">
                  Product Name
                </th>
                <th scope="col" className="text-left px-4 py-2">
                  Price
                </th>
                <th scope="col" className="text-left px-4 py-2">
                  Quantity
                </th>
                <th scope="col" className="text-left px-4 py-2">
                  Remove
                </th>
              </tr>
            </thead>
            <tbody>
              {cart.map((i, index) => (
                <tr key={i.id}>
                  <th scope="row" className="text-left px-4 py-2">
                    {index + 1}
                  </th>
                  <th scope="row" className="text-left px-4 py-2">
                    <img src={i.url} alt="" className="h-12" />
                  </th>
                  <td className="text-left px-4 py-2">{i.name}</td>
                  <td className="text-left px-4 py-2">{i.price}</td>
                  <td className="text-left px-4 py-2">
                    <button
                      onClick={() => decreaseQuantity(i)}
                      className="bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600"
                    >
                      -
                    </button>
                    {i.quantity}
                    <button
                      onClick={() => increaseQuantity(i)}
                      className="bg-gray-500 text-white rounded-md p-2 hover:bg-gray-600"
                    >
                      +
                    </button>
                  </td>
                  <td className="text-left px-4 py-2">
                    <button
                      onClick={() => removeFromCart(i)}
                      className="bg-red-500 text-white rounded-md p-2 hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="row">
          <div className="col text-center">
            <h4 className="text-xl">TOTAL: {total()}</h4>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
