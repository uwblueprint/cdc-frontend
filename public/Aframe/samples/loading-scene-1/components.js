AFRAME.registerComponent("detect-button", {
    init: function () {
        var data = this.data;
        var el = this.el;

        el.addEventListener("mouseenter", function () {
            el.setAttribute(
                "animation__button-enter",
                "property: scale; to: 1.1 1.1 1.1; dur: 500; dir:alternate; startEvents: mouseenter"
            );
        });

        el.addEventListener("mouseleave", function () {
            el.setAttribute(
                "animation__button-leave",
                "property: scale; to: 1 1 1; startEvents: mouseleave"
            );
        });

        el.addEventListener("mousedown", function () {
            el.setAttribute(
                "animation__button-pressed",
                "property: object3D.position.y; to: -5.5; dir: alternate; dur: 50; startEvents: mousedown"
            );

            el.emit("buttondown", false);
        });

        el.addEventListener("mouseup", function () {
            el.setAttribute(
                "animation__button-released",
                "property: object3D.position.y; to: -5; dir: alternate; dur: 100; startEvents: mouseup"
            );
        });
    },
});

function addBall(x, y, z) {
    let container = document.querySelector("#container");
    let colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "hotpink",
    ];

    var scene = document.querySelector("a-scene");
    var ball = document.createElement("a-sphere");

    ball.setAttribute("id", "ball");
    ball.setAttribute("dynamic-body", "");
    ball.setAttribute("position", { x: x, y: y, z: z });
    ball.setAttribute("radius", "0.5");
    ball.setAttribute(
        "color",
        `${colors[Math.floor(Math.random() * colors.length)]}`
    );
    ball.setAttribute("mass", "0.5");

    scene.appendChild(ball);
}

AFRAME.registerComponent("add-ball", {
    init: function () {
        var data = this.data;
        var el = this.el;

        el.addEventListener("buttondown", function () {
            var curBalls = document.querySelectorAll("#ball");

            for (let i = 0; i < curBalls.length; i++) {
                curBalls[i].parentNode.removeChild(curBalls[i]);
            }

            let x = Math.random() * 20 - 10;
            let y = 0;
            let z = Math.random() * -20 + 5;

            for (let i = 0; i < 10; i++) {
                addBall(x, y, z);
            }
        });
    },
});

//this function doesn't work only because I'm pretty sure you somehow can't change physics in a-scene.
//I could change the background colour using this function, but not gravity or debug.
AFRAME.registerComponent("gravity-switcher", {
    init: function () {
        var data = this.data;
        var el = this.el;
    },

    update: function () {
        var data = this.data;
        var el = this.el;

        el.addEventListener("buttondown", function () {
            let colors = [
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple",
                "hotpink",
            ];

            var physics = el.getAttribute("physics");
            var gravity = physics["gravity"];
            gravity *= -1;
            el.setAttribute("physics", {
                debug: false,
                gravity: gravity,
            });

            el.setAttribute("background", {
                color: `${colors[Math.floor(Math.random() * colors.length)]}`,
            });
        });
    },
});
