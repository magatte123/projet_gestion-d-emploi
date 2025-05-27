// server/index.js
const http = require('http'); 
const fs = require('fs'); 
const path = require('path'); 
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, 'data', 'users.json'); 

function getUsers() { 
const data = fs.readFileSync(usersFile, 'utf-8'); 
return JSON.parse(data); 
} 


function saveUsers(users) { 
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8'); 
} 


function parseBody(req, callback) { //Verifie si le corps de la requete est bien formé
let body = ''; 
req.on('data', chunk => body += chunk); 
req.on('end', () => callback(JSON.parse(body))); 
} 


const server = http.createServer((req, res) => { 
   // Autorise les requêtes cross-origin
   res.setHeader('Access-Control-Allow-Origin', '*');//permet de corriger
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
   // Gérer les requêtes préliminaires OPTIONS (préflight)
   if (req.method === 'OPTIONS') {
     res.writeHead(200);
     return res.end();
    }

if (req.url === '/register' && req.method === 'POST') { 
  parseBody(req, async (userData) => { 
    const users = getUsers(); 
    const exists = users.find(u => u.email === userData.email);
    if (exists) { 
      res.writeHead(400, { 'Content-Type': 'application/json' }); 
      return res.end(JSON.stringify({ error: 'Email déjà utilisé' })); 
    } 
    // Hash du mot de passe AVANT d'enregistrer
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    users.push(userData); 
    saveUsers(users);
    res.writeHead(201, { 'Content-Type': 'application/json' }); 
    res.end(JSON.stringify({ message: 'Inscription réussie' })); 
  }); 
} 
else if (req.url === '/login' && req.method === 'POST') { 
  parseBody(req, async (loginData) => { 
    const users = getUsers(); 
    const user = users.find(u => u.email === loginData.email);
    if (!user) { 
      res.writeHead(401, { 'Content-Type': 'application/json' }); 
      return res.end(JSON.stringify({ error: 'Email ou mot de passe incorrect' })); 
    } 
    // Vérifie le mot de passe hashé
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      res.writeHead(401, { 'Content-Type': 'application/json' }); 
      return res.end(JSON.stringify({ error: 'Email ou mot de passe incorrect' })); 
    }
    res.writeHead(200, { 'Content-Type': 'application/json' }); 
    res.end(JSON.stringify({ message: 'Connexion réussie' })); 
  }); 
} 
else if (req.url === '/users' && req.method === 'GET') {
  const users = getUsers();
  // On retire le mot de passe de chaque utilisateur
  const usersSansMdp = users.map(({ password, ...rest }) => rest);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(usersSansMdp));
}
else { 
  res.writeHead(404); 
  res.end(); 
} }); 


server.listen(3000, () => { 
console.log('Serveur démarré sur http://locahost:3000'); 
});

