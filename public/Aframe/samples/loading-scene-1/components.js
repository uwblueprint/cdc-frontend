AFRAME.registerComponent("collision-detect", {
    init: function () {
        this.el.addEventListener("collide", function (e) {
            console.log("Player has collided with ", e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
        });
    },
});

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

function addBall() {
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

    let x = Math.random() * 10 - 5;
    let y = Math.random() * 5 + 2;
    let z = Math.random() * -10;

    container.innerHTML += `<a-sphere collision-detect id="ball" click-drag kinematic-body position="${x} ${y} ${z}" radius="0.5" color="${
        colors[Math.floor(Math.random() * colors.length)]
    }" mass="0.5"></a-sphere>`;
}

AFRAME.registerComponent("add-ball", {
    update: function () {
        var data = this.data;
        var el = this.el;

        var curBalls = document.querySelectorAll("#ball");

        console.log(curBalls);

        for (let i = 0; i < curBalls.length; i++) {
            let container = document.querySelector("#container");
            container.removeChild(curBalls[i]);
        }

        el.addEventListener("buttondown", function () {
            for (let i = 0; i < 10; i++) {
                addBall();
            }
        });
    },

    remove: function () {

    }
});

AFRAME.registerComponent("gravity-switcher", {
    /*init: function () { //not sure if this code is necessary but keeping it in just in case
        var data = this.data;
        var el = this.el; 
    },*/

    update: function () {
        var data = this.data;
        var el = this.el;

        el.addEventListener("buttondown", function () {
            var physics = el.getAttribute("physics");
            console.log("physics check:", physics);
            var gravity = physics["gravity"];
            console.log("gravity before: ", physics);
            gravity *= -1;
            console.log("gravity after: ", physics);
            el.setAttribute("physics", {
                debug: false,
                gravity: gravity,
            });
        });
    },
});
