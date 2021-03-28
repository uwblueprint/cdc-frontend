var input = "";
var key = "time";

var prompt = `<a-box src="#riddle" static-body position="0 12 -20" width="10" height="10" depth="1"></a-box>`;

function setPrompt(e) {}

function updateInput(e) {
    var code = parseInt(e.detail.code);
    console.log(code);
    document.querySelector("#input").setAttribute("color", "black");
    switch (code) {
        case 8:
            input = input.slice(0, -1);
            break;

        case 6:
            alert("You triggered case 6");
            var keyboard = document.querySelector("#keyboard");
            document.querySelector("#input").setAttribute("value", input);
            document.querySelector("#input").setAttribute("color", "blue");
            keyboard.parentNode.removeChild(keyboard);
            return;

        case 13:
            if (key == input.toLowerCase()) {
                document
                    .querySelector("#input")
                    .setAttribute("value", "Congratulations!");
                document.querySelector("#input").setAttribute("color", "green");
                camera = document.querySelector("#camera");
                camera.setAttribute("look-controls", { enabled: true });
                camera.setAttribute("wasd-controls", { enabled: true });
                document.querySelector("#clue").removeAttribute(freeze);
                var keyboard = document.querySelector("#keyboard");
                keyboard.parentNode.removeChild(keyboard);
            } else {
                input = "";
                document.querySelector("#input").setAttribute("color", "red");
                document.querySelector("#input").setAttribute("value", "X");
            }
            return;

        case 192: //this is the "`" key, right below Esc; for some reason the Esc key doesn't have a proper code
            camera = document.querySelector("#camera");
            camera.setAttribute("look-controls", { enabled: true });
            camera.setAttribute("wasd-controls", { enabled: true });
            return;

        default:
            input = input + e.detail.value;
            break;
    }
    document.querySelector("#input").setAttribute("value", input + "_");
}
document.addEventListener("a-keyboard-update", updateInput);

AFRAME.registerComponent("freeze", {
    init: function () {
        const data = this.data.jsonData;
        const el = this.el;

        el.addEventListener("click", function (e) {
            //document.querySelector("#freezer").setAttribute("visible", false);
            document.querySelector("#input").setAttribute("visible", true);
            document
                .querySelector("#input")
                .setAttribute("value", "Answer here...");
            input = "";

            document.querySelector("#charlim").setAttribute("visible", true);
            document
                .querySelector("#charlim")
                .setAttribute("value", "(" + key.length + " characters)");

            camera = document.querySelector("#camera");
            camera.setAttribute("look-controls", { enabled: false });
            camera.setAttribute("wasd-controls", { enabled: false });
            camera.setAttribute("position", { x: -10, y: 0, z: 0 });

            //updateInput(e);
        });
    },
});
