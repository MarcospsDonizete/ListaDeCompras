// importar o módulo sqlite3
// ao definir verbose (detalhado) poderemos rastrear a pilha de execução
const sqlite3 = require('sqlite3').verbose();
const database = './bdprojeto.db'

// checa o login
const setUsuario = (id, nome, mail, done) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.get(
        'select idusuario,nome,mail from tbusuario where idusuario = ?', [id],
        function(error, row) {
            if( error )
                return done(error.message,null)
            else if( !row || row.length == 0 ){
                bd.run('insert into tbusuario(idusuario,nome,mail) values (?,?,?)',
                    [id, nome, mail],
                    function (error) {
                        if( error ) 
                            return done(error.message)
                        return done(null,{id,nome,mail})
                    }
                )
            }
            else
                return done(null,{id,nome,mail})
        }
    )
    bd.close()
};


const selectProduto = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READONLY)
    // o método all é usado para fazer uma consulta que retorna vários registros
    // a resposta é um array de JSON
    bd.all(
        'select * from tbproduto where nome like ? order by nome limit 5',
        ['%' + req.body.nome + '%'],
        (error, rows) => {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ result: rows })
        }
    )
    bd.close()
};

const insertProduto = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('insert into tbproduto(nome) values (?)',
        [req.body.nome],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else if (this.lastID)
                res.send({ idproduto: this.lastID, nome: req.body.nome })
            else
                res.send({ erro: 'Problemas para obter o registro inserido' });
        }
    )
    bd.close()
};

// insere um registro na tblog com os dados passados no corpo da requisição (request)
const updateProduto = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('update tbproduto set nome=? where idproduto = ?',
        [req.body.nome, req.body.idproduto],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ idproduto: req.body.idproduto, nome: req.body.nome })
        }
    )
    bd.close()
};

const selectSupermercado = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READONLY)
    bd.all(
        'select * from tbsupermercado order by nome',
        (error, rows) => {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ result: rows })
        }
    )
    bd.close()
};

const insertSupermercado = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('insert into tbsupermercado(nome,logradouro,bairro,cidade,uf,nro,latitude,longitude) values (?,?,?,?,?,?,?,?)',
        [req.body.nome, req.body.logradouro, req.body.bairro, req.body.cidade, req.body.uf, req.body.nro, req.body.latitude, req.body.longitude],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else if (this.lastID)
                res.send({
                    idsupermercado: this.lastID,
                    nome: req.body.nome,
                    logradouro: req.body.logradouro,
                    bairro: req.body.bairro,
                    cidade: req.body.cidade,
                    uf: req.body.uf,
                    nro: req.body.nro,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                })
            else
                res.send({ erro: 'Problemas para obter o registro inserido' });
        }
    )
    bd.close()
};

const updateSupermercado = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('update tbsupermercado set nome=?,logradouro=?,bairro=?,cidade=?,uf=?,nro=?,latitude=?,longitude=? where idsupermercado=?',
        [req.body.nome, req.body.logradouro, req.body.bairro, req.body.cidade, req.body.uf, req.body.nro, req.body.latitude, req.body.longitude, req.body.idsupermercado],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({
                    idsupermercado: req.body.idsupermercado,
                    nome: req.body.nome,
                    logradouro: req.body.logradouro,
                    bairro: req.body.bairro,
                    cidade: req.body.cidade,
                    uf: req.body.uf,
                    nro: req.body.nro,
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                })
        }
    )
    bd.close()
};

const selectLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READONLY)
    bd.all(
        "select a.idlista,a.idsupermercado,strftime('%d/%m/%Y %H:%M',a.datahorario) as 'datahorario', b.nome " +
        "from tblista as a, tbsupermercado as b " +
        "where a.idsupermercado = b.idsupermercado and idusuario=? " +
        "order by datahorario desc " +
        "limit 10",
        [req.user.id],
        (error, rows) => {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ result: rows })
        }
    )
    bd.close()
};

const insertLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('insert into tblista(idsupermercado,idusuario,datahorario) values (?,?,datetime())',
        [req.body.idsupermercado, req.user.id],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else if (this.lastID)
                res.send({ idlista: this.lastID })
            else
                res.send({ erro: 'Problemas para obter o registro inserido' });
        }
    )
    bd.close()
};

const updateLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('update tblista set idsupermercado=? where idlista=?',
        [req.body.idsupermercado, req.body.idlista],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({
                    idlista: req.body.idlista,
                    idsupermercado: req.body.idsupermercado
                })
        }
    )
    bd.close()
};

const deleteLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('delete from tblista where idlista = ?',
        [req.body.idlista],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ idlista: req.body.idlista })
        }
    )
    bd.close()
};

const selectProdutoPorLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READONLY)
    bd.all(
        'select a.idlista,a.idproduto,b.nome,a.valor from tbprodutoporlista as a, tbproduto as b where a.idproduto=b.idproduto and idlista=? order by b.nome',
        [req.body.idlista],
        (error, rows) => {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ result: rows })
        }
    )
    bd.close()
};

const insertProdutoPorLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('insert into tbprodutoporlista(idlista,idproduto,valor) values (?,?,?)',
        [req.body.idlista, req.body.idproduto, req.body.valor?req.body.valor:null],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ idlista:req.body.idlista, idproduto:req.body.idproduto, valor:req.body.valor })
        }
    )
    bd.close()
};

const updateProdutoPorLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('update tbprodutoporlista set valor=? where idlista=? and idproduto=?',
        [req.body.valor?req.body.valor:null, req.body.idlista, req.body.idproduto ],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ idlista:req.body.idlista, idproduto:req.body.idproduto, valor:req.body.valor })
        }
    )
    bd.close()
};

const deleteProdutoPorLista = (req, res) => {
    const bd = new sqlite3.Database(database, sqlite3.OPEN_READWRITE)
    bd.run('delete from tbprodutoporlista where idlista=? and idproduto=?',
        [req.body.idlista, req.body.idproduto ],
        function (error) {
            if (error)
                res.send({ erro: error.message })
            else
                res.send({ idlista: req.body.idlista, idproduto:req.body.idproduto })
        }
    )
    bd.close()
};

module.exports = {
    setUsuario,
    selectProduto,
    insertProduto,
    updateProduto,
    selectSupermercado,
    insertSupermercado,
    updateSupermercado,
    selectLista,
    insertLista,
    updateLista,
    deleteLista,
    selectProdutoPorLista,
    insertProdutoPorLista,
    updateProdutoPorLista,
    deleteProdutoPorLista
};