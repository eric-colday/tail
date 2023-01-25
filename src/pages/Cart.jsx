import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { iosTrashOutline } from "react-icons-kit/ionicons/iosTrashOutline";
import { ic_add, ic_remove } from "react-icons-kit/md";

function Cart() {
  const { cart , dispatch } = useContext(CartContext);
  const { shoppingCart, totalPrice, totalQty } = cart;
  return (
    <div>
      {shoppingCart.length !== 0 && (
        <h1 className="text-2xl font-medium mb-4">Cart</h1>
      )}
      <div className="cart-container">
        {shoppingCart.length === 0 && (
          <>
            <div className="text-md text-gray-700">
              no items in your cart or slow internet causing trouble (Refresh
              the page) or you are not logged in
            </div>
            <div className="mt-4">
              <Link to="/" className="text-blue-500">
                Return to Home page
              </Link>
            </div>
          </>
        )}
        {shoppingCart &&
          shoppingCart.map((cart) => (
            <div
              className="cart-card flex justify-between items-center mb-4"
              key={cart.id}
            >
              <div className="cart-img w-24 h-24 mr-4">
                <img src={cart.image} alt="not found" />
              </div>

              <div className="cart-name text-lg font-medium">
                {cart.name}
              </div>

              <div className="cart-price-orignal text-md text-gray-700">
                 {cart.price}
              </div>

              <div
                className="inc cursor-pointer"
                onClick={() =>
                  dispatch({ type: "INC", id: cart.id, cart })
                }
              >
                <Icon icon={ic_add} size={24} />
              </div>

              <div className="quantity text-md font-medium mr-4">
                {cart.qty}
              </div>

              <div
                className="dec cursor-pointer"
                onClick={() =>
                  dispatch({ type: "DEC", id: cart.id, cart })
                }
              >
                <Icon icon={ic_remove} size={24} />
              </div>

              <div className="cart-price text-md font-medium mr-4">
                Rs {cart.TotalProductPrice}
              </div>

              <button
                className="delete-btn cursor-pointer"
                onClick={() =>
                  dispatch({ type: "DELETE", id: cart.id, cart })
                }
              >
                <Icon icon={iosTrashOutline} size={24} />
              </button>
            </div>
          ))}
        {shoppingCart.length > 0 && (
          <div className="cart-summary bg-gray-200 p-4 rounded-lg">
            <div className="cart-summary-heading text-lg font-medium mb-4">
              Cart-Summary
            </div>
            <div className="cart-summary-price flex justify-between items-center mb-2">
              <span className="text-md text-gray-700">Total Price</span>
              <span className="text-md font-medium"> {totalPrice}</span>
            </div>
            <div className="cart-summary-price flex justify-between items-center mb-4">
              <span className="text-md text-gray-700">Total Qty</span>
              <span className="text-md font-medium">{totalQty}</span>
            </div>
            <Link to="/cashout" className="cashout-link">
              <button
                className="btn btn-success btn-md"
                style={{ marginTop: 5 + "px" }}
              >
                Cash on delivery
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
