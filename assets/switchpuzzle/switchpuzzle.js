// So I have to write this in an afternoon and this is one of my first times writing javascript.
// What could go wrong?

// Yeah lots of copy pasting code, unintentional obfuscation, lets goooOOOOOooo

// by the way if you're like, reading the javascript to try to work out 

const ASPECT_RATIO = 3;
width = 100;


var buttons = [];
var switches = [];
var perm = [];
var lights = [];
var connections = [[],[]]
var mapping = [];
var inputMapping = [];
var inputBinary = [];
var signalsSent = 0;
var u = 10;
var n = 4;
var ni = 1;
var nlist = [2,4,8,16];

var mappingButton;
var sendButton;
var restartButton;
var nButton;
var mappingMode = true;
var endMode = false;

var messageText = "testing testing one two three";

/**
 * detect IEEdge
 * returns version of IE/Edge or false, if browser is not a Microsoft browser
 */
 function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // other browser
    return false;
}

function genPermutation(n){
    seen = []
    for (let i = 0; i < n; i++){
        seen.push(false);
    }
    res = []
    for (let i = 0; i < n; i++){
        let x = Math.floor(Math.random() * n);
        x = Math.min(x,n-1);
        while(seen[x]){
            x = Math.floor(Math.random() * n);
            x = Math.min(x,n-1);
        }
        seen[x] = true;
        res.push(x);
    }
    return res;
}

class Light{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.on = false;
    }
    render(){
        strokeWeight(0.5 * u);
        stroke(150);

        if (this.on){
            fill(255);
        }
        else{
            fill(20);
        }
        
        rect(this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size)
    }
}

class Button{
    constructor(x,y,size, label = "heh",onClick = function(){}){
        this.x = x;
        this.y = y;
        this.size = size;
        this.onClick = onClick;
        this.label = label;
        this.clickTimer = 0;
    }

    mouseHover(){
        return Math.max(Math.abs(this.x-mouseX), Math.abs(this.y-mouseY)) <= this.size
    }

    render(){
        if (this.clickTimer >= 0){
            this.clickTimer -= 5;
        }
        strokeWeight(0.5 * u);
        stroke(150);
        if (this.mouseHover()){
            fill(210 - this.clickTimer);
        }
        else{
            fill(180 - this.clickTimer);
        }
        rect(this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size)


        stroke(0);
        strokeWeight(0);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(this.size * 0.3)
        text(this.label,this.x,this.y);
    }

    onClick(){
        
    }
};

class Switch{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.on = false;
    }

    mouseHover(){
        return Math.max(Math.abs(this.x-mouseX), Math.abs(this.y-mouseY)) <= this.size
    }

    render(){
        strokeWeight(0.5 * u);
        stroke(150);
        if (!mappingMode && !endMode && this.mouseHover()){
            if (this.on){
                fill(200);
            }
            else{
                fill(60);
            }
        }
        else{
            if (this.on){
                fill(255);
            }
            else{
                fill(20);
            }
        }
        rect(this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size)
      return null
    }

    onClick(){
        if (!mappingMode && !endMode){
            messageText = "";
            this.on = !this.on;
            for (let i = 0; i < n; i++){
                lights[i].on = false;
            }
        }
    }
};




class Connection{
    constructor(x,y,size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.on = false;
    }

    mouseHover(){
        return Math.max(Math.abs(this.x-mouseX), Math.abs(this.y-mouseY)) <= this.size
    }

    render(){
        if (!mappingMode){
            return;
        }
        strokeWeight(0.5 * u);
        stroke(150);
        if (!endMode && this.mouseHover()){
            if (this.on){
                fill(200);
            }
            else{
                fill(60);
            }
        }
        else{
            if (this.on){
                fill(255);
            }
            else{
                fill(20);
            }
        }
        rect(this.x - this.size, this.y - this.size, 2 * this.size, 2 * this.size)
    }

    onClick(){
        if (!mappingMode || endMode){
            return;
        }
        messageText = "";
        this.on = !this.on;
        let cnt = [0,0];
        let idx = [0,0];
        let invalid = false;

        for (let i = 0; i < n && !invalid; i++){
            for (let j = 0; j < 2; j++){
                if (connections[j][i].on){
                    
                    cnt[j] += 1;
                    idx[j] = i;
                }
                if (cnt[j] == 2){
                    invalid = true;
                    break;
                }    
            }
        }
        function clearConnections(){
            for (let i = 0; i < n; i++){
                for (let j = 0; j < 2; j++){
                    connections[j][i].on = false;
                }
            }
        }
        if (invalid){
            clearConnections();        
            messageText = "Please connect a switch to a light";
        }
        else if (cnt[0] == 1 && cnt[1] == 1){
            if (inputMapping[idx[0]] == idx[1]){
                inputMapping[idx[0]] = -1;
            }
            else{
                inputMapping[idx[0]] = idx[1];
            }
            clearConnections();
        }
       

    }
};

function windowResized() {
    let canvasDiv = document.getElementById('sketch-holder');
    width = canvasDiv.offsetWidth; 
    resizeCanvas(width, width*ASPECT_RATIO);
}

function toggleMappingModeButton(){
    this.clickTimer = 100;
    mappingMode = !mappingMode;
    if (mappingMode){
        // for (let i = 0; i < n; i++){
        //     lights[i].on = false;
        // }
        this.label = "Input\nSignals";
        sendButton.label = "Submit\nMapping";
    }
    else{
        
        this.label = "Draw\nConnections";
        sendButton.label = "Send\nSignals";
    }
}

function sendSignalsButton(){
    this.clickTimer = 100;

    if (mappingMode){
        // Check for invalid mapping.
        let seen = [];
        for (let i = 0; i < n; i++){
            seen.push(false);
        }
        for (let i = 0; i < n; i++){
            if (inputMapping[i] == -1){
                // Check that all switches are connected
                // print("Invalid permutation");
                messageText = "Invalid connections. All switches must be connected.";
                return;
            }
            if (seen[inputMapping[i]]){
                // Check that all lights are connected
                messageText = "Invalid connections. All lights must be connected.";
                return;
            }
            seen[inputMapping[i]] = true;
        }
        // We now have a valid permutation, and now we're submitting it for real.
        // Firstly check if it matches the permutation at all.
        for (let i = 0; i < n; i++){
            if (inputMapping[i] != mapping[i]){
                // Nope rip
                print("Fail :(");
                messageText = "The connections you inputted are incorrect. The original connections are displayed."
                endMode = true;

                return;
            }
        }

        // Now we do some adaptive stuff, and make sure the user didn't get it by chance.
        let dict = {};
        for (let i = 0; i < n; i++){
            my_str = String(inputBinary[i]);
            if (my_str in dict){
                // Adaptive stuff :)
                tmp = mapping[dict[my_str]];
                mapping[dict[my_str]] = i;
                mapping[i] = tmp;
                // Now display mapping, should be a valid mapping that is unequal to the submitting mapping.
                messageText = "The connections you inputted are incorrect. The original connections are displayed."
                endMode = true;

                return;
            }
            dict[my_str] = i;
        }
        messageText = "The connections you inputted are correct! Congratulations!"
        endMode = true;
        
    }
    else{
        signalsSent += 1;
        for (let i = 0; i < n; i++){
            if (detectIE()){
                inputBinary[i] *= 2;
                if (switches[i].on){
                    lights[mapping[i]].on = true;
                    inputBinary[i] += 1;
                }    
            }
            else{
                inputBinary[i] *= 2n;
                if (switches[i].on){
                    lights[mapping[i]].on = true;
                    inputBinary[i] += 1n;
                }   
            }        
        }
    }
}

function restart(){
    switches = [];
    buttons = [];
    lights = [];
    connections = [[],[]];
    inputMapping = [];
    inputBinary = [];
    signalsSent = 0;
    endMode = false;
    mappingMode = false;
    messageText = "";

    n = nlist[ni];
    for(let i = 0; i < n; i++){
        inputMapping[i] = -1;
        if (detectIE()){
            // You get some possibly glitchy nonsense with the adaptive grader.
            inputBinary.push(0);
        }
        else{
            // You get clean, pristine integers.
            inputBinary.push(0n);
        }
    }
    // So we can't seed the RNG in javascript. Luckily, I have my own hacky solution
    letMeSeedRNG = Date.now() % 1007;
    for (let i = 0; i < letMeSeedRNG; i++){
        if (Math.random() > 1){
            print("This should make sure that Math.random() actually gets called");
        }
    }
    mapping = genPermutation(n);
    for(let i = 0; i < n; i++){
        let my_switch = new Switch(25 * u, (15 * i + 10) * u, 5 * u);
        switches.push(my_switch);
        buttons.push(my_switch);
        
        let my_light = new Light(75 * u, (15 * i + 10) * u, 5 * u);
        lights.push(my_light);

        let connection1 = new Connection(30 * u, (15 * i + 10) * u, 2.5 * u);
        buttons.push(connection1);
        connections[0].push(connection1);

        let connection2 = new Connection(70 * u, (15 * i + 10) * u, 2.5 * u);
        buttons.push(connection2);
        connections[1].push(connection2);
    }

    sendButton = new Button(12.5*u, (15 * n + 20) * u, 10 * u, label = "Send\nSignals", onClick = sendSignalsButton);
    buttons.push(sendButton);


    mappingButton = new Button(37.5*u, (15 * n + 20) * u, 10 * u, label = "Draw\nConnections", onClick = toggleMappingModeButton);
    buttons.push(mappingButton);

    // WHY DOES THIS WORK???? JAVASCRIPT IS SO CURSED.
    restartButton = new Button(62.5*u, (15 * n + 20) * u, 10 * u, label = "Restart", onClick = restartButtonFunc);
    buttons.push(restartButton);

    nButton = new Button(87.5*u, (15 * n + 20) * u, 10 * u, label = "n = " + String(nlist[ni]), onClick = changeNButton);
    buttons.push(nButton);
}


function restartButtonFunc(){
    this.clickTimer = 100;
    // LIKE LOOK AT THIS? ISN'T THIS MUTUAL RECURSION??? 
    restart();
}

function changeNButton(){
    this.clickTimer = 100
    ni = (ni + 1) % nlist.length;
    this.label = "n = " + String(nlist[ni]);
}

function setup() {
    let canvasDiv = document.getElementById('sketch-holder');
    width = canvasDiv.offsetWidth;
    var canvas = createCanvas(width, width*ASPECT_RATIO);
    u = width/100
    canvas.parent('sketch-holder');
    
    // let x = new Button(30 * u,30 * u, 5 * u, function(){console.log("Hi!")});

    restart();
    
}


function mouseClicked(){
    for(let i = 0; i < buttons.length; i++){
        if (endMode && (buttons[i] ==sendButton || buttons[i] == mappingButton)){
            continue;
        }
        if (buttons[i].mouseHover()){
            buttons[i].onClick()
        }
    }
}

function drawMapping(mapping){
    for(let i = 0; i < n; i++){
        if (mapping[i] != -1){
            // BEHOLD. CRAZY MATH TIME.
            // draws the wiring, in a way that doesn't collide with anything.
            stroke(150);
            strokeWeight(2.5 * u / n)

            let x1 = 32.5 * u;
            let y1 = ((10 + 15 * i) + (i - (n-1)/2)/n * 5) * u;
            
            let x2 = (50 +  (i - (n-1)/2)/n * 10) * u;
            let y2 = y1;

            let x3 = x2;
            let y3 = ((10 + 15 * mapping[i]) + (i - (n-1)/2)/n * 5) * u;

            let x4 = 67.5 * u;
            let y4 = y3;


            line(x1,y1,x2,y2);
            line(x2,y2,x3,y3);
            line(x3,y3,x4,y4);
        }
    }
}

function draw() {
    background(37);
    for(let i = 0; i < lights.length; i++){
        lights[i].render();
    }
    for(let i = 0; i < buttons.length; i++){
        if (endMode && (buttons[i] ==sendButton || buttons[i] == mappingButton)){
            continue;
        }

        buttons[i].render();
    }
    if (endMode){
        restartButton.x = 37.5 * u;
        nButton.x = 62.5 * u;
        drawMapping(mapping);
    }
    else if (!mappingMode){
        
        
        for(let i = 0; i < n; i++){
            noStroke();
            fill(150);
            rect(30 * u, (8 + 15 * i) * u, 40 * u, 4 * u);
            
            let sz = 1.5;
            strokeWeight(0.5 * u);
            stroke(150);
            fill(0);
            triangle((35 - sz) * u, (10 + 15 * i - sz) * u, (35 + sz * 2) * u, (10 + 15 * i) * u, (35 - sz) * u, (10 + 15 * i + sz) * u)
            triangle((65 - sz) * u, (10 + 15 * i - sz) * u, (65 + sz * 2) * u, (10 + 15 * i) * u, (65 - sz) * u, (10 + 15 * i + sz) * u)
        }
        strokeWeight(0.5 * u);
        stroke(80);
        fill(0);
        rect(40 * u, 5 * u, 20 * u, (15 * n - 5) * u)

        strokeWeight(0);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(10 * u);
        if (n == 2){
            text("???\n???\n",50 * u, 7.5 * n * u + 10 * u);
        }
        else{
            text("???\n???\n???\n",50 * u, 7.5 * n * u + 10 * u);

        }
    }
    else{
        drawMapping(inputMapping);        
    }

    strokeWeight(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(3 * u);
    text(messageText,10*u,(15 * n ) * u, 80 * u, 10 * u);
    text("Switches", 25 * u, 2.5 * u);
    text("Lights", 75 * u, 2.5 * u);
    text("Signals sent: " + String(signalsSent), 50 * u, 2.5 * u);
}
