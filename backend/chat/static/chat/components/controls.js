class Controls{
    constructor(type) {
        this.forward = true
        this.left = false
        this.right = false
        this.reverse=false
        this.maxSpeed = null
        this.type = type

        switch(type) {
            case "KEYS":
                this.#addSpeedListner()
                this.#addControlListner()
                this.#addKeyboardListeners()
                this.#addOrentatinListner()
                break

            case "BOT":
                this.#addSpeedListner()
                this.#addControlListner()
                this.#addKeyboardListeners()
                break
        }
        this.c = 0
        this.c_for_speed = 1
    }

    #addOrentatinListner() {
        const handleOrientation = (event) => {
            let gama = event.gamma, objOrientation
            if(gama<0) objOrientation = { left:true, right:false }
            else if(gama>0) objOrientation = { left:false, right:true }
            else objOrientation = { left:false, right:false }
            this.left = objOrientation.left, this.right = objOrientation.right
        }
        window.addEventListener("deviceorientation", handleOrientation)
    }

    #addControlListner() {
        const handleControl = (event) => {
            let button = event.target
            if(button.tagName !== "BUTTON") button = button.parentElement

            const iconAi = '<i class="fa-solid fa-robot fa-fade">'
            const iconKeys = '<i class="fa-solid fa-gamepad">'

            if(button.getAttribute("mode") === "KEYS") {
                button.innerHTML = iconAi
                button.setAttribute("mode","BOT")
                this.type = "BOT"
            } else {
                this.type = "KEYS"
                button.innerHTML = iconKeys
                button.setAttribute("mode","KEYS")
            }
        }
        const button = document.getElementById("changeMode")
        button.addEventListener("click", handleControl)
    }

    #addSpeedListner() {
        const handleControl = (event) => {
            let button = event.target
            if(button.tagName !== "BUTTON") button = button.parentElement

            let speed = Number(button.getAttribute('speed'))
            
            if(speed < 1 || 8 < speed) {
                speed = 2
                this.c_for_speed = 1
            }
            if(this.c_for_speed%8 === 0) {
                speed -= 7
            } else {
                speed += 1
            }
            this.c_for_speed++
            button.innerHTML = '<i class="fa-solid fa-'+ speed +' fa-fade"></i>'
            button.setAttribute("speed", speed)
            this.maxSpeed = speed
        }
        const button = document.getElementById("changeSpeed")
        button.addEventListener("click", handleControl)
    }

    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            if(KEYBOARD_EVENT_FLAG) {
                const button = document.getElementById("changeSpeed")
                let speed = Number(event.key)
                if (event.key == "m" || event.key == "M") {
                    speed = 15
                }
                if(speed) {
                    button.innerHTML = '<i class="fa-solid fa-'+speed+' fa-fade"></i>'
                    button.setAttribute("speed", speed)
                    this.maxSpeed = speed
                }
                if (event.key == "m" || event.key == "M") {
                    speed = 15
                    button.innerHTML = 'M'
                    button.setAttribute("speed", speed)
                    this.maxSpeed = speed
                }
                switch(event.key){
                    case "ArrowLeft":
                        if(this.type === "KEYS") this.left=true;
                        break;
                    case "ArrowRight":
                        if(this.type === "KEYS") this.right=true;
                        break;
                    case "0":
                        this.forward = false;
                        break;
                }
            }
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    if(this.type === "KEYS") this.left=false;
                    break;
                case "ArrowRight":
                    if(this.type === "KEYS") this.right=false;
                    break;
                case "0":
                    this.forward = true;
                    break;
            }
        }
    }
}