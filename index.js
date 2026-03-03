const express = require('express');
const mongoose = require('mongoose'); 
const app = express();

const authkeypublic = process.env.AUTHPUBLIC;
const mongoURI = process.env.MONGO_URI;

app.use(express.json());

mongoose.connect(mongoURI)
  .then(() => console.log("Sucesss!"))
  .catch(err => console.error("Error nooooooo!!!!!:", err));

const ProfileSchema = new mongoose.Schema({
    nome: String,
    level: Number,
    createdIn: { type: Date, default: Date.now }
});
const Profile = mongoose.model('Profile', ProfileSchema);

app.get("/server/ping", (req, res) => {
    if (req.headers["x-authpublic-key"] === authkeypublic) {
        return res.send("Pong 🏓");
    }
    return res.destroy();
});

app.post("/profiles/save", async (req, res) => {
    if (req.headers["x-authpublic-key"] !== authkeypublic) return res.destroy();

    try {
        const newProfile = new Profile(req.body);
        await newProfile.save();
        res.status(201).json({ msg: "Profile is save!" });
    } catch (err) {
        res.status(500).json({ error: "Error in save." });
    }
});

app.get("/get/profiles", async (req, res) => {
    if (req.headers["x-authpublic-key"] !== authkeypublic) return res.destroy();

    const perfils = await Profile.find();
    res.json(perfils);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor na porta ${PORT}`));
