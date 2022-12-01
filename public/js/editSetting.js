async function teamEdit(){
    team = document.getElementById('seleccionEdit').value
    inputEditName = document.getElementById('editarNombreEquipo')
    inputEditEntrenador = document.getElementById('editarEntrenadorEquipo')
    inputEditLogo = document.getElementById('editarLogo')

    if(team === 'Escoja una seleccion'){
        inputEditName.value = "";
        inputEditEntrenador.value = "";
        //inputEditLogo.value = teamInfo.logo;
        return
    }

    const response = await fetch('/setting/editEquipo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'nombre'    : team,
        })
    });

    const teamInfo = await response.json()
    inputEditName.value = team;
    inputEditEntrenador.value = teamInfo.entrenador;
    //inputEditLogo.value = teamInfo.logo;
}

async function updateTeam(){
    inputEditName = document.getElementById('editarNombreEquipo')
    inputEditEntrenador = document.getElementById('editarEntrenadorEquipo')
    inputEditLogo = document.getElementById('editarLogo')

    if(inputEditName.value==="" || inputEditEntrenador.value === ""){
        alert('Error al guardar')
        return
    }

    const response = await fetch('/setting/updateEquipo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id'        : parseInt(createID(inputEditName.value, 6)),
            'nombre'    : inputEditName.value,
            'entrenador': inputEditEntrenador.value,
            'logo': inputEditLogo.value
        })
    });

    const res = await response.json();
    console.log(res)
    location.reload()

}

let buttonPressed;

async function playerEdit(){
    team = document.getElementById('seleccionEdit2').value
    parent = document.getElementById('playerFields');

    if(team === 'Escoja una seleccion'){
        parent.innerHTML = '';
        return
    }

    parent.innerHTML = ''

    const response = await fetch('/setting/editJugador', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id'    : parseInt(createID(team,6)),
        })
    });
    
    const PlayersInfo = await response.json()
    console.log(PlayersInfo.length)

    for(let i=0; i<PlayersInfo.length; i++){
        const tr = document.createElement('tr');
        parent.appendChild(tr)
        for(let j=0; j<4; j++){
            th = document.createElement('th');
            tr.appendChild(th)
            const input = document.createElement('input');
            input.type = 'text'
            input.className = 'playerToEdit';
            if(j===0){
                input.tagName = 'idPlayer'
                input.value = PlayersInfo[i].id_jugadores
                input.disabled = 'disabled'
                input.readOnly = 'readonly'
                input.style = "background-color: gray;user-select: none; width: 95px"
            } else if(j===1){
                input.value = PlayersInfo[i].nombre
            } else if(j===2){
                input.value = PlayersInfo[i].apellido
            } else if(j===3){
                input.value = PlayersInfo[i].numero
                input.type = 'number'
                input.style = "width: 95px"
            }
                
            th.appendChild(input)
        }
        th = document.createElement('th');
        tr.appendChild(th)
        const button = document.createElement('button');
        buttonPressed = 0
        button.innerHTML = 'borrar'
        //button.addEventListener("click", deletePlayer(PlayersInfo[i].id))
        button.style = 'width: 60px; font-size : 12px; height : 20px; cursor: pointer'
        button.className = 'deletePlayer'
        th.appendChild(button)
    }
}

async function updatePlayer(){
    inputsFields = document.getElementsByClassName('playerToEdit')
    team = document.getElementById('seleccionEdit2').value
    updatedPlayerInfo = []
    for(let i=0; i<inputsFields.length/4; i++){
        let tempUpdate = []
        for(let j=0; j<4; j++){
            tempUpdate.push(inputsFields[i*4+j].value)
        }
        updatedPlayerInfo.push(tempUpdate)
    }
    console.log(updatedPlayerInfo)
    const response = await fetch('/setting/updaterJugador', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'team'      :  parseInt(createID(team,6)),
            'players'    : updatedPlayerInfo,
        })
    });
    data = await response
    console.log(data)
    alert('Jugador editado con exito')
    location.reload()

}

async function deletePlayer(id){
    console.log(id)
    if(buttonPressed === 0){
        buttonPressed = 1
        return
    }
    await fetch('/setting/deleteJugador', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id'    : id,
        })
    });
    alert('jugador borrador con exito')
    await playerEdit();
    location.reload()

}

storedReferees = []
async function updateRefereeList(){
    readReferees();
    const referees = document.getElementById("refereeList");
    
    setTimeout(() => {
        nTeams = storedReferees.length
        if(nTeams > nbTeams){
            for(let i=0; i<storedReferees.length; i++){
                referees.insertAdjacentHTML('beforeend', '<option>'+storedReferees[i]+'</option>')
            }
        }
        nbTeams = nTeams;
    }, 500)
}

async function readReferees(){
    const response = await fetch("/arbitros");
    responseJson = await response.json()
    x = responseJson.nombre_arbitro;
    console.log(x)
    storedReferees = []
    for(let i=0; i<x.length; i++){
        storedReferees.push(x[i].nombre)
    }
    storedReferees.sort()
}

async function updateReferee(){
    inputRefereeID = document.getElementById('editarIDArbitro')
    inputRefereeName = document.getElementById('editarNombreArbitro')
    inputRefereeProcedencia = document.getElementById('editarProcedenciaArbitro')

    if(inputRefereeName.value==="" || inputRefereeProcedencia.value === ""){
        alert('Error al guardar')
        return
    }

    const response = await fetch('/setting/updateArbitro', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id'        : inputRefereeID.value,
            'nombre'    : inputRefereeName.value,
            'procedencia': inputRefereeProcedencia.value,
        })
    });

    const res = await response;
    console.log(res)
    alert('Arbitro actializado')
    location.reload()
}

async function RefereeEdit(){
    referees = document.getElementById('refereeList').value
    inputRefereeID = document.getElementById('editarIDArbitro')
    inputRefereeName = document.getElementById('editarNombreArbitro')
    inputRefereeProcedencia = document.getElementById('editarProcedenciaArbitro')
    console.log(referees)

    if(referees == 'Escoja un Arbitro'){
        inputRefereeID.value = "";
        inputRefereeName.value = "";
        inputRefereeProcedencia.value = "";
        //inputEditLogo.value = teamInfo.logo;
        return
    }

    const response = await fetch('/setting/editArbitro', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'nombre'    : referees,
        })
    });
    teamInfo = await response.json()
    console.log(teamInfo)
    inputRefereeID.value = teamInfo.id;
    inputRefereeName.value = teamInfo.nombre;
    inputRefereeProcedencia.value = teamInfo.procedencia;
}

// -----------------------------------------
async function updateStadiumList(){
    await readEstadios();
    const estadios = document.getElementById("estadioList");
    
    setTimeout(() => {
        nTeams = storesStadiums.length
        if(nTeams > nbTeams){
            for(let i=0; i<storesStadiums.length; i++){
                estadios.insertAdjacentHTML('beforeend', '<option>'+storesStadiums[i]+'</option>')
            }
        }
        nbTeams = nTeams;
    }, 500)
}

let storesStadiums = [];
async function readEstadios(){
    const response = await fetch("/estadios");
    responseJson = await response.json()
    x = responseJson.nombre_estadio;
    console.log(x)
    storesStadiums = []
    for(let i=0; i<x.length; i++){
        storesStadiums.push(x[i].nombre)
    }
    storesStadiums.sort()
}

async function updateEstadio(){
    inputEstadioID = document.getElementById('editarIDEstadio')
    inputEstadioName = document.getElementById('editarNombreEstadio')
    inputEstadioCapacidad = document.getElementById('editarCapacidadArbitro')
    inputEstadioUbicacion = document.getElementById('editarUbicacionEstadio')

    if(inputEstadioName.value==="" || inputEstadioCapacidad.value === ""){
        alert('Error al guardar')
        return
    }

    const response = await fetch('/setting/updateEstadio', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'id'        : inputEstadioID.value,
            'nombre'    : inputEstadioName.value,
            'capacidad': inputEstadioCapacidad.value,
            'ubicacion': inputEstadioUbicacion.value,
        })
    });

    const res = await response;
    console.log(res)
    alert('Estadio actializado')
    location.reload()
}

async function EstadioEdit(){
    estadio = document.getElementById('estadioList').value
    inputEstadioID = document.getElementById('editarIDEstadio')
    inputEstadioName = document.getElementById('editarNombreEstadio')
    inputEstadioCapacidad = document.getElementById('editarCapacidadArbitro')
    inputEstadioUbicacion = document.getElementById('editarUbicacionEstadio')

    if(estadio === 'Escoja un Estadio'){
        inputRefereeName.value = "";
        inputRefereeProcedencia.value = "";
        //inputEditLogo.value = teamInfo.logo;
        return
    }

    const response = await fetch('/setting/editEstadio', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'nombre'    : estadio,
        })
    });
    const teamInfo = await response.json()
    console.log(teamInfo)
    inputEstadioID.value = teamInfo.id;
    inputEstadioName.value = teamInfo.nombre;
    inputEstadioCapacidad.value = teamInfo.capacidad;
    inputEstadioUbicacion.value = teamInfo.ubicacion;

}