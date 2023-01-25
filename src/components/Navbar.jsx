import { deleteUser, signOut } from "@firebase/auth";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { auth } from "../firebase";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);


  const navigate = useNavigate();

  const handleLogout = async () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async () => {
    deleteUser(auth.currentUser)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <nav className="bg-gray-800 p-6 flex items-center justify-between ">
      <Link to="/" className="text-white font-medium">
        My App
      </Link>
      <div className="flex items-center px-20">
        <Link to="/admin" className="text-white font-medium mr-4">
          Dashboard
        </Link>
        {currentUser ? (
          <>
            <div
              className="flex items-center"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4 object-cover"
              />
              <span className="text-white font-medium mr-4">
                {currentUser.displayName}
              </span>

              {isModalOpen && (
                <div className="fixed top-24 right-2 bg-black border rounded-md">
                  <div className="w-40 h-30 p-6 bg-white b-1 flex flex-col gap-2">
                    <div className="bg-blue-500 text-white py-1 px-2 rounded-lg hover:bg-blue-600 text-center">
                      <Link to="/mise-a-jour">Modify</Link>
                    </div>
                    <button
                      onClick={() => handleLogout()}
                      className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600"
                    >
                      Logout
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      className="bg-red-500 text-white py-1 px-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/se-connecter" className="text-white font-medium mr-4">
              Se connecter
            </Link>
            <Link to="/creer-un-compte" className="text-white font-medium">
              Créer un compte
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
