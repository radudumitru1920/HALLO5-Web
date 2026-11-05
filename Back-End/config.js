const { Sequelize, DataTypes } = require("sequelize");

const db = new Sequelize({
    dialect: "sqlite",
    storage: "./db.sqlite",
    logging: false,
});

const Inscriere = db.define("inscriere", {
    nume: { type: DataTypes.STRING, allowNull: false },
    telefon: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    numeEchipa: { type: DataTypes.STRING, allowNull: false, unique: true },
    nrParticipanti: { type: DataTypes.INTEGER, allowNull: false },
    membri: { type: DataTypes.STRING },
    legatOchi: { type: DataTypes.BOOLEAN, allowNull: false },
    sacrificiu: { type: DataTypes.STRING },
}, {
    freezeTableName: true,
});

module.exports = {
    db,
    Inscriere
};
