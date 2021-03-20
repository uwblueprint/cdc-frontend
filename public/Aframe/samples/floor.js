AFRAME.registerComponent("floor", {
    multiple: true,
    init: function () {},
});

AFRAME.registerComponent("camera-floor", {
    dependencies: ["floor"],
    init: function () {
        renderFloor();
    },
});

async function renderFloor() {
    setTimeout(function () {
        var playerEl = document.querySelector("[camera]");
        playerEl.setAttribute("look-controls", "pointerLockEnabled: true");
        playerEl.setAttribute("wasd-controls", "");
        playerEl.setAttribute("kinematic-body", "");
    }, 4 * 1000);
}
