const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); 

// Setup your database connection using environment variables
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306, // Add this line!
        dialect: 'mysql',
        logging: false,
        // Aiven often requires SSL for security. 
        // If your connection is rejected, add the following:
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
);

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ------- User Model -------
const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    bloodGroup: { type: DataTypes.ENUM(...bloodGroups), allowNull: false },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT },
});

// ------- Blood Bank Model -------
const BloodBank = sequelize.define('BloodBank', {
    name: { type: DataTypes.STRING, allowNull: false },
    hospital: { type: DataTypes.STRING, allowNull: false },
    contactPerson: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING, allowNull: false },
    website: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: false },
    // Flattened Stock
    stock_A_plus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_A_minus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_B_plus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_B_minus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_AB_plus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_AB_minus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_O_plus: { type: DataTypes.INTEGER, defaultValue: 0 },
    stock_O_minus: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// ------- Donations Model -------
const Donation = sequelize.define('Donation', {
    units: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    disease: { type: DataTypes.STRING },
    status: { 
        type: DataTypes.ENUM('Pending', 'Approved', 'Denied', 'Donated'), 
        defaultValue: 'Pending', 
        allowNull: false 
    }
});

// ------- Requests Model -------
const Request = sequelize.define('Request', {
    name: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false },
    gender: { type: DataTypes.STRING, allowNull: false },
    bloodGroup: { type: DataTypes.ENUM(...bloodGroups), allowNull: false },
    units: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.TEXT },
    status: { 
        type: DataTypes.ENUM('Pending', 'Approved', 'Denied', 'Completed'), 
        defaultValue: 'Pending' 
    }
});

// ------- Camp Model -------
const Camp = sequelize.define('Camp', {
    name: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    district: { type: DataTypes.STRING, allowNull: false },
    organizer: { type: DataTypes.STRING, allowNull: false },
    contact: { type: DataTypes.STRING(20), allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
});

// ------- Camp Donors (Junction Model) -------
const CampDonor = sequelize.define('CampDonor', {
    units: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
});

// ==========================================
// Define Relationships (The SQL way)
// ==========================================

// User & BloodBank -> Donations
User.hasMany(Donation, { foreignKey: 'userId' });
Donation.belongsTo(User, { foreignKey: 'userId' });

BloodBank.hasMany(Donation, { foreignKey: 'bankId' });
Donation.belongsTo(BloodBank, { foreignKey: 'bankId' });

// User & BloodBank -> Requests
User.hasMany(Request, { foreignKey: 'userId' });
Request.belongsTo(User, { foreignKey: 'userId' });

BloodBank.hasMany(Request, { foreignKey: 'bankId' });
Request.belongsTo(BloodBank, { foreignKey: 'bankId' });

// BloodBank -> Camps
BloodBank.hasMany(Camp, { foreignKey: 'bankId' });
Camp.belongsTo(BloodBank, { foreignKey: 'bankId' });

// Camps <-> Users (Many-to-Many for Donors)
Camp.belongsToMany(User, { through: CampDonor, foreignKey: 'campId', as: 'donors' });
User.belongsToMany(Camp, { through: CampDonor, foreignKey: 'userId', as: 'attendedCamps' });

// Exports
module.exports = { sequelize, User, Donation, Request, BloodBank, Camp, CampDonor };