const mysql = require("mysql");
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

const connect = () =>{
    pool.getConnection(err => {
        if(err) throw err;
        console.log("Successful database connection!");
    });
}

const addTeam = (id, nombre, entreandor, logo) => {
    let query = "INSERT INTO selecciones (id_selecciones,nombre_seleccion,entrenador,logo) "
                +"VALUES ('"+id+"','"+nombre+"','"+entreandor+"','"+logo+"')";
    pool.query(query, function(err){
        if(err) return err.code
    })
}

module.exports = {
    connect,
    pool,
    addTeam
}