const date = new Date()


async function preloadTeams(){
    const data = await fetch("/main/partidos")
    partidos = await data.json();
    console.log(partidos)
    var d1 = new Date(partidos[0].fecha)
    console.log(d1)
    console.log(date)
}