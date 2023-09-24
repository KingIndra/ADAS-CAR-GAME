const user = String(document.getElementById('username').innerHTML)
const leadboard = document.getElementById('leadboard')?.querySelector('table')
const profile = document.getElementById('profile')?.querySelector('table')

function loadTableData(items, table) {
    const new_tbody = document.createElement('tbody')
    const old_tbody = table.querySelector('tbody')

    items.forEach( item => {
        let row = new_tbody.insertRow()

        if(item.username == user) {
            row.classList.add("table-active")
        }
        
        let rank = row.insertCell(0)
        rank.innerHTML = item.rank
        
        let username = row.insertCell(1)
        username.innerHTML = item.username
        
        let score = row.insertCell(2)
        score.innerHTML = item.score

        let highscore = row.insertCell(3)
        highscore.innerHTML = item.highscore
    })
    old_tbody.parentNode.replaceChild(new_tbody, old_tbody)
}

const leadboardSocket = new WebSocket('ws://localhost:8000/ws/game/leadboard/')
leadboardSocket.onopen = (event) => {
    console.log(event)
}
leadboardSocket.onmessage = ({data}) => {
    data = JSON.parse(data)
    if (data.profile) {
        // console.log(data)
        loadTableData([data], profile)
    } else {
        // console.log(data)
        loadTableData(data.players, leadboard)
    }
}
leadboardSocket.onclose = (event) => {
    console.log(event)
}

let prevScr = 0

setInterval(() => {
    if(condition() && leadboardSocket.readyState == 1)
        leadboardSocket.send(JSON.stringify({ message: scr }))
}, 1000)

function condition() {
    const condition = (
        ( (bestCar.controlType == "KEYS") && (playingFlag) )
        && ( (!bestCar.damaged) || (prevScr < scr) ) 
        && ( (prevScr < scr) || (!pause) )
    ) 
    prevScr = scr
    return condition ? true : false
}
// && (prevScr < scr)

async function axiosBestBrain(request, brain) {
    let respose
    switch(request) {
        case GET:
            respose = await axios.get(`game/get_bestbrain/`)
            break

        case POST:
            const data = {
                bestbrain : JSON.stringify(brain)
            }
            respose = await axios.post(`game/get_bestbrain/`, data)
            break

        case DELETE:
            respose = await axios.delete(`game/get_bestbrain/`)
            break
    }   
    let bestbrain = respose.data.bestbrain
    return bestbrain ? JSON.parse(bestbrain) : ""
}

if(user) {
    const bottom_info = document.getElementById("bottom-info")
    bottom_info.style.display = "none"
}

async function notifications() {
    let permission = await Notification.requestPermission();
    console.log(permission)
    const greeting = new Notification('Hi, How are you?',{
        body: 'Have a good day',
        icon: 'https://picsum.photos/200/300'
    });
    setTimeout(() => {
        greeting.close()
    }, 10000);
}
notifications()
