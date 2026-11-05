const express = require("express");
const{ db, Inscriere } = require("./config.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');


const fields = ["nume", "telefon", "email", "numeEchipa", "nrParticipanti", "legatOchi", "acord_termeni"]

app.use(express.static(path.join(__dirname, '../')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.post("/inscriere", async (req, res) => {
    const data = req.body

    const missingField = fields.filter(field => !data[field])
    if(missingField.length > 0){
        return res.status(400).json({err: true, msg:"Campuri lipsa", missingField})
    }

    const errors = [];


    if (data.acord_termeni !== "on") {
        errors.push("Trebuie sa bifezi declaratia")
    }

    if (errors.length > 0) {
        return res.status(400).json({ err: true, msg: "Date invalide", errors })
    }

    try {
        const existName = await Inscriere.findOne({
            where: {
                numeEchipa: data.numeEchipa
            }
        })
        if (existName) {
            return res.status(400).json({ err: true, msg: `Echipa ${data.numeEchipa} exista deja` })
        }

        await Inscriere.create({
            nume: data.nume,
            telefon: data.telefon,
            email: data.email,
            numeEchipa: data.numeEchipa,
            nrParticipanti: Number(data.nrParticipanti),
            membri: data.membri,
            legatOchi: data.legatOchi,
            sacrificiu: data.sacrificiu
        })
        return res.status(201).json({ err: false, msg: `Echipa ${data.numeEchipa} a fost inregistrata!` })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ err: true, msg: "Cv nu a mers bn =(" })
    }

})

async function start() {
    const PORT = process.env.PORT || 3001;
    await db.sync({force : true }).then(() => {
        console.log("DB a fost resetata")
     });
    app.listen(PORT, () => console.log("Serverul ruleaza pe portul ${PORT}"));
}
start();