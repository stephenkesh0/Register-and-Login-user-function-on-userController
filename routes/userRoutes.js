// This is where we will be defining all the endpoints or links 
// Users endpoins will be defined here 
const express = require("express")
const { registerUser, loginUser } = require("../controllers/userController")

const router = express.Router()

router.post("/register", registerUser)


router.post("/login", loginUser)







module.exports = router