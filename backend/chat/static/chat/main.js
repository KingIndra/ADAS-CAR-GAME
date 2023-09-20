// global variables
let numberOfCarsInput = 100, speedInput = 5, networkArrayInput = [9,6]
// Dialog box
const trainingInputDialog = document.getElementById("trainingInputDialog")
const confirmBtn = trainingInputDialog.querySelector("#confirmBtn")

confirmBtn.addEventListener('click', () => {
    numberOfCarsInput = Number(trainingInputDialog.querySelector("#numberOfCarsInput").value)
    speedInput = Number(trainingInputDialog.querySelector("#speedInput").value)
    trainingInputDialog.close()
    pauseFunction()
})

const pauseButton = document.getElementById("pause")

const info = document.getElementById("dis")
const bottom_info = document.getElementById("bottom-info")

const playingSection = document.getElementById("playing")
const trainingSection = document.getElementById("training")
trainingSection.remove()

let speed = null
let score = null
let highScore = null

let generation = null
let scoreTraining = null
let carsCount = null

function trainingInfo() {
    // generation = document.getElementById("generation")
    scoreTraining = document.getElementById("scoreTraining")
    carsCount = document.getElementById("carsCount")
}
function playingInfo() {
    speed = document.getElementById("speed")
    score = document.getElementById("score")
    highScore = document.getElementById("highScore")
}

// Flags and setups
trainingInfo()
playingInfo()

let playingFlag = true
let pause = false

toggleButtons(false, "trainingData")

const carCanvas=document.getElementById("carCanvas")
carCanvas.width = 200

const carCtx = carCanvas.getContext("2d")

const road = new Road(carCanvas.width/2,carCanvas.width*0.9)

// TRAFFIC
function generateTraffic() {
    shuffleArray(traverse_arr);
    for(let i=0; i<3; i++) {
        rco_traffic = randomCoordinates(0, 2, mini_traffic, maxi_traffic)
        traffic.push(new Car(road.getLaneCenter(traverse_arr[i]),rco_traffic.y,30,50,"DUMMY",2))
        mini_traffic = rco_traffic.y + MINI_TRAFFIC, maxi_traffic = rco_traffic.y + MAXI_TRAFFIC
        if(i==0) {
            firstTraffic = traffic.length - 1
        }
        if(i==2) {
            lastTraffic = traffic.length - 1
        }
    }
}
let traffic=[];
let firstTraffic = null, lastTraffic=null;
let MINI_TRAFFIC = -180, MAXI_TRAFFIC = -200, mini_traffic = MINI_TRAFFIC, maxi_traffic = MAXI_TRAFFIC;
let traverse_arr = [0,1,2];
generateTraffic()
// mini_traffic = traffic[lastTraffic].y


// STREET LIGHTS
function generateLights() {
    rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
    lights.push(new StreetLight(carCanvas.width*(rco_light.x), -50))
    mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
    for(let i=0; i<1; i++) {
        rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
        lights.push(new StreetLight(carCanvas.width*(rco_light.x), rco_light.y))
        mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
    }
    return {x:rco_light.x, y:rco_light.y}
}
let lights = []
let MINI_LIGHT = -650, MAXI_LIGHT = -700, mini_light = MINI, maxi_light = MAXI
let lastLight = generateLights()

async function usingTrainedBrain() {
    const data = await axiosBestBrain(GET)
    if(data) {
        for(let i = 0; i < cars.length; i++) {
            cars[i].brain = data
            if(i != 0) {
                NeuralNetwork.mutate(cars[i].brain, 0.25)
            }
        }
    }
    // if(localStorage.getItem("bestBrain")) {
    //     for(let i = 0; i < cars.length; i++) {
    //         cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"))
    //         if(i != 0) {
    //             NeuralNetwork.mutate(cars[i].brain, 0.25)
    //         }
    //     }
    // }
}
const N = 1
let cars = generateCars(N, "KEYS")
let bestCar = cars[0]
usingTrainedBrain()

// GENERATING CARS
function generateCars(N, mode, speed=3){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, mode, speed, 0.2));
    }
    return cars;
}

// TOP DISPLAY BUTTONS FUNCTIONS
function reload() {
    // Storing car's posotion
    const currY = bestCar.y;

    // Initializing New Car
    bestCar.repair()

    // Generating Traffic
    traffic=[];
    firstTraffic = null, lastTraffic=null;
    MINI_TRAFFIC = -180, MAXI_TRAFFIC = -220, mini_traffic = MINI_TRAFFIC, maxi_traffic = MAXI_TRAFFIC;
    traverse_arr = [0,1,2];
    generateTraffic();

    // Generating Lights
    lights = [];
    MINI_LIGHT = -700, MAXI_LIGHT = -800, mini_light = MINI, maxi_light = MAXI;
    lastLight = generateLights();

    highScr = getScr()

    usingTrainedBrain()
}

function pauseFunction() {
    pause = !pause
    if(pause) {
        pauseButton.classList.add("fa-fade")
    } else {
        pauseButton.classList.remove("fa-fade")   
    }
}

function changeMode(mode) {
    reload()
    usingTrainedBrain()
}

let storeBestCar = null;
confirmBtn.addEventListener('click', async () => {
    let button = document.getElementById("machineLearning")
    if(button.tagName !== "BUTTON") button = button.parentElement

    let brainEmoji = button.children[0]
    const brainAnimated = Number(brainEmoji.getAttribute("animated"))

    if(brainAnimated) {
        console.log(bestCar)
    }
    reload()

    brainEmoji.classList.add("fa-fade")
    brainEmoji.setAttribute("animated", 1)
    storeBestCar = bestCar
    // 
    playingSection.remove()
    bottom_info.appendChild(trainingSection)
    playingFlag = false
    // 
    trainingInfo()
    toggleButtons(false, "disableOnTraining")
    toggleButtons(true, "trainingData")
    
    // get data from dialog
    trainingInputDialog.close()
    numberOfCarsInput = Number(trainingInputDialog.querySelector("#numberOfCarsInput").value)
    speedInput = Number(trainingInputDialog.querySelector("#speedInput").value)

    cars = generateCars(numberOfCarsInput, "AI", speedInput)
    usingTrainedBrain()
    bestCar = cars[0]
})
document.getElementById("machineLearning").addEventListener('click', (e) => {
    let button = document.getElementById("machineLearning")
    if(button.tagName !== "BUTTON") button = button.parentElement

    let brainEmoji = button.children[0]
    const brainAnimated = Number(brainEmoji.getAttribute("animated"))

    if(brainAnimated) {

    }
    reload()

    if(brainAnimated) {
        brainEmoji.classList.remove("fa-fade")
        brainEmoji.setAttribute("animated", 0)
        // end training
        cars = []
        storeBestCar.repair()
        bestCar = storeBestCar
        cars.push(storeBestCar)
        usingTrainedBrain()
        KEYBOARD_EVENT_FLAG = true
        
        trainingSection.remove()
        bottom_info.appendChild(playingSection)
        playingFlag = true
        
        playingInfo()
        toggleButtons(true, "disableOnTraining")
        toggleButtons(false, "trainingData")
    } 
    else {
        KEYBOARD_EVENT_FLAG = false
        trainingInputDialog.showModal()
        pauseFunction()
    }
})


// Function For Saving and Deleting Brain Data
async function save(){
    // localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain))
    await axiosBestBrain(POST, bestCar.brain)
    alert("best car network parameters saved")
    // usingTrainedBrain()
}
async function discard(){
    // localStorage.removeItem("bestBrain")
    await axiosBestBrain(DELETE)
    alert("best car network parameters deleted")
    usingTrainedBrain()
    location.reload()
}
// 

// HighScore
function saveScr(scr){
    localStorage.setItem("highScore", JSON.stringify(scr))
}
function getScr(){
    if(localStorage.getItem("highScore") === null) {
        return 0
    } else {
        return JSON.parse(localStorage.getItem("highScore"))
    }
}
let highScr = getScr()
highScore.innerHTML = highScr

let c_for_second_car = 0
scr = 0

async function animate(){

    if(!pause) {
        for(let i=0;i<traffic.length;i++){
            traffic[i].update(road.borders,[]);
        }
        let number_of_cars = 0
        for(let i=0;i<cars.length;i++){
            cars[i].update(road.borders,traffic);
            if(!cars[i].damaged) {
                number_of_cars++
            } else {
                if(cars.length > 1) cars.splice(i, 1)
            }
        }
        traffic.push(bestCar)
        for(let i=0;i<lights.length; i++) {
            lights[i].update(traffic)
        }
        traffic.pop()

        bestCar = cars.find(
            c => c.y == Math.min(...cars.map(c => c.y))
        );
    
        carCanvas.height = window.innerHeight
    
        carCtx.save()
        carCtx.translate(0, -bestCar.y+carCanvas.height*0.7)
    
        road.draw(carCtx);
        for(let i=0;i<traffic.length;i++){
            traffic[i].draw(carCtx,"#8B008B");
        }
        let last_traffic_y = traffic[lastTraffic].y, first_traffic_y = traffic[firstTraffic].y;
        if(Math.abs(bestCar.y)>Math.abs(first_traffic_y)) {
            traverse_arr = [0,1,2];
            shuffleArray(traverse_arr)
            mini_traffic = last_traffic_y + MINI_TRAFFIC, maxi_traffic = last_traffic_y + MAXI_TRAFFIC
            for(let i=0; i<3; i++) {
                c_for_second_car++
                rco_traffic = randomCoordinates(0, 2, mini_traffic, maxi_traffic)
                traffic.push(new Car(road.getLaneCenter(traverse_arr[i]),rco_traffic.y,30,50,"DUMMY",2))

                // if(c_for_second_car%5 == 0) {
                //     let oby = rco_traffic.y
                //     oby = getRandomIntInclusive(oby - 5, oby + 5)
                    
                //     if(traverse_arr[i] == 0 || traverse_arr[i] == 2) {
                //         traffic.push(new Car(road.getLaneCenter(1), oby, 30, 50, "DUMMY", 2))
                //     } else {
                //         const rlc_zero_one = Math.floor(getRandomIntInclusive(0, 1))
                //         traffic.push(new Car(rlc_zero_one * 2, oby, 30, 50, "DUMMY", 2))
                //     }
                // }

                mini_traffic = rco_traffic.y + MINI_TRAFFIC, maxi_traffic = rco_traffic.y + MAXI_TRAFFIC
                if(i==0) firstTraffic = traffic.length-1
                if(i==2) lastTraffic = traffic.length-1
            }
            if(traffic.length > 9) {
                for(let i=0; i<3; i++) {
                    traffic.shift();
                    firstTraffic--
                    lastTraffic--
                }
            }
        }
        carCtx.globalAlpha=0.2;
        let clr = "#DC143C"
        for(let i=0;i<cars.length;i++){
            cars[i].draw(carCtx,clr);
        }
        carCtx.globalAlpha=1;
        bestCar.draw(carCtx,clr,true);
    
        // <Updates Start> //
        carCtx.save()
    
        if(playingFlag) {
            speed.innerHTML = bestCar.speed===0?0:bestCar.speed.toFixed(1)
            scr = (Math.floor(bestCar.y)-100)*-1

            // if(!bestCar.damaged) {
            //     if (leadboardSocket.readyState == 1) {
            //         leadboardSocket.send(JSON.stringify({message:scr}))
            //     }
            // }

            score.innerHTML = scr
            if(scr > highScr) {
                highScore.innerHTML = scr
                saveScr(scr)
            }
        } else {
            scr = (Math.floor(bestCar.y)-100)*-1
            scoreTraining.innerHTML = scr
            carsCount.innerHTML = number_of_cars
            if(scr > highScr) {
                highScore.innerHTML = scr
                saveScr(scr)
            }
            // generation.innerHTML = scr%2
        }
    
        // Draw Light    
        for(let i=0; i<lights.length; i++) {
            lights[i].draw(carCtx)
        }
        if(Math.abs(bestCar.y) > Math.abs(lastLight.y)-300) {
            rco_light = randomCoordinates(0, 1, mini_light, maxi_light)
            lights.push(new StreetLight(carCanvas.width*(rco_light.x), rco_light.y))
            mini_light = rco_light.y + MINI_LIGHT, maxi_light = rco_light.y + MAXI_LIGHT
            lastLight = {x:rco_light.x, y:rco_light.y}
            if(lights.length>3) {
                lights.shift()
            }
        }
    
        // <Updates End> //
    
        carCtx.restore();
        // console.table(traffic.length, lights.length, cars.length)
    }
    requestAnimationFrame(animate);
}

// setTimeout(() => {
//     if(bestCar.controlType == "KEYS")
//         bestCar.maxSpeed += bestCar.maxSpeed * 0.5
// }, 100)

animate()
