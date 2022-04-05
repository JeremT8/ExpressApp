// Importation du module express
const express = require('express');
const fs = require('fs');

// Importation des CORS = Cross Origin Request Sharing
const cors = require('cors');
const req = require("express/lib/request");

// Création d'une application avec Express
const app = express();

// Définition d'une constante utilisateur
const userList = [
    {id: 1, username: 'Jerem Shaaqx', role: 'admin'},
    {id: 2, username: 'Waarie Saphir', role: 'user'},
    {id: 3, username: 'Thib Saccx', role: 'user'}
]

const userFilePath = './data/users.json';



// Alias pour le console.log
const log = console.log;


// Definition des middlewares
const maintenance = false;

app.use('/user*',(req, res, next) => {
// Ajoute une nouvelle clef à l'objet request
    req.now = new Date().toLocaleDateString();
    if(req.query.API_KEY === '123'){
        next()
    } else {
        res.status(403).json({message: 'Non autorisé'});
    }
});



// Lecture de la liste des utilisateurs
app.use('/user*', async (req, res, next) => {
    //console.log('test user')
    try {
        const data = await fs.promises.readFile(userFilePath);
        const users = data.toString() || []
        req.userList = JSON.parse(users);
        next();
    } catch (err) {
        log(err)
        res.status(500).json({message: 'Impossible de lire le fichier'})
    }
});


app.use((req, res, next) => {
    //console.log(req.userList)
    if(maintenance){
        res.status(200)
            .end('Site en maintenance, il revient très vite');
    } else {
        next();
    }
});


app.use(express.static('data'));
app.use('/img',express.static('data/image'));

app.use(cors());


// Definition des routes

app.get( '/user', (req, res) => {
    //console.log(req.userList)
        // log(req.now);
        res.status(200).json(req.userList);
    });

app.get( '/user/:id', (req, res) => {
        // log(req.now);
    const user = req.userList.find((item) => item.id == req.params.id)
        if(user) {
            res.status(200).json({success: true, data: user})
        } else {
            res.status(404).json({success: false, message: 'Utilisateur inconnu'})
        }
    });

app.delete('/user/:id', async (req,res) => {
    try {
        const index = req.userList.findIndex(item => item.id == req.params.id);
        req.userList.splice(index, 1);
        await fs.promises.writeFile('./data/users.json', JSON.stringify(req.userList));
        res.status(200).json({success: true, data: req.userList });
    } catch (err) {
        res.status(500).json(
            {
                success: false,
                message: 'Impossible de supprimer l\'utilisateur'
            });
    }




});


app.get( '/', (req, res) => {
        res.status(200).send(`Home sweet home <img style="width: 50%" src="/image/image.jpg">`);
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