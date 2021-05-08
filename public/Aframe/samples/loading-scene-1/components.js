AFRAME.registerComponent("detect-button", {
    init: function () {
        const el = this.el;

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
    const colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "hotpink",
    ];

    const scene = document.querySelector("a-scene");
    const ball = document.createElement("a-sphere");

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
        const el = this.el;

        el.addEventListener("buttondown", function () {
            const curBalls = document.querySelectorAll("#ball");

            for (let i = 0; i < curBalls.length; i++) {
                curBalls[i].parentNode.removeChild(curBalls[i]);
            }

            // generating all balls in one place, so when user runs into it, they
            // get a ton of balls flying around which would not be initially expected
            const x = Math.random() * 20 - 10;
            const y = 0;
            const z = Math.random() * -20 + 5;

            for (let i = 0; i < 10; i++) {
                addBall(x, y, z);
            }

            // reset camera position
            const cameraEl = document.querySelector("#camera");
            const prevPos = cameraEl.getAttribute("position");
            cameraEl.setAttribute("position", {
                x: prevPos.x,
                y: 0,
                z: prevPos.z,
            });
        });
    },
});

//this function doesn't work only because I'm pretty sure you somehow can't change physics in a-scene.
//I could change the background colour using this function, but not gravity or debug.
AFRAME.registerComponent("gravity-switcher", {
    update: function () {
        const el = this.el;

        el.addEventListener("buttondown", function () {
            const colors = [
                "red",
                "orange",
                "yellow",
                "green",
                "blue",
                "purple",
                "hotpink",
            ];

            const physics = el.getAttribute("physics");
            let gravity = physics["gravity"];
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
