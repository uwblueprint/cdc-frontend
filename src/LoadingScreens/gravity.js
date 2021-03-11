var sceneEl = document.querySelector('a-scene');
var entityEl = document.createElement('a-entity');

let container = document.querySelector("#container");
let colors = ["red", "orange", "yellow", "green", "blue", "purple", "hotpink"];
    
function addBall() {
    let x = 0//Math.random() * 10 - 5;
    let y = 0//Math.random() * 50 + 2;
    let z = 0//Math.random() * -10;
    for (let i = 0; i < 75; i++) {
        container.innerHTML += `<a-sphere click-drag dynamic-body position="${x} ${y} ${z}" radius="0.5" color="${
            colors[Math.floor(Math.random() * colors.length)]
        }" mass="0.5"></a-sphere>`;
    }
}

//This code below is me trying to set up an event listener but failing because I suck at js :))

entityEl.addEventListener("animationbegin", addBall(animation__button-pressed)) 

/*AFRAME.registerComponent("reverse-gravity", {

    init: function () {
        var data = this.data.jsonData;
        var el = this.el;

        entityEl.addEventListener("mousedown", addBall()) 
}*/