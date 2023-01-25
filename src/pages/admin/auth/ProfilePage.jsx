import { updateEmail, updatePassword, updateProfile } from "@firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import { AuthContext } from "../../../contexts/AuthContext";
import { auth, db, storage } from "../../../firebase";

function ProfilePage() {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const { currentUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const date = new Date().getTime();
      const storageRef = ref(storage, `image-users/${currentUser.displayName + date}`);
      const photoURL = e.target[3].files[0];

      if (user.displayName) {
          await updateProfile(auth.currentUser, {
            displayName: user.displayName,
            email: user.email,
            password: user.password,
            photoURL: user.photoURL,
          });
        }
    
        if (user.email) {
          await updateEmail(auth.currentUser, user.email);
        }

    
        if (user.password) {
          await updatePassword(auth.currentUser, user.password);
        }

        await setDoc(doc(db, "users", currentUser.uid), {
          uid: currentUser.uid,
          displayName: user.displayName,
          email: user.email,
          timeStamps: serverTimestamp(),
          photoURL: user.photoURL,
        });

      await uploadBytesResumable(storageRef, photoURL).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(auth.currentUser, {
              displayName: e.target[0].value,
              email: e.target[1].value,
              password: e.target[2].value,
              photoURL: downloadURL,
            });
            navigate("/se-connecter");
          } catch (err) {
            console.log(err);
          }
        });
      });
      navigate("/se-connecter");
    } catch (err) {
      console.log(err);
      setErr("Echec de la mise à jour du profil");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 min-h-screen flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
          <div className="mb-4">
            {loading && "Mise à jour du profil en cours..."}
            {err && (
              <div className="text-red-500 text-sm font-medium">{err}</div>
            )}
            <label
              htmlFor="displayName"
              className="block text-gray-700 font-medium mb-2"
            >
              Nom d'affichage
            </label>
            <input
              className="border border-gray-400 p-2 w-full"
              type="text"
              id="displayName"
              placeholder={currentUser.displayName}
              onChange={(e) =>
                setUser({ ...user, displayName: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Adresse email
            </label>
            <input
              className="border border-gray-400 p-2 w-full"
              type="email"
              id="email"
              placeholder={currentUser.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Mot de passe
            </label>
            <input
              className="border border-gray-400 p-2 w-full"
              type="password"
              id="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="photo"
              className="block text-gray-700 font-medium mb-2"
            >
              Photo de profil
            </label>
            <input
              className="border border-gray-400 p-2 w-full"
              type="file"
              id="photo"
              onChange={(e) => setUser({ ...user, photoURL: e.target.value })}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600"
              type="submit"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ProfilePage;
