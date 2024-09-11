const User = require("../models/userModel") 
const bcrypt = require("bcrypt")


const registerUser = async (request, response) => {
  const {firstName, lastName, email, phone, password} = request.body

  const userExists = await User.findOne({email})

  if (userExists) {
    return response.status(400).json({error : "User already exists...."})
  }

  const newUser = await User.create({firstName, lastName, email, phone, password})
  if (newUser) {
    response.status(201).json({message : "User successfully registered"})
  } else {
    response.status(400).json({error : "Invalid user data"})
  }
}

// This is user login function
const loginUser = async (request, response) => {
  // Extract email and password from the request body
  const { email, password } = request.body;

  // Check if user exists by email
  const user = await User.findOne({ email });
  
  if (!user) {
      return response.status(400).json({ error: "Invalid email or password" });
  }

  // Verify password (assuming passwords are hashed using bcrypt)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
      return response.status(400).json({ error: "Invalid email or password" });
  } else {
      response.status(200).json({message: "Login successful",})
    }
}



module.exports = {registerUser, loginUser}