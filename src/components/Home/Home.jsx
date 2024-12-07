import React from "react";
import auth from "../Login/firebase";
import { toast } from "react-toastify";

export const Home = () => {
  const handleLogOut = async () => {
    try {
      await auth.signOut();
      toast.success("Logout successful");
      window.location.href = "/";
      // window.
    } catch (e) {
      console.log(e, "Error logging out");
    }
  };
  return (
    <>
      <div>
        <span className="text-3xl font-bold underline text-black">
          <h1>Home</h1>
        </span>
        <button onClick={() => (window.location.href = "/calender")}>
          Calender
        </button>
        <button onClick={handleLogOut}>Logout</button>
      </div>
    </>
  );
};

export default Home;
