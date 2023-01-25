import Navbar from "../../components/Navbar";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../../contexts/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();

  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErr("");
    setLoading(true);

    if (!email || !password) {
      setErr("Email et mot de passe sont requis");
      setLoading(false);
      return;
    }

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        dispatch({ type: "LOGIN", payload: user });
        // ...
        navigate("/admin");
      })
      .catch(() => {
        setErr("Identifiant ou mot de passe incorrect");
      });
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-4">
        <form
          action=""
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              className={`${
                err ? "border-red-500" : ""
              } border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {err && <p className="text-red-500 text-xs italic">{err}</p>}
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Mot de passe
            </label>
            <input
              className={`${
                err ? "border-red-500" : ""
              } border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {err && <p className="text-red-500 text-xs italic">{err}</p>}
          </div>
          <input
            className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
            value="Se connecter"
          />
        </form>
      </div>
    </>
  );
}

export default LoginPage;
