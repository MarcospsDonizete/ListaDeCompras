// importar o módulo sqlite3
// ao definir verbose (detalhado) poderemos rastrear a pilha de execução
const sqlite3 = require('sqlite3').verbose();
const database = './bdprojeto.db'

// cria o BD e abre a conexão com ele, e após, dispara a função callback
const bd = new sqlite3.Database(
    database, 
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, //open the database, if the database does not exist, create a new database
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('bdprojeto criado')
    }
);

//criar as tabelas
bd.run(
    'create table if not exists tbusuario(' +
    'idusuario text primary key,' +
    'nome text not null,'+
    'mail text null)',
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('tbusuario criada')
    }
);

bd.run(
    'create table if not exists tbproduto(' +
    'idproduto integer primary key autoincrement,' +
    'nome text not null)',
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('tbproduto criada')
    }
);

bd.run(
    'create table if not exists tbsupermercado(' +
    'idsupermercado integer primary key autoincrement,' +
    'nome text not null,'+
    'logradouro text,'+
    'bairro text,'+
    'cidade text,'+
    'uf text,'+
    'nro integer,'+
    'latitude real,'+
    'longitude real)',
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('tbsupermercado criada')
    }
);

bd.run(
    'create table if not exists tblista(' +
    'idlista integer primary key autoincrement,' +
    'idusuario integer not null references tbusuario(idusuario),'+
    'idsupermercado integer references tbsupermercado(idsupermercado),'+
    'datahorario datetime not null)',
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('tblista criada')
    }
);

bd.run(
    'create table if not exists tbprodutoporlista(' +
    'idlista integer not null references tblista(idlista),' +
    'idproduto integer not null references tbproduto(idproduto),' +
    'valor real,'+
    'primary key (idlista,idproduto))',
    function(error){
        if( error )
            console.log(error.message)
        else
            console.log('tbprodutoporlista criada')
    }
);

bd.close(function(error){
    if( error )
        console.log(error.message)
    else
        console.log('bdprojeto fechado')
});