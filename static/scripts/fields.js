/**
 * Template field logic.
 */
var fields = {
    // add a number input listener that updates the font size of elements
    addSizeListener :function(inputElement, outputElements) {
        function update() {
            outputElements.forEach(function(element) {
                element.style.fontSize = inputElement.value + 'pt';
            });
        }

        inputElement.addEventListener("input", update);
        update();
    },

    // add a color input listener that updates an element's style property
    addColorListener: function(inputElement, outputElement, styleProperty) {
        function update() {
            outputElement.style[styleProperty] = inputElement.value;
        }

        inputElement.addEventListener("input", update);
        update();
    },

    // add a file input listener that updates an image element's src
    addImageListener: function(inputElement, outputElement) {
        inputElement.addEventListener("change", function(event) {
            outputElement.src = URL.createObjectURL(inputElement.files[0]);
        });
    },

    // add a checkbox input listener that toggles a class on elements
    addCheckboxListener: function(inputElement, outputElements, toggleClass) {
        function update() {
            var enabled = inputElement.checked;
            outputElements.forEach(function(element) {
                if (enabled) {
                    element.classList.add(toggleClass);
                } else {
                    element.classList.remove(toggleClass);
                }
            });
        }

        inputElement.addEventListener("change", update);
        update();
    },

    // add a text input listener that sets the text of elements
    addInputListener: function(inputElement, outputElements) {
        function update() {
            outputElements.forEach(function(element) {
                element.innerHTML = inputElement.value;
            });
        }

        inputElement.addEventListener("input", update);
        update();
    },

    // add text input listeners that set the text of all track elements
    addTrackListener: function(inputElements, outputElements, trackElement, separator) {
        separator = separator || '&nbsp;• ';

        function update() {
            var sides = inputElements.map(function(element, index) {
                var tracks = element.value.trim().replace(/\s*\n\s*/g, separator);

                // update label and tracks
                var outputElement = outputElements[index];
                outputElement.style.display = tracks ? 'block' : 'none';
                outputElement.querySelector('.tracks').innerHTML = tracks;

                return tracks;
            });
            // remove empty sides to prevent adding extra separators
            var nonEmptySides = sides.filter(function(side) {
                return side.length > 0;
            });
            trackElement.innerHTML = nonEmptySides.join(separator);
        }

        inputElements.forEach(function(element) {
            element.addEventListener("input", update);
        });
        update();
    }
};
