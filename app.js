const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const usersFile = path.join(__dirname, 'server', 'data', 'users.json');

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Champs manquants' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword
    };

    let users = [];
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile));
    }
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.json({ message: 'Utilisateur enregistré', id: newUser.id });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let users = [];
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile));
    }
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    res.json({ message: "Connexion réussie" });
});

app.get('/users', (req, res) => {
    let users = [];
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile));
    }
    // On retire le mot de passe de chaque utilisateur
    const usersSansMdp = users.map(({ password, ...rest }) => rest);
    res.json(usersSansMdp);
});

app.listen(3000, () => console.log('Serveur démarré sur http://localhost:3000'));