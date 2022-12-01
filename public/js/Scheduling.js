const date = new Date();
var nTeams, nbTeams = 0//



matchDate = document.getElementById('dateMatch')
timeDate = document.getElementById('timeMatch')

var todaysDate = date.toISOString().slice(0,10);
hours = date.getHours();
if(parseInt(hours) < 10){
    hours = '0'+date.getHours();
}
minutes = date.getMinutes();
if(parseInt(minutes)<9){
    minutes = '0'+date.getMinutes();
}
nowTime = hours+':'+minutes;
matchDate.value = todaysDate;
timeDate.value = nowTime;
matchDate.min = todaysDate;

function updateLists(){
    const team1 = document.getElementById("team1Match");
    const team2 = document.getElementById("team2Match");
    const referee = document.getElementById('matchReferee');
    const stadium = document.getElementById('matchStadium');
    referee.innerHTML = ""
    stadium.innerHTML = ""
    readTeams();
    readEstadios();
    readReferees()

    setTimeout(() => {
        nTeams = storedTeams.length
        if(nTeams > nbTeams){
            for(let i=0; i<storedTeams.length; i++){
                team1.insertAdjacentHTML('beforeend', '<option>'+storedTeams[i]+'</option>')
                team2.insertAdjacentHTML('beforeend', '<option>'+storedTeams[i]+'</option>')
            }
        }
        nbTeams = nTeams;
    }, 800)

    setTimeout(() => {
        nTeams = storesStadiums.length
        for(let i=0; i<storesStadiums.length; i++){
            stadium.insertAdjacentHTML('beforeend', '<option>'+storesStadiums[i]+'</option>')
        }
    }, 500)

    setTimeout(() => {
        for(let i=0; i<storedReferees.length; i++){
            if(procedenciaReferees[i] == team1.value || procedenciaReferees[i] == team2.value) continue
            referee.insertAdjacentHTML('beforeend', '<option>'+storedReferees[i]+'</option>')
        }
    }, 500)
}

var storedTeams = []
async function readTeams(){
    const response = await fetch("/selecciones");
    let responseJson = await response.json()
    let x = responseJson.nombre_seleccion;
    storedTeams = []
    for(let i=0; i<x.length; i++){
        storedTeams.push(x[i].nombre_seleccion)
    }
    storedTeams.sort()
}

var storesStadiums = [];
async function readEstadios(){
    const response = await fetch("/estadios");
    responseJson = await response.json()
    x = responseJson.nombre_estadio;
    storesStadiums = []
    for(let i=0; i<x.length; i++){
        storesStadiums.push(x[i].nombre)
    }
    storesStadiums.sort()
}

var storedReferees = []
var procedenciaReferees = []
async function readReferees(){
    const response = await fetch("/arbitros1");
    responseJson = await response.json()
    x = responseJson.arbitros;
    storedReferees = []
    for(let i=0; i<x.length; i++){
        storedReferees.push(x[i].nombre)
        procedenciaReferees.push(x[i].procedencia)
    }
}

async function programarPartido(){
    team1 = document.getElementById('team1Match').value
    team2 = document.getElementById('team2Match').value
    fecha = document.getElementById('dateMatch').value
    hora = document.getElementById('timeMatch').value
    arbitro = document.getElementById('matchReferee').value
    stadium = document.getElementById('matchStadium').value

    if(team1 == 'Equipo 1' || team2 == 'Equipo 2' || team1 == team2){
        alert('Error al crear partido')
        return
    }
    console.log(createID(fecha+team1.slice(0,4)+team2.slice(0,4), 8))

    const response = await fetch('/scheduling/crearPartido', {
        method:     'POST',
        headers:    {'Content-Type' : 'application/json'},
        body:       JSON.stringify({
            'id'    :   createID(fecha.slice(4)+team1.slice(0,4)+team2.slice(0,4), 8),
            'fecha' :   fecha,
            'hora' :    hora,
            'team1':    team1,
            'team2':    team2,
            'arbitro':  arbitro,
            'stadium':  stadium
        })
    })
    const res = await response.json()
    console.log(res)
    if(res.res == 'repeated'){
        alert('El partido ya existe')
        location.reload();
        return
    }
    alert('Partido Creado')
    location.reload()

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