// Importation du module express
const express = require('express');
const fs = require('fs')

// Création d'une application avec Express
const app = express();

// Définition d'une constante utilisateur
const userList = [
    {id: 1, username: 'Jerem Shaaqx', role: 'admin'},
    {id: 2, username: 'Waarie Saphir', role: 'user'},
    {id: 3, username: 'Thib Saccx', role: 'user'}
]

// Alias pour le console.log
const log = console.log;

// Définition des routes

app.get( '/user', (req, res) => {
        res.status(200).json(userList);
    });

app.get( '/user/:id', (req, res) => {
        const user = userList.find((item) => item.id == req.params.id)
        if(user) {
            res.status(200).json({success: true, data: user})
        } else {
            res.status(404).json({success: false, message: 'Utilisateur inconnu'})
        }
    });


app.get( '/', (req, res) => {
        res.status(200).send('Home sweet home');
    });

// Route avec un parametre et un contrainte sur la valeur de ce parametre
app.get('/hello/:id([0-9]+)', (req, res) => {
        res.status(200).send('Hello votre id est : ' + req.params.id)
    });

// Route avec un parametre
app.get('/hello/:name', (req, res) => {
    res.status(200).send('Hello ' + req.params.name)
    });

// Route récupérant des données d'un querystring
app.get('/produit', (req, res) => {
    /** Récupération de la variable page du query
     *  valeur par defaut = 1
     */
        const page = req.query.page || 1;
    res.status(200).send('Produit page n° ' + page)
    });


app.get('/addition/:n1([0-9]+)/:n2([0-9]+)', (req, res) => {
    const result = (req.params.n1 * 1   + req.params.n2 * 1);
        res.status(200).send('Le resultat est : ' + result)
    });



app.get('/file/:filename', async  (req, res) => {
    try {
        const filePath = './data/' + req.params.filename + '.txt'
        data = await fs.promises.readFile(filePath);
        res.status(200).send(data.toString())
    } catch (err) {
        res.status(404).send('Fichier introuvable');
    }});




// Lancement de l'application
app.listen(3000, () => console.log('Serveur lancé'));