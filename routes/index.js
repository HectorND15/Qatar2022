const router = require('express').Router();
const db = require("../database");
const moment = require('moment');

// --- RUTAS MODULO DE CONFIGURACION
router.get("/", (req, res) => {
    res.render("index.ejs");
});

router.get("/live", (req, res) => {
    res.render("live.ejs");
});

router.get("/scheduling", (req, res) => {
    res.render("schedule.ejs");
});

router.get("/setting", (req, res) => {
    res.render("settings.ejs");
});

router.get("/arbitros", (req,res) =>{
    db.pool.query("SELECT nombre FROM arbitros;", function(err, rows){
        if(err) console.log(err)
        console.log(rows)
        res.json({"nombre_arbitro": rows})
    })
})

router.get("/arbitros1", (req,res) =>{
    db.pool.query("SELECT nombre,procedencia  FROM arbitros;", function(err, rows){
        if(err) console.log(err)
        console.log(rows)
        res.json({"arbitros": rows})
    })
})

router.get("/estadios", (req,res) =>{
    db.pool.query("SELECT nombre FROM estadios;", function(err, rows){
        if(err) console.log(err)
        console.log(rows)
        res.json({"nombre_estadio": rows})
    })
})

router.get("/selecciones", (req,res) =>{
    db.pool.query("SELECT nombre_seleccion FROM selecciones;", function(err, rows){
        if(err) console.log(err)
        res.json({"nombre_seleccion": rows})
    })
})

router.post("/setting/agregarJugador" ,(req, res) => {
    let repeated = true;
    console.log(req.body)
    db.pool.query('SELECT * FROM jugadores WHERE numero = '+req.body.numero+', id_jugadores = '+ req.body.equipo, function(err,rows){
        if (err) console.log(err.code)
        if(err.code == 'ER_PARSE_ERROR') {
            console.log('agregando nuevo jugador del equipo' , req.body.equipo)
        }else if(rows.length > 0) repeated=false;
    })
    setTimeout(() => {
        if(repeated){
            console.log(req.body)
            let query = "INSERT INTO jugadores (id_jugadores, nombre,apellido,numero,seleccion) "
                    +"VALUES ('"+req.body.id+"','"+req.body.nombre+"','"+req.body.apellido+"','"+req.body.numero+"','"+parseInt(req.body.equipo)+"')";
            db.pool.query(query, function(err){
            if(err){
                console.log(err.code)
                res.json({"res": err.code})
            } else{
                res.json({"res": 200})
            }
            })
        } else{
            res.json({"res": "repeated"})
        }
    }, 500);
   
});

router.post("/setting/crearArbitro", (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO arbitros (nombre, procedencia,id_procedencia) "
                +"VALUES ('"+req.body.nombre+"','"+req.body.procedencia+"','"+req.body.id+"')";
    db.pool.query(query, function(err){
        if(err) console.log(err)
    })
})

router.post("/setting/crearEstadio", (req, res) => {
    console.log(req.body)
    let query = "INSERT INTO estadios (nombre, capacidad,ubicacion) "
                +"VALUES ('"+req.body.nombre+"','"+req.body.capacidad+"','"+req.body.ubicacion+"')";
    db.pool.query(query, function(err){
        if(err) console.log(err)
    })
})

router.post("/setting/editEquipo", (req, res)=>{
    let query = "SELECT nombre_seleccion, entrenador, logo FROM selecciones WHERE nombre_seleccion='"+req.body.nombre+"';"
    db.pool.query(query, function(err,rows){
        if(err) console.log(err)
        res.json({
            'entrenador': rows[0].entrenador,
            'logo': rows[0].logo
        })
    })
})

router.post("/setting/editArbitro", (req, res)=>{
    let query = "SELECT id, nombre, procedencia FROM arbitros WHERE nombre='"+req.body.nombre+"';"
    db.pool.query(query, function(err,rows){
        if(err) console.log(err)
        console.log(rows)
        res.json({
            'id'    : rows[0].id,
            'nombre': rows[0].nombre,
            'procedencia': rows[0].procedencia
        })
    })
})

router.post("/setting/editEstadio", (req, res)=>{
    let query = "SELECT id, nombre, capacidad, ubicacion FROM estadios WHERE nombre='"+req.body.nombre+"';"
    db.pool.query(query, function(err,rows){
        if(err) console.log(err)
        res.json({
            'id'    : rows[0].id,
            'nombre': rows[0].nombre,
            'capacidad': rows[0].capacidad,
            'ubicacion' :   rows[0].ubicacion
        })
    })
})

router.post("/setting/updateEquipo", (req, res)=>{
    let query = "UPDATE selecciones SET nombre_seleccion = '"+req.body.nombre+"', entrenador = '"+req.body.entrenador+"' WHERE id_selecciones = "+req.body.id+";"
    db.pool.query(query, function(err){
        if(err) console.log(err)
    })
})

router.post("/setting/editJugador", (req, res)=>{
    console.log(req.body)
    let query = "SELECT * FROM jugadores WHERE seleccion ='"+req.body.id+"';"
    db.pool.query(query, function(err,rows){
        console.log(rows)
        if(err) console.log(err)
        res.json(rows)
    })
})

router.post("/setting/updaterJugador", (req, res) =>{
    console.log(req.body.players[0])
    for(let i=0; i<req.body.players.length; i++){
        let query = "UPDATE jugadores SET nombre ='"+req.body.players[i][1]+"', apellido = '"+req.body.players[i][2]+"', numero = '"+req.body.players[i][3]+"' WHERE id_jugadores = "+req.body.players[i][0]+";"
        console.log(query)
        db.pool.query(query, function(err){
            if(err) console.log(err.code)
        })
    }
    res.send('ok')
})

router.post("/setting/updateArbitro", (req, res)=>{
    let query = "UPDATE arbitros SET nombre = '"+req.body.nombre+"', procedencia = '"+req.body.procedencia+"' WHERE id= "+req.body.id+";"
    db.pool.query(query, function(err){
        if(err) console.log(err)
        res.send('ok')
    })
    
})

router.post("/setting/updateEstadio", (req, res)=>{
    let query = "UPDATE estadios SET nombre = '"+req.body.nombre+"', capacidad = '"+req.body.capacidad+"', ubicacion = '"+req.body.ubicacion+"' WHERE id= "+req.body.id+";"
    db.pool.query(query, function(err){
        if(err) console.log(err)
        res.send('ok')
    })
})

router.post('/setting/deleteJugador', (req, res) => {
    console.log(req.body);
    res.send('ok')
})


// ----- RUTAS MODULO DE PROGRAMACION

router.post('/scheduling/crearPartido', (req,res) => {
    console.log(req.body)
    moment
    let query = "INSERT INTO partidos (id, fecha, horaInicio, horaFin, equipo1, equipo2, arbitro, estadio) "
                +"VALUES ('"+req.body.id+"','"+req.body.fecha+"','"+req.body.hora+"','"+moment(req.body.hora+':00', 'HH:mm:ss').add(105, 'm').format('HH:mm:ss')+"','"+req.body.team1+"','"+req.body.team2+"','"+req.body.arbitro+"','"+req.body.stadium+"')";
    console.log(query)
    try {
        db.pool.query(query, function(err){
            if(err) {
                console.log(err)
                if(err.code == 'ER_DUP_ENTRY'){
                    res.json({'res': 'repeated'})
                    return
                }
            }
            res.json('ok')
        })
    } catch (err){
        console.log(err)
    }

})

router.get("/main/partidos", (req,res) =>{
    let query = "SELECT * FROM partidos"
    db.pool.query(query, function (err, rows){
        if(err) console.log(err.code)
        res.json(rows)
    })
})





module.exports = router;