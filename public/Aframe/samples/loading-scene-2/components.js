AFRAME.registerComponent("collision-detect", {
    init: function () {
        this.el.addEventListener("collide", function (e) {
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
        });
    },
});

AFRAME.registerComponent("detect-key", {
    init: function () {
        const el = this.el;

        el.addEventListener("mouseenter", function () {
            el.setAttribute(
                "animation__button-enter",
                "property: scale; to: 1.1 1.1 1.1; dur: 50; dir:alternate; startEvents: mouseenter"
            );
        });

        el.addEventListener("mouseleave", function () {
            el.setAttribute(
                "animation__button-leave",
                "property: scale; to: 1 1 1; dur: 50; startEvents: mouseleave"
            );
        });

        el.addEventListener("mousedown", function () {
            let y = el.object3D.position.y;
            if (-9 === y || -9.5 === y) {
                y = -9.5;
            } else {
                y = -10.5;
            }

            el.setAttribute(
                "animation__button-pressed",
                `property: object3D.position.y; to: ${y}; dir: alternate; dur: 20; startEvents: mousedown`
            );

            el.emit("keydown", false);
        });

        el.addEventListener("mouseup", function () {
            let y = el.object3D.position.y;
            if (-9.5 === y || -9 === y) {
                y = -9;
            } else {
                y = -10;
            }

            el.setAttribute(
                "animation__button-released",
                `property: object3D.position.y; to: ${y}; dir: alternate; dur: 20; startEvents: mouseup`
            );
        });
    },
});
