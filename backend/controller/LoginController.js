const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig");
const auth = require("../../src/components/Login/firebase");

const Register = async (req, res) => {
  const { email, uid } = req.body;
  console.log(email, uid);
  try {
    db.query(
      "INSERT INTO users (email, firebaseUid) VALUES (?, ?)",
      [email, uid],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "Error registering user" });
        } else {
          console.log(result);
          res.status(200).json({ message: "User registered successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const Login = async (req, res) => {
  console.log("Request Body:", req.body);
  const { email } = req.body.email;
  const uid = console.log(email);
  if (!email) {
    return res.status(400).json({ message: "Missing email or UID" });
  }

  // Logic to register the user in the database
  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Error registering user" });
      } else {
        console.log(result);
        res.status(200).json({ message: "User Loginin successfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { Register, Login };
