/**
 * Template field logic.
 */
var control = (function() {
    var SEPARATOR = '&nbsp;• ';

    // select a list of selectors
    function selectEach(selectors) {
        return selectors.map(function(selector) {
            return document.querySelector(selector);
        });
    }

    // format a newline-delimited list
    function formatList(text) {
        return text.trim().replace(/\s*\n\s*/g, SEPARATOR);
    }

    function addListener(inputSelectors, outputSelectors, event, handler, init) {
        var inputElements = selectEach(inputSelectors);
        var outputElements = selectEach(outputSelectors);
        var init = init === undefined ? true : init;

        function update() {
            handler(inputElements, outputElements);
        }

        inputElements.forEach(function(element) {
            element.addEventListener(event, update);
        });

        if (init) {
            update();
        }
    }

    return {
        /* set the text of output elements to the text of an input element */
        addTextListener: function(inputSelector, outputSelectors) {
            addListener(
                [inputSelector], outputSelectors,
                'input', function(inputElements, outputElements) {
                    var text = inputElements[0].value;
                    outputElements.forEach(function(element) {
                        element.innerHTML = text;
                    });
                });
        },

        /* set the text of an element to a formatted list of lines from an input */
        addListListener: function(inputSelector, outputSelector) {
            addListener(
                [inputSelector], [outputSelector],
                'input', function(inputElements, outputElements) {
                    var formattedList = formatList(inputElements[0].value);
                    outputElements[0].innerHTML = formattedList;
                });
        },

        /* set the text of an element to a formatted list of lines from many inputs */
        addMultiListListener: function(inputSelectors, outputSelector) {
            addListener(
                inputSelectors, [outputSelector],
                'input', function(inputElements, outputElements) {
                    var values = inputElements.map(function(element) {
                        return element.value;
                    });
                    outputElements[0].innerHTML = formatList(values.join('\n'));
                });
        },

        /* set the src of an image to a chosen file */
        addImageListener: function(inputSelector, outputSelector) {
            addListener(
               [inputSelector], [outputSelector],
                'change', function(inputElements, outputElements) {
                    var imageUrl = URL.createObjectURL(inputElements[0].files[0]);
                    outputElements[0].src = imageUrl;
                },
                false);
        },

        /* set a class on elements if an input is checked */
        addClassListener: function(inputSelector, outputSelectors, toggleClass) {
            addListener(
               [inputSelector], outputSelectors,
                'change', function(inputElements, outputElements) {
                    var enabled = inputElements[0].checked;
                    outputElements.forEach(function(element) {
                        if (enabled) {
                            element.classList.add(toggleClass);
                        } else {
                            element.classList.remove(toggleClass);
                        }
                    });
                });
        },

        /* set a style property of an element to the value of an input size */
        addSizeListener: function(inputSelector, outputSelectors, styleProperty, sizeUnit) {
            addListener(
               [inputSelector], outputSelectors,
                'input', function(inputElements, outputElements) {
                    var size = inputElements[0].value + sizeUnit;
                    outputElements.forEach(function(element) {
                        element.style[styleProperty] = size;
                    });
                });
        },

        /* set a style property of elements to an input color */
        addColorListener: function(inputSelector, outputSelectors, styleProperty) {
            addListener(
               [inputSelector], outputSelectors,
                'input', function(inputElements, outputElements) {
                    var color = inputElements[0].value;
                    outputElements.forEach(function(element) {
                        element.style[styleProperty] = color;
                    });
                });
        }
    };
})();
