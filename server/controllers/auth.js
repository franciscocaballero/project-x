import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    //encrypt password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    //create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    //save user
    const savedUser = await newUser.save();
    // send createrd user for front end
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    //Get login info from fron-end
    const { email, password } = req.body;
    //Find user that mathces email
    const user = await User.findOne({ email: email });
    //Verify that a use with that email exist.
    // if not return error message
    if (!user) return res.status(400).json({ message: "User does not exist." });
    // if they do exist compare password hashes to verify they match
    const isMatch = await bcrypt.compare(password, user.password);
    // if they did not match return err
    if (!isMatch) return res.status(400).json({ msg: "invailid credentails." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // delete pw so that it doesn't get sent to Front-end
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
