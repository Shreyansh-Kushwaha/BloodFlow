const router = require("express").Router();
const auth = require("../middleware/auth");
const { User, Donation, Request, BloodBank } = require("../models/models");

router.get("/", auth, async (req, res) => {
    try {
        console.log("hum yha hain");
        const user = await User.findAll({ where: { id: req.user } });
        console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post("/donate", auth, async (req, res) => {
    try {
        req.body.userId = req.user;
        req.body.date = new Date(); 
        
        await Donation.create(req.body);
        
        res.send("done");
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post("/request", auth, async (req, res) => {
    try {
        req.body.userId = req.user;
        req.body.date = new Date();
        
        await Request.create(req.body);
        
        res.send("done");
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/donations", auth, async (req, res) => {
    try {
        const data = await Donation.findAll({
            where: { userId: req.user },
            include: [{
                model: BloodBank,
                attributes: { exclude: ['password'] }
            }]
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/requests", auth, async (req, res) => {
    try {
        const data = await Request.findAll({
            where: { userId: req.user },
            include: [{
                model: BloodBank,
                attributes: { exclude: ['password'] }
            }]
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/", auth, async (req, res) => {
    try {
        console.log(req.user);
        const [updatedRows] = await User.update(req.body, { 
            where: { id: req.user } 
        });

        if (updatedRows === 0) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send("User updated");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;