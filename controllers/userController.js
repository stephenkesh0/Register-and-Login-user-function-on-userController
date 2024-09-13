const User = require("../models/userModel") 
const bcrypt = require("bcrypt")
const generateToken = require("../utility/generateToken")
const { request, response } = require("express")
const crypto = require("crypto")
const sendMail = require("../utility/email")


const registerUser = async (request, response) => {
  const {firstName, lastName, email, phone, password} = request.body

  const userExists = await User.findOne({email})

  if (userExists) {
    return response.status(400).json({error : "User already exists...."})
  }

  const user = await User.create({firstName, lastName, email, phone, password})
  if (user) {
    const token = generateToken(user._id)

    response.cookie("jwt", token, {
      httpOnly : true,
      sameSite : "strict",
      maxAge : 30*24*60*60*1000,
    })

    response.status(201).json({
      message : "User registered successfully....",
      user,
      token
    })
    
  } else {
    response.status(400).json({error : "Invalid user data"})
  }
}




// this is userLogin function
const userLogin = async (request, response) => {
  const {email, password} = request.body

  // to check if the user exists
  const user = await User.findOne({email})

  // use this to compare passwords
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id)

    
    response.cookie("jwt", token, {
      httpOnly : true,
      sameSite : "strict",
      maxAge : 30*24*60*60*1000,
    })

    response.status(200).json({
      message : "User logged in successfully....",
      user,
      token
    })
  } else{
    response.status(401).json({error : "Invalid user email or password"})
  }
}


const forgotPassword = async (request, response) => {
  const {email} = request.body

  // check if user exist
  const user = await User.findOne({email})

  if (!user) {
    response.status(404)
    throw new Error("User not found")
  }

  // generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex")
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  // this is where you set how long the reset token will last
  user.resetPasswordExpire = Date.now() + 10*60*1000

  await user.save()

  const resetUrl = `${request.protocol}://${request.get("host")}/api/user/reset-password/${resetToken}`
  const message = `You are receiving this email because you or someone else has requested a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`

  await sendMail({
    email : user.email,
    subject : "Password reset token",
    message : message
  })

  response.status(200).json({success : true, data : "Reset link sent to email...."})

}



// export the codes here

module.exports = {registerUser, userLogin, forgotPassword}