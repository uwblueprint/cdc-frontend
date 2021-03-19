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

AFRAME.registerComponent("detect-key", {
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
                "property: object3D.position.y; to: -10.5; dir: alternate; dur: 50; startEvents: mousedown"
            );

            el.emit("keydown", false);
            console.log("keydown");
        });

        el.addEventListener("mouseup", function () {
            el.setAttribute(
                "animation__button-released",
                "property: object3D.position.y; to: -5; dir: alternate; dur: 100; startEvents: mouseup"
            );
        });
    },
});
