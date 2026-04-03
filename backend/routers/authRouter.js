const router = require("express").Router();
// Make sure this path points to your new Sequelize models file
const { User, BloodBank } = require("../models/models"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register
router.post("/:handle", async (req, res) => {
    try {
        // validation
        const handle = req.params.handle; 
        
        // 1. Sequelize uses { where: { field: value } }
        const existingUser = handle == "bank" ?
            await BloodBank.findOne({ where: { phone: req.body.phone } }) :
            await User.findOne({ where: { phone: req.body.phone } });
            
        if (existingUser)
            return res.status(400).json({
                errorMessage: "An account with this phone number already exists.",
            });

        // hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        req.body.password = passwordHash;
        
        // 2. Sequelize uses Model.create() instead of new Model() + save()
        const savedUser = handle == "bank" ? 
            await BloodBank.create(req.body) : 
            await User.create(req.body);

        // 3. MySQL uses 'id' instead of '_id'
        const token = jwt.sign({ user: savedUser.id, type: handle }, process.env.JWT_SECRET);

        // send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// log in
router.post("/login/:handle", async (req, res) => {
    try {
        const { phone, password } = req.body;
        const handle = req.params.handle;
        
        // Sequelize findOne syntax
        const existingUser = await (handle == "bank" ? 
            BloodBank.findOne({ where: { phone: phone } }) : 
            User.findOne({ where: { phone: phone } }));
            
        if (!existingUser)
            return res.status(401).json({ errorMessage: "Wrong username or password." });
            
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );
        
        if (!passwordCorrect)
            return res.status(401).json({ errorMessage: "Wrong username or password." });

        // sign the token using standard 'id'
        const token = jwt.sign(
            {
                user: existingUser.id,
                type: handle
            },
            process.env.JWT_SECRET
        );

        // send the token in a HTTP-only cookie
        res
            .cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

// logout
router.get("/logout", (req, res) => {
    res
        .cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .send();
    console.log("Logged Out");
});

// check logged in status
router.get("/loggedIn", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.json({ auth: false });
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Use findByPk (Find By Primary Key) and attributes.exclude instead of Mongoose projections
        const user = await (verified.type == "bank" ? BloodBank : User).findByPk(verified.user, {
            attributes: { exclude: ['password'] } 
        });
        
        if (!user) return res.json({ auth: false });

        console.log("logged in");
        res.send({ auth: true, user: user });
    } catch (err) {
        console.log(err);
        res.json({ auth: false });
    }
});

module.exports = router;