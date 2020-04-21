// configurando o servidor
const express = require("express")
const server = express()


// configurando o servidor para iniciar arquivos estáticos / css, js..\
server.use(express.static("public"))


// habilitando o body do formulário
server.use(express.urlencoded({ extended: true }))


// configurando a conexão com banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: '',     // usuário que você criou no aplicativo do Postgres
    password: '', // senha que você criou no aplicativo do Postgres
    host: '',
    port: ,
    database: ''
})


// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

// Mensagens
    // Avisar de novo usuário cadastrado.
function newUser_AlertInConsole(name, email, blood) {
    console.log(`
    > Novo usuário cadastrado.
    > Nome: ${name}
    > Email: ${email}
    > Tipo Sanguíneo: ${blood}`)
}

    // Avisar de site iniciado com sucesso
function serverStartedSuccess() {
    console.log(` 
|------------------------------------|
|    Server started with sucess!     |
|         Create by zDMz#5671        |
| https://github.com/djonibourscheid |
|------------------------------------|`)
}


// configurando a apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result) {
        if (err) return res.send("Erro na conexão com o banco de dados.")


        const donors = result.rows
        return res.render("index.html", { donors })
    })
})


server.post("/", function(req, res) {
    // pegando os dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood


    // verificando se alguma caixa do form for nula
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos precisam estar preenchidos.")
        console.log("Usuário tentou se validar sem todos os campos preenchidos.")
    }


    // colocando valores dentro do banco de dados
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function(err) {
        // fluxo de erro
        if (err) {
            return res.send("Erro na conexão com o banco de dados.")
            console.log("Usuário tentou se validar mas aconteceu algum erro na conexão com o banco de dados.")
        }
        
        // fluxo ideal
            // Apresentando uma mensagem no console de novo usuário
        newUser_AlertInConsole(name, email, blood)

            // Redirecionando o usuário para a página inicial
        return res.redirect("/")
    })
})

// ligar o servidor e liberar acesso na porta 3000
server.listen(3000, function() {
    serverStartedSuccess()
})