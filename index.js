// This is our actual server
const express = require("express")
const app = express()
const port = 7568



// importing database function
const connectDb = require("./database/db")
connectDb()

// make sure you always put this function directly under "connectDb" function
// middleware
app.use(express.json())


// importing user routes
const userRoute = require("./routes/userRoutes")

// using the user route
app.use("/api/user", userRoute)

// testing route
app.get("/api", (request, response) => {
  response.json({message:"Welcome to my server...."})
})


















app.listen(port, () => {
  console.log("Server connected successfully");
  
})