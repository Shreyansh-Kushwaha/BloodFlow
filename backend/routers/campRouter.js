const router = require("express").Router();
const auth = require("../middleware/auth");
const { Camp, BloodBank, User, CampDonor } = require("../models/models");

router.post("/", auth, async (req, res) => {
    try {
        req.body.bankId = req.user;
        await Camp.create(req.body);
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/:state?/:district?", auth, async (req, res) => {
    try {
        let whereClause = {};
        if (req.params.state) {
            whereClause.state = req.params.state;
            whereClause.district = req.params.district;
        } else {
            whereClause.bankId = req.user;
        }
        
        const data = await Camp.findAll({
            where: whereClause,
            include: [
                {
                    model: BloodBank,
                    attributes: { exclude: ['password'] }
                },
                {
                    model: User,
                    as: 'donors',
                    attributes: { exclude: ['password'] },
                    through: { attributes: ['units', 'status'] }
                }
            ]
        });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/allCamps/:state/:district/:date", async (req, res) => {
    try {
        if (req.params.date) {
            const data = await Camp.findAll({
                where: {
                    state: req.params.state,
                    district: req.params.district,
                    date: new Date(req.params.date)
                },
                include: [{
                    model: BloodBank,
                    attributes: { exclude: ['password'] }
                }]
            });
            res.json(data);
        } else {
            res.json({});
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/:id/:userId?", auth, async (req, res) => {
    try {
        if (req.params.userId) {
            await CampDonor.update(
                { units: req.body.units, status: 1 },
                { 
                    where: { 
                        campId: req.params.id, 
                        userId: req.params.userId, 
                        status: 0 
                    } 
                }
            );
        } else {
            await CampDonor.findOrCreate({
                where: { 
                    campId: req.params.id, 
                    userId: req.user 
                },
                defaults: {
                    units: 0,
                    status: 0
                }
            });
        }
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;