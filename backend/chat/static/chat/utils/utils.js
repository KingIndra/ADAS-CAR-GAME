function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
                
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// RANDOM GENERATOR
let MINI = 0, MAXI = 0, mini = MINI, maxi = MAXI;
const randomCoordinates = (a,b,c,d) => ({
    x: getRandomIntInclusive(a,b),
    y: getRandomIntInclusive(c,d)
});
let rco = null;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function toggleButtons(flag, className) {
    const elements = document.getElementsByClassName(className)
    for(let i=0; i<elements.length; i++) {
        elements[i].disabled = !flag
    }
}

function isDigit(char) {
    let ascii = char.charCodeAt(0)
    return (ascii < 48 || ascii > 57) ? false : true
}

function stringToArray(str) {
    str = str + " "
    let res = []
    for(let i=0; i<str.length; i++) {   
        let j = i
        if(isDigit(str[i])) {
            while(isDigit(str[i])) i++
            res.push(Number(str.slice(j, i)))
            i--
        }
    }
    return res
}

KEYBOARD_EVENT_FLAG = true
const GET = 0, POST = 1, DELETE = 2