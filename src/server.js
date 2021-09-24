require("dotenv").config()
const express = require("express");

const passport = require("./configs/passport");

const {register, login} = require("./controllers/auth.controller")
const productController = require("./controllers/product.controller");

const connect = require("./configs/db")

const app = express();

app.use(express.json());

app.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user)
});

app.get("/", function(req, res) {
    res.send("hello");
})

app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    function (req, res) {
      return res.status(201).json({ status: "success", user: req.user });
    }
  );

app.post("/register", register); 
app.post("/login", login);
app.use("/products", productController);

app.listen(process.env.SERVER_PORT, async function (){
    await connect();
    console.log(`listening on port ${process.env.SERVER_PORT}`);
})