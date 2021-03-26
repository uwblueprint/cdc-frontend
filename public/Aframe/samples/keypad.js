AFRAME.registerComponent("my_keyboard_controller", {
    init: function () {
        this.el.addEventListener("superkeyboardinput", function (event) {
            if (event.detail.value === "1234") {
                var numpad = document.querySelector("#keyboard-display");
                numpad.setAttribute(
                    "super-keyboard",
                    "label:SUCCESS; labelColor: green; multipleInputs:true"
                );
            } else {
                var numpad = document.querySelector("#keyboard-display");
                var statusLabel = numpad.getAttribute("super-keyboard").label;
                if (statusLabel != "SUCCESS") {
                    numpad.setAttribute(
                        "super-keyboard",
                        "label:ERROR; labelColor: red"
                    );
                    removeError();
                }
            }
        });
    },
});

async function removeError() {
    setTimeout(function () {
        var numpad = document.querySelector("#keyboard-display");
        numpad.setAttribute(
            "super-keyboard",
            "label:Enter Password; labelColor: black"
        );
    }, 1.5 * 1000);
}
