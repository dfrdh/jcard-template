/*
 * Interactive j-card template logic.
 */
var jcard = (function() {
    // find input elements in the controls module
    function findInputs(controls) {
        var id = controls.id;
        return {
            titleSize:  document.querySelector('#' + id + '-title-size'),
            trackSize:  document.querySelector('#' + id + '-track-size'),
            typeSize:   document.querySelector('#' + id + '-type-size'),
            noteSize:   document.querySelector('#' + id + '-note-size'),
            backSize:   document.querySelector('#' + id + '-back-size'),
            shortBack:  document.querySelector('#' + id + '-short-back'),

            cardColor:  document.querySelector('#' + id + '-card-color'),
            textColor:  document.querySelector('#' + id + '-text-color'),
            cover:      document.querySelector('#' + id + '-cover'),
            title:      document.querySelector('#' + id + '-title'),
            subtitle:   document.querySelector('#' + id + '-subtitle'),
            type:       document.querySelector('#' + id + '-type'),
            noteUpper:  document.querySelector('#' + id + '-note-upper'),
            noteLower:  document.querySelector('#' + id + '-note-lower'),
            sideA:      document.querySelector('#' + id + '-side-a'),
            sideB:      document.querySelector('#' + id + '-side-b')
        }
    }

    // find output elements in the template module
    function findOutputs(template) {
        return {
            root:           template,
            boundaries:     template.querySelector('.template-boundaries'),
            back:           template.querySelector('.template-back'),
            cover:          template.querySelector('.template-cover'),
            titleGroups:    [
                template.querySelector('.template-front-title-group'),
                template.querySelector('.template-spine-title-group')],
            titles:         [
                template.querySelector('.template-front-title'),
                template.querySelector('.template-spine-title')],    
            subtitles:      [
                template.querySelector('.template-front-subtitle'),
                template.querySelector('.template-spine-subtitle')],
            tracks:         template.querySelector('.template-tracks'),
            type:           template.querySelector('.template-type'),
            noteGroup:      template.querySelector('.template-note-group'),
            noteUpper:      template.querySelector('.template-note-upper'),
            noteLower:      template.querySelector('.template-note-lower'),
            sideA:          template.querySelector('.template-side-a'),
            sideB:          template.querySelector('.template-side-b')
        }
    }

    // add listeners to inputs that update outputs
    function addListeners(inputs, outputs) {
        // layout
        outputs.titleGroups.map(function(groupOutput) {
            addSizeListener(inputs.titleSize, groupOutput);
        });
        addSizeListener(inputs.trackSize, outputs.tracks);
        addSizeListener(inputs.typeSize, outputs.type);
        addSizeListener(inputs.noteSize, outputs.noteGroup);
        addSizeListener(inputs.backSize, outputs.back);
        addToggleListener(inputs.shortBack, outputs.root, 'short-back');

        // content
        addColorListener(inputs.textColor, outputs.root, 'color');
        addColorListener(inputs.cardColor, outputs.boundaries, 'backgroundColor');
        addImageListener(inputs.cover, outputs.cover);
        outputs.titles.map(function(titleOutput) {
            addTextListener(inputs.title, titleOutput);
        });
        outputs.subtitles.map(function(subtitleOutput) {
            addTextListener(inputs.subtitle, subtitleOutput);
        });
        addTextListener(inputs.type, outputs.type);
        addTextListener(inputs.noteUpper, outputs.noteUpper);
        addTextListener(inputs.noteLower, outputs.noteLower);
        addSideListener(inputs.sideA, outputs.sideA);
        addSideListener(inputs.sideB, outputs.sideB);
        addTracksListener([inputs.sideA, inputs.sideB], outputs.tracks);
    }

    // populate inputs with field values or defaults
    function populate(inputs, fields) {
        // layout
        inputs.titleSize.value = fields.title_size || 12;
        inputs.trackSize.value = fields.track_size || 9;
        inputs.typeSize.value = fields.type_size || 10;
        inputs.noteSize.value = fields.note_size || 10;
        inputs.backSize.value = fields.back_size || 8;
        inputs.shortBack.checked = fields.short_back !== undefined ? fields.short_back : false;

        // content
        inputs.cardColor.value = fields.card_color || 'white';
        inputs.textColor.value = fields.text_color || 'black';
        inputs.title.value = fields.title || '';
        inputs.subtitle.value = fields.subtitle || '';
        inputs.type.value = fields.type || '';
        inputs.noteUpper.value = fields.note_upper || '';
        inputs.noteLower.value = fields.note_lower || '';
        inputs.sideA.value = formatList(fields.side_a || []);
        inputs.sideB.value = formatList(fields.side_b || []);
    }

    // trigger listener calls on all fields
    function update(inputs) {
        for (name in inputs) {
            var input = inputs[name];
            var event;
            if (input.type === 'checkbox' || input.type === 'file') {
                event = new Event('change');
            } else {
                event = new Event('input');
            }
            input.dispatchEvent(event);
        }
    }

    // copy an input value to an output innerHTML on input change
    function addTextListener(input, output) {
        input.addEventListener('input', function(event) {
            output.innerHTML = input.value;
        });
    }

    // toggle a class on an output element when an input is checked
    function addToggleListener(input, output, toggleClass) {
        input.addEventListener('change', function(event) {
            if (input.checked) {
                output.classList.add(toggleClass);
            } else {
                output.classList.remove(toggleClass);
            }
        });
    }

    // set the font size of an output element to the input value on change
    function addSizeListener(input, output) {
        input.addEventListener('input', function(event) {
            output.style.fontSize = input.value + 'pt';
        });
    }

    // set a property of the output element's style to a color on change
    function addColorListener(input, output, property) {
        input.addEventListener('input', function(event) {
            output.style[property] = input.value;
        });
    }

    // set the src property of an image when a file is selected
    function addImageListener(input, output) {
        input.addEventListener('change', function(event) {
            var file = input.files[0];
            if (file) {
                output.src = URL.createObjectURL(file);
            }
        });
    }

    // format an input list and set an output innerHTML on input change
    function addSideListener(input, output) {
        input.addEventListener('input', function(event) {
            output.innerHTML = formatListText(input.value);
        });
    }

    // combine and format input lists and set output innerHTML on any input change
    function addTracksListener(inputs, output) {
        inputs.forEach(function(input) {
            input.addEventListener('input', function(event) {
                var rawSides = inputs.map(function(input) { return input.value; });
                var rawTracks = formatList(rawSides);
                output.innerHTML = formatListText(rawTracks);
            });
        });
    }

    // convert a list to a newline delimited string
    function formatList(list) {
        return list.join('\n');
    }

    // convert a newline delimited string to a bullet delimited string
    function formatListText(listText) {
        return listText.trim().replace(/\s*\n\s*/g, '&nbsp;• ');
    }

    return {
        init: function(templateSelector, controlsSelector, fields) {
            var inputs = findInputs(document.querySelector(controlsSelector));
            var outputs = findOutputs(document.querySelector(templateSelector));

            addListeners(inputs, outputs);
            populate(inputs, fields);
            update(inputs);
        }
    }
})();
