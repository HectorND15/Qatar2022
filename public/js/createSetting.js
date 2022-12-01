let storedTeams, nTeams, nbTeams=0

async function crearSeleccion(){
    let nombre = document.getElementById("nombreEquipo").value;
    let entrenador = document.getElementById("entrenadorEquipo").value;
    let logoLoc = document.getElementById("logoEquipo").value.split("\\")[2];

    try {
        const response = await fetch('/setting/crearEquipo', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'id'        : parseInt(createID(nombre.toUpperCase(), 6)),
                'nombre'    : nombre.toUpperCase(),
                'entrenador': entrenador,
                'logoLoc'   : logoLoc
            })
        });
        const code = await response.json()
        console.log(code)
        if(code.res === 'ER_DUP_ENTRY'){
            alert("El equipo descrito ya existe")
        }
    
    } catch (error) {
        console.log(error)
    }
    location.reload()
}

async function crearJugador(){
    let equipo = document.getElementById("equipoJugador").value;
    let nombre = document.getElementById("nombreJugador").value;
    let apellido = document.getElementById("apellidoJugador").value;
    let numero = document.getElementById("numeroJugador").value;

    console.log("equipo: ", equipo)
    if(equipo === 'Escoja una seleccion'){
        alert("Escoja unas seleccion")
    } else{
        try {
            const response = await fetch('/setting/agregarJugador', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    'id':   createID(nombre.toUpperCase()+apellido.toUpperCase(), 8),
                    'nombre'    : nombre,
                    'apellido': apellido,
                    'numero'   : numero,
                    'equipo': parseInt(createID(equipo, 6))
                })
            });
            const code = await response.json()
            console.log(code)
            if(code.res === 'ER_DUP_ENTRY'){
                alert("El jugador descrito ya existe")
            } else if(code.res === 'repeated'){
                alert("El numero escogido ya existe")
            }
        } catch (error) {
            console.log(error)
        }
    }
    location.reload()

}

async function crearArbitro(){
    let nombre = document.getElementById("nombreArbitro").value;
    let procedencia = document.getElementById("procedenciaArbitro").value;

    try {
        const response = await fetch('/setting/crearArbitro', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'nombre'    : nombre.toUpperCase(),
                'procedencia': procedencia.toUpperCase(),
                'id': parseInt(createID(procedencia,5))
            })
        });
        const code = await response.json()
        console.log(code)
        if(code.res === 'ER_DUP_ENTRY'){
            alert("El arbitro descrito ya existe")
        }
       
    } catch (error) {
        console.log(error)
    }
    location.reload()

}

async function crearEstadio(){
    let nombre = document.getElementById("nombreEstadio").value;
    let capacidad = document.getElementById("capacidadEstadio").value;
    let ubicacion = document.getElementById("ubicacionEstadio").value;
    try {
        const response = await fetch('/setting/crearEstadio', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'nombre'    : nombre.toUpperCase(),
                'capacidad': capacidad,
                'ubicacion'   : ubicacion
            })
        });
        const code = await response.json()
        console.log(code)
        if(code.res === 'ER_DUP_ENTRY'){
            alert("El estadio descrito ya existe")
        }

        
    } catch (error) {
        console.log(error)
    }
    location.reload()
}

function updateTeamList(){
    readTeams();
    const selecciones = document.getElementById("equipoJugador");
    const selecciones1 = document.getElementById("seleccionEdit");
    const selecciones2 = document.getElementById("seleccionEdit2");
    
    setTimeout(() => {
        nTeams = storedTeams.length
        if(nTeams > nbTeams){
            for(let i=0; i<storedTeams.length; i++){
                selecciones.insertAdjacentHTML('beforeend', '<option>'+storedTeams[i]+'</option>')
                selecciones1.insertAdjacentHTML('beforeend', '<option>'+storedTeams[i]+'</option>')
                selecciones2.insertAdjacentHTML('beforeend', '<option>'+storedTeams[i]+'</option>')
            }
        }
        nbTeams = nTeams;
    }, 500)
}

async function readTeams(){
    const response = await fetch("/selecciones");
    let responseJson = await response.json()
    storedTeams = responseJson.nombre_seleccion;
    let x = storedTeams
    storedTeams = []
    for(let i=0; i<x.length; i++){
        storedTeams.push(x[i].nombre_seleccion)
    }
    storedTeams.sort()
}

function createID(nombre, n){
    let letters = ['A','E','I','O','U','M','N','S','L','R','T','P','C','D','Q'] 
    let data = [1,2,3,4,5,6,7,8,9,0,9,8,7,6,5,4]
    let id = ''
    for (let i=0; i<nombre.length; i++){
        for(let j=0; j<letters.length; j++){
            if(nombre[i] === letters[j]){
                id = id + data[j]
            }
        }
    }
    if(id.length === n){
        return id
    } else if(id.length < n){
        for(let i=0; i<n; i++){
            id = id + i
            if(id.length === n){
                return id
            }
        }
    } else if(id.length > n){
        return id.slice(0,n)
    }
}