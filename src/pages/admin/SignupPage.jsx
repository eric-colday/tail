import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { doc, serverTimestamp, setDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../components/Navbar";
import { auth, db, storage } from "../../firebase";

function SignupForm() {
  const [err, setErr] = useState(false);
  const [errDisplayName, setDisplayName] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPassword, setPassword] = useState(false);
  const [errFile, setFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!displayName) {
      setDisplayName("Username ne peut pas être vide");
    }

    if (!email) {
      setErrEmail("Email ne peut pas être vide");
    } else if (!regex.test(email)) {
      setErrEmail("Entre une adresse e-mail valide pour continuer");
    }
    if (password) {
      setPassword("Mot de passe ne peut pas être vide");
    } else if (password.length < 6) {
      setPassword("Le password doit contenir au moins 6 caractères");
    }

    if (!file) {
      setFile("File ne peut pas être vide");
    }

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);
      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `image-users/${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              timeStamp: serverTimestamp(),
              photoURL: downloadURL,
            });
            navigate("/admin");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch {
      setErr("échec d'inscription");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
        <div className="mb-4">
          {loading && "Uploading and compressing the image please wait..."}
          {err && <div className="email-error">{err}</div>}
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-2"
          >
            Nom d'utilisateur
          </label>
          <input
            className={`${
              errDisplayName ? "border-red-500" : ""
            } border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            type="text"
            placeholder="username"
            required
          />
          {errDisplayName && (
            <p className="text-red-500 text-xs italic">{errDisplayName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email
          </label>
          <input
            className={`${
              errEmail ? "border-red-500" : ""
            } border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            type="email"
            placeholder="email"
            required
          />
          {errEmail && (
            <p className="text-red-500 text-xs italic">{errEmail}</p>
          )}
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
            required
          />
          {errPassword.password && (
            <p className="text-red-500 text-xs italic">{errPassword}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 font-medium mb-2"
          >
            Image de profil
          </label>
          <input
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="file"
            placeholder="image"
            required
          />
          {errFile && <p className="text-red-500 text-xs italic">{errFile}</p>}
        </div>
        <input
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          type="submit"
          disabled={loading}
          value="S'inscrire"
        />
      </form>
    </>
  );
}

export default SignupForm;
