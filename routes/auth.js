const router = require("express").Router();
//Modal import for user
const User = require("../modals/user")
const bcrypt = require("bcrypt")
//ROUTES LINKING

//Register
router.post("/register", async (req, res) => {
    try {
        //generate hashed password and save it to database
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        //create user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword
        });
        //saving user to database
        const user = await newUser.save();
        res.status(200).json(user);
        console.log("Saved user")
    }
    catch (err) {
        res.status(500).json(err)
    }
    res.send("Save d john to database")
})

//Login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        !user && res.status(404).json("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(404).json("Wrong password")

        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router;