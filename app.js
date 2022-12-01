require('dotenv').config();
const express = require("express");
const path = require('path');
const db = require("./database");
const multer = require('multer')
const app = express();

// setting the server
app.set("view engine", "ejs");
//app.use(morgan("dev"));
app.set("port", 3000);
app.use(express.json());


//static files
app.use(express.static( path.join(__dirname, 'public' )));

//routes
app.use(require('./routes/index'));

// setup database
db.connect();

// storage engine to logo uploading
const storage = multer.diskStorage({
  destination:  './upload/images',
  filename:     (req, file, cb) =>{
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})

const upload = multer({
  storage: storage
})

app.post("/setting/crearEquipo", upload.single('logo'), (req, res) =>{
  console.log(req.body)
  let query = "INSERT INTO selecciones (id_selecciones,nombre_seleccion,entrenador,logo) "
              +"VALUES ('"+req.body.id+"','"+req.body.nombre+"','"+req.body.entrenador+"','"+req.body.logoLoc+"')";
  db.pool.query(query, function(err){
      if(err){
        console.log(err.code)
        res.json({"res": err.code})
      } else{
        res.send({"res": 200})
      }

  }) 
});

app.post("/test", upload.single('logo'), (req,res) => {
  console.log(req.file, req.body);
})


// iniciando servidor
app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
