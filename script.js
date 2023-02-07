const listaJogadores = document.querySelector('.lista')
const time = document.querySelector('.header')
const botao = document.querySelector('.botao')
const botao2 = document.querySelector('.botao2')

//pre loader
function remover() {
    setTimeout(function(){
        document.querySelector('.tela').innerHTML = "";
    }, 4500);
}
remover()


const apiNBAtimes = async () => {

    const nbaTimes = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/AllTeams?key=e3963fbd36a94552a4635833176e0d9f`)

    const dado = await nbaTimes.json();
    console.log(dado)
    let template = ''
    time.innerHTML = ''

    dado.forEach((nome, indice)=>{
        template += `
        <div onclick="teste('${nome.Key}'), grafico('${nome.TeamID}')" class="${nome.Key}">
            <img class="logo" 
            src="${nome.WikipediaLogoUrl}">
        </div>
    `
    })

    
    time.innerHTML = template

}


const apiNBAjogador = async (time) => {

    let template = '';
    listaJogadores.innerHTML = '';

    const nbaJogador = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/Players/${time}?key=e3963fbd36a94552a4635833176e0d9f`)

    const dado = await nbaJogador.json();
    console.log(dado)

    const mostrarjogador = (indice) => {
        console.log(dado[indice].YahooName);
        const jg = dado[indice]
        template = `
            <div class="card">
                <li class="media">
                    <div class="img">
                        <img src="${jg.PhotoUrl}">
                        <h5>${jg.YahooName}</h5>
                    </div>
                    <div class="media-body">
                        <h4> ${jg.Jersey}</h4><br>
                        <span class="peso">Peso : ${jg.Height}Libras<span><br><br>
                        <span class ="posicao">Posição : ${jg.Position
                        }</span><br><br>
                        <span class="data">Data de aniversário:</span><br><br>
                        <span class="niver">${jg.BirthDate}<span><br>
                    </div>
                </li>
            </div>`
            listaJogadores.innerHTML = `<ul>${template}</ul>`
        }
    let mudarjg = 0
    mostrarjogador(mudarjg)

    botao.addEventListener('click', ()=>{
        if (mudarjg < dado.length - 1){
            mudarjg += 1;
            console.log(mudarjg)
            mostrarjogador(mudarjg)
        }
    })
    botao2.addEventListener('click', ()=>{
        if(mudarjg > 0){
            mudarjg -= 1;
            console.log(mudarjg)
            mostrarjogador(mudarjg)
        }
    })
    
}

const teste = (time) => {
    console.log(time)
    apiNBAjogador(time)
}

apiNBAtimes()
// apiNBAjogador('GS')

const APItemporada = async (timeid) => {

    const temporada = await fetch(`https://api.sportsdata.io/v3/nba/scores/json/TeamGameStatsBySeason/2023/${timeid}/all?key=e3963fbd36a94552a4635833176e0d9f`)
    
    const dadoTime = await temporada.json();
    console.log(dadoTime)
    let pontos = 0
    let jogos = 0
    let vitorias = 0
    let derrotas = 0
    dadoTime.forEach((nome) =>{
        derrotas += nome.Losses
        vitorias += nome.Wins
        jogos += nome.Games
        pontos += nome.Points
    })
    console.log(pontos)
    console.log(jogos)
    console.log(vitorias)
    console.log(derrotas)
    let mediaPontos = pontos/jogos
    
    google.charts.load('current', {packages: ['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        const container = document.querySelector('#chart')
        const data = new google.visualization.arrayToDataTable([
            ['', ''],
            ['Média de pontos', mediaPontos],
            ['Jogos', jogos],
            ['Vitórias', vitorias],
            ['Derrotas', derrotas],
        ])
        const options = {
            title: `${dadoTime[0].Name} - Temporada 2023`,
            height: 800,
            width: 800,
            backgroundColor: 'none',
            titleColor: 'white',
            legendTextColor: 'white'
            
        }

        const chart = new google.visualization.PieChart(container)
        chart.draw(data, options)
    }
}

const grafico = (idTime) => {
    APItemporada(idTime)
    console.log("teste")
}


AOS.init({
    duration:1000,
    once:true,
})