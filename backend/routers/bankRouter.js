const router = require("express").Router();
const auth = require("../middleware/auth");
// Make sure these match the exact exported names from your models/index.js file
const { User, BloodBank, Donation, Request, Camp } = require("../models/models");

// Helper function to map Frontend blood group strings to MySQL column names
const getStockColumn = (bloodGroup) => {
    const map = {
        'A+': 'stock_A_plus', 'A-': 'stock_A_minus',
        'B+': 'stock_B_plus', 'B-': 'stock_B_minus',
        'AB+': 'stock_AB_plus', 'AB-': 'stock_AB_minus',
        'O+': 'stock_O_plus', 'O-': 'stock_O_minus'
    };
    return map[bloodGroup];
};

router.post("/:handle", auth, async (req, res) => {
    try {
        const excludeFields = req.params.handle == "bank" ? [] : ['password'];
        
        // Sequelize uses { where: { ... } }
        const banks = await BloodBank.findAll({
            where: req.body,
            attributes: { exclude: excludeFields }
        });
        res.json(banks);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/allBanks/:state/:district", async (req, res) => {
    try {
        const banks = await BloodBank.findAll({
            where: { 
                state: req.params.state, 
                district: req.params.district 
            },
            attributes: { exclude: ['password'] }
        });
        res.json(banks);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/updateStock", auth, async (req, res) => {
    try {
        const column = getStockColumn(req.body.bloodGroup);
        if (!column) return res.status(400).send("Invalid blood group");

        // Sequelize has a built-in increment method!
        await BloodBank.increment(column, { 
            by: req.body.units, 
            where: { id: req.user } 
        });
        
        res.status(200).send();
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/deleteStock", auth, async (req, res) => {
    try {
        const column = getStockColumn(req.body.bloodGroup);
        if (!column) return res.status(400).send("Invalid blood group");

        // Fetch just the specific column we need to check
        const bank = await BloodBank.findByPk(req.user, { attributes: [column] });

        if (bank[column] < req.body.units) {
            res.status(404).send("Not enough blood");
        } else {
            // Built-in decrement method
            await BloodBank.decrement(column, { 
                by: req.body.units, 
                where: { id: req.user } 
            });
            res.status(200).send();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/getStock", auth, async (req, res) => {
    try {
        const bank = await BloodBank.findByPk(req.user, {
            attributes: [
                'stock_A_plus', 'stock_A_minus', 'stock_B_plus', 'stock_B_minus',
                'stock_AB_plus', 'stock_AB_minus', 'stock_O_plus', 'stock_O_minus'
            ]
        });

        // Reconstruct the nested object so your frontend doesn't break
        const stockData = {
            'A+': bank.stock_A_plus,
            'A-': bank.stock_A_minus,
            'B+': bank.stock_B_plus,
            'B-': bank.stock_B_minus,
            'AB+': bank.stock_AB_plus,
            'AB-': bank.stock_AB_minus,
            'O+': bank.stock_O_plus,
            'O-': bank.stock_O_minus
        };

        res.status(200).send({ stock: stockData });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/donations", auth, async (req, res) => {
    try {
        // Sequelize update returns an array where the first element is the number of affected rows
        const [updatedRows] = await Donation.update(
            { status: req.body.status },
            { where: { id: req.body.id } }
        );

        if (updatedRows === 0) {
            res.status(404).send("Donation not found");
        } else {
            res.status(200).send("Status updated");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.put("/requests", auth, async (req, res) => {
    try {
        const [updatedRows] = await Request.update(
            { status: req.body.status },
            { where: { id: req.body.id } }
        );

        if (updatedRows === 0) {
            res.status(404).send("Request not found");
        } else {
            res.status(200).send("Status updated");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/donations", auth, async (req, res) => {
    try {
        // Mongoose .populate() is replaced by Sequelize 'include'
        const data = await Donation.findAll({
            where: { bankId: req.user },
            include: [{
                model: User,
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
            where: { bankId: req.user },
            include: [{
                model: User,
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
        const [updatedRows] = await BloodBank.update(req.body, { 
            where: { id: req.user } 
        });

        if (updatedRows === 0) {
            res.status(404).send("BloodBank not found");
        } else {
            res.status(200).send("BloodBank updated");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;