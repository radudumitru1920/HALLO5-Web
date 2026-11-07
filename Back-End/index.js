const express = require("express");
const{ db, Inscriere } = require("./config.js");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');

 const rules = {
    nume: /^[A-Za-zĂÂÎȘȚăâîșț-]+( [A-Za-zĂÂÎȘȚăâîșț-]+)+$/,
    telefon: /^07\d{2} ?\d{3} ?\d{3}$/,
    email: /^[\w.-]+@[\w-]+\.[a-z]{2,}$/i,
    nume_echipa: /^.{3,30}$/,
    nr_participanti: /^[3-6]$/,
    interval: /^(14:00-15:30|16:00-17:30|18:00-19:30|20:00-21:30)$/,
    legat_ochi: /^(da|nu)$/,
};


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
   for (const field in rules) {
        if (!rules[field].test(data[field] ?? "")) {
            errors.push(`${field} este invalid`)
        }
    }

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