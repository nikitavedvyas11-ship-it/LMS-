require("dotenv").config(); //.config() — .env file read karne ki process chalata hai
const express=require("express"); //Express.js framework import kiya (Node.js se HTTP server banaya ja sakta hai, lekin Express routing, middleware aur request-response handling ko simpler banata hai
const mongoose=require("mongoose"); //mongoose library hai jo MongoDB database ko Node.js applications se integrate karne ke kaam aati hai
const app=express(); //Backend application bnata hai
//Middleware to read JSON request bodies
app.use(express.json()); //Jo bhi frontend se data aayega vo isko use karke read krega
app.use("/auth", require("./routes/authRoutes")); //Backend application mein "/auth" se start hone wale sabhi request ko authRoutes.js file handle karegi
//app.use() mein base path aur router file mein uske relative paths likhte hain
app.use("/students",require("./routes/studentRoutes")); //Frontend "/students/register" call karega to vo studentRoutes.js mein gaya
app.use("/courses", require("./routes/courseRoutes")); //courses folder se courses ke related requests manage honge
app.use("/faculty", require("./routes/facultyRoutes")); //faculty folder se faculty ke related requests manage honge
//Test route
app.get("/",(req,res)=>{
    res.status(200).json({
        message:"LMS server is running"
    });
});
//Server Port
const PORT=process.env.PORT||5000;
//Connect to MongoDB and strat server
const startServer=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI); //process.env — Node.js ka environment variables access karne ka object hai
        console.log("MongoDB connected successfully");
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        });
    }catch(error){
        console.log("Server startuo failed:",error.message);
    }
};
//Start the server
startServer();