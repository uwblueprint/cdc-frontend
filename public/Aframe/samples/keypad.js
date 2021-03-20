AFRAME.registerComponent("my_keyboard_controller", {
    init: function () {
        // console.log("init here!!")
        // console.log(this.el)
        this.el.addEventListener("superkeyboardinput", function (event) {
            // alert(detail.value); // the text
            if (event.detail.value === "1234") {
                var numpad = document.querySelector("#keyboard-display");
                numpad.setAttribute(
                    "super-keyboard",
                    "label:SUCCESS; labelColor: green"
                );
                console.log(numpad);
            } else {
                var numpad = document.querySelector("#keyboard-display");
                numpad.setAttribute(
                    "super-keyboard",
                    "label:ERROR; labelColor: red"
                );
                console.log(numpad);
                removeError();
            }
            // console.log(event.detail.value)
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
// I guess sandbox for users at the end lol
