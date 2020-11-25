const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport')
const session = require('express-session')
const GoogleStrategy = require('passport-google-oauth20').Strategy
// importar o módulo que possui as operações no SQLite
const op = require('./operacoes')
const PORT = '3101';

//**********  Middleware ***********

app.use(express.json()) //para conversão de application/json
app.use(express.urlencoded({ extended: true })) // para conversão de application/x-www-form-urlencoded
//para aceitar requisição de outros domínios
app.use(cors({
    credentials: true, // permite o cookie de sessão do navegador
    origin: 'http://localhost:3100' //localização da aplicação React
}));
//cria uma sessão com as opções fornecidas
//Apenas o ID da session é salvo no cookie enviado para o navegador
//Os dados da sessão são armazenados no servidor.
//Os cookies ficam nos objetos req/res
app.use(session({
    secret: 'qqSenhaUnicaPorServidor', // palavra usada para assinar o cookie de identificação da sessão
    resave: true, // força a sessão ser atualizada a cada nova request
    saveUninitialized: false
}))
app.use(passport.initialize()) //para inicializar o passport
app.use(passport.session()) //para persistir a sessão de login

//para ter suporte a sessão o Passport precisa serializar e desserializar a sessão
passport.serializeUser(function (obj, done) {
    console.log('serializar:', obj)
    done(null, obj)
});
passport.deserializeUser(function (obj, done) {
    console.log('deserializar:', obj)
    done(null, obj)
});

//**********  Subir o servidor ***********
app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}...`);
});

//**********  Rotas ***********

// obtido em https://console.developers.google.com/
const GOOGLE_CLIENT_ID = '1092854661993-2q7srql6rm4ic55p2uisp53st5u54289.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '3CMYH78_0_pDw9mkVXqakjqA'
// configuração da estratégia de autenticação
passport.use(new GoogleStrategy(
    {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
    },
    //callback de verificação, a função done será invocada após validar o usuário no BD
    function (accessToken, refreshToken, profile, done) {
        return op.setUsuario(profile.id, profile.displayName, profile.emails[0].value, done)
    }
));
//recebe os dados do Google e faz o redirecionamento
app.all('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3100/erro'
    }
    ),
    function (req, res) {
        res.redirect('http://localhost:3100')
    }
);

app.all('/login',
    //será adotada a GoogleStrategy
    //diz que queremos os dados do profile (id e display name) e email do usuário no Google
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/logout', function (req, res) {
    req.logout()
    if (!req.user)
        res.send({ nome: '', mail: '' })
    else
        res.send({ nome: req.user.nome, mail: req.user.mail })
});

app.get('/currentuser', (req, res) => {
    if (req.user) {
        let { nome, mail } = req.user
        res.send({ nome, mail })
    }
    else
        res.send({ nome: '', mail: '' })
})

// curl -X POST -d "nome=a" http://localhost:3101/selectproduto
app.post('/selectproduto', op.selectProduto)

// curl -X POST -d "nome=Bolacha Água e Sal Mirabel 250g" http://localhost:3101/insertproduto
app.post('/insertproduto', op.insertProduto)

// curl -X POST -d "idproduto=4&nome=Bolacha Recheada Mirabel 250g" http://localhost:3101/updateproduto
app.post('/updateproduto', op.updateProduto)

// curl -X POST http://localhost:3101/selectsupermercado
app.post('/selectsupermercado', (req, res) => {
    if( req.user )
        op.selectSupermercado(req, res)
    else
        res.send({erro:'Efetue o login para continuar'})
})

// curl -X POST -d "nome=Supermercado D&logradouro=Rua d&bairro=Campo&cidade=Jacareí&uf=SP&nro=&latitude=-15.32&longitude=-45.21" http://localhost:3101/insertsupermercado
app.post('/insertsupermercado', (req, res) =>{
    if( req.user )
        op.insertSupermercado(req, res)
    else
        res.send({erro:'Efetue o login para continuar'})
})

// curl -X POST -d "idsupermercado=4&nome=Supermercado D&logradouro=Rua d&bairro=Campo Limpo&cidade=Jacareí&uf=SP&nro=&latitude=-15.32&longitude=-45.21" http://localhost:3101/updatesupermercado
app.post('/updatesupermercado', op.updateSupermercado)

// curl -X POST -d "idusuario=1" http://localhost:3101/selectlista
app.post('/selectlista', op.selectLista)

// curl -X POST -d "idusuario=1&idsupermercado=2" http://localhost:3101/insertlista
app.post('/insertlista', op.insertLista)

// curl -X POST -d "idlista=4&idsupermercado=3" http://localhost:3101/updatelista
app.post('/updatelista', op.updateLista)

// curl -X POST -d "idlista=4" http://localhost:3101/deletelista
app.post('/deletelista', op.deleteLista)

// curl -X POST -d "idlista=2" http://localhost:3101/selectprodutoporlista
app.post('/selectprodutoporlista', op.selectProdutoPorLista)

// curl -X POST -d "idlista=2&idproduto=1&valor=25.5" http://localhost:3101/insertprodutoporlista
// curl -X POST -d "idlista=2&idproduto=2&valor=" http://localhost:3101/insertprodutoporlista
// curl -X POST -d "idlista=2&idproduto=2" http://localhost:3101/insertprodutoporlista
app.post('/insertprodutoporlista', op.insertProdutoPorLista)

// curl -X POST -d "idlista=2&idproduto=1&valor=25.9" http://localhost:3101/updateprodutoporlista
// curl -X POST -d "idlista=2&idproduto=2&valor=" http://localhost:3101/updateprodutoporlista
app.post('/updateprodutoporlista', op.updateProdutoPorLista)

// curl -X POST -d "idlista=2&idproduto=2" http://localhost:3101/deleteprodutoporlista
app.post('/deleteprodutoporlista', op.deleteProdutoPorLista)

//aceita qualquer método HTTP e URL
app.use((req, res) => {
    res.send({ message: "URL desconhecida" });
})
