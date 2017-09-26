/*
 * Interactive j-card template logic.
 */
var jcard = (function() {
    // find input elements in the controls module
    function findInputs(controls) {
        var prefix = '#' + controls.id + '-';
        return {
            print2:     document.querySelector(prefix + 'print-2'),

            cardColor:  document.querySelector(prefix + 'card-color'),
            textColor:  document.querySelector(prefix + 'text-color'),
            titleSize:  document.querySelector(prefix + 'title-size'),
            typeSize:   document.querySelector(prefix + 'type-size'),
            noteSize:   document.querySelector(prefix + 'note-size'),
            trackSize:  document.querySelector(prefix + 'track-size'),
            sideSize:   document.querySelector(prefix + 'side-size'),
            shortBack:  document.querySelector(prefix + 'short-back'),

            cover:      document.querySelector(prefix + 'cover'),
            title:      document.querySelector(prefix + 'title'),
            subtitle:   document.querySelector(prefix + 'subtitle'),
            type:       document.querySelector(prefix + 'type'),
            noteUpper:  document.querySelector(prefix + 'note-upper'),
            noteLower:  document.querySelector(prefix + 'note-lower'),
            sideA:      document.querySelector(prefix + 'side-a'),
            sideB:      document.querySelector(prefix + 'side-b')
        }
    }

    // find output elements in the template module
    function findOutputs(template) {
        var prefix = '.template-';
        return {
            root:           template,
            boundaries:     template.querySelector(prefix + 'boundaries'),
            cover:          template.querySelector(prefix + 'cover'),
            titleGroups:    [
                template.querySelector(prefix + 'front-title-group'),
                template.querySelector(prefix + 'spine-title-group')],
            titles:         [
                template.querySelector(prefix + 'front-title'),
                template.querySelector(prefix + 'spine-title')],    
            subtitles:      [
                template.querySelector(prefix + 'front-subtitle'),
                template.querySelector(prefix + 'spine-subtitle')],
            tracks:         template.querySelector(prefix + 'tracks'),
            type:           template.querySelector(prefix + 'type'),
            noteGroup:      template.querySelector(prefix + 'note-group'),
            noteUpper:      template.querySelector(prefix + 'note-upper'),
            noteLower:      template.querySelector(prefix + 'note-lower'),
            sideA:          template.querySelector(prefix + 'side-a'),
            sideB:          template.querySelector(prefix + 'side-b')
        }
    }

    // add listeners to inputs that update j-card outputs
    function addJCardListeners(inputs, outputs) {
        // layout
        addColorListener(inputs.textColor, outputs.root, 'color');
        addColorListener(inputs.cardColor, outputs.boundaries, 'backgroundColor');
        outputs.titleGroups.forEach(function(groupOutput) {
            addSizeListener(inputs.titleSize, groupOutput);
        });
        addSizeListener(inputs.typeSize, outputs.type);
        addSizeListener(inputs.noteSize, outputs.noteGroup);
        addSizeListener(inputs.trackSize, outputs.tracks);
        addSizeListener(inputs.sideSize, outputs.sideA);
        addSizeListener(inputs.sideSize, outputs.sideB);
        addToggleListener(inputs.shortBack, outputs.root, 'short-back');

        // content
        addImageListener(inputs.cover, outputs.cover);
        outputs.titles.forEach(function(titleOutput) {
            addTextListener(inputs.title, titleOutput);
        });
        outputs.subtitles.forEach(function(subtitleOutput) {
            addTextListener(inputs.subtitle, subtitleOutput);
        });
        addTextListener(inputs.type, outputs.type);
        addTextListener(inputs.noteUpper, outputs.noteUpper);
        addTextListener(inputs.noteLower, outputs.noteLower);
        addSideListener(inputs.sideA, outputs.sideA);
        addSideListener(inputs.sideB, outputs.sideB);
        addTracksListener([inputs.sideA, inputs.sideB], outputs.tracks);
    }

    // add listeners to inputs that toggle option classes
    function addOptionListeners(inputs, root) {
        addToggleListener(inputs.print2, root, 'print-2');
    }

    // populate inputs with field values or defaults
    function populate(inputs, fields) {
        // layout
        inputs.cardColor.value = fields.card_color || 'white';
        inputs.textColor.value = fields.text_color || 'black';
        inputs.titleSize.value = fields.title_size || 12;
        inputs.typeSize.value = fields.type_size || 10;
        inputs.noteSize.value = fields.note_size || 10;
        inputs.trackSize.value = fields.track_size || 9;
        inputs.sideSize.value = fields.side_size || 8;
        inputs.shortBack.checked = fields.short_back !== undefined ? fields.short_back : false;

        // content
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
            var event = document.createEvent('Event');
            if (input.type === 'checkbox' || input.type === 'file') {
                event.initEvent('change', true, true);
            } else {
                event.initEvent('input', true, true);
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
        init: function(selector, fields) {
            var root = document.querySelector(selector);

            // find controls
            var controls = root.querySelector('.controls');
            var inputs = findInputs(controls);

            // find preview template
            var previewTemplate = root.querySelector('.jcard-preview .template');
            var previewOutputs = findOutputs(previewTemplate);

            // create duplicate template to be shown only when printed
            var dupeContainer = root.querySelector('.jcard-duplicate');
            var dupeTemplate = previewTemplate.cloneNode(true);
            var dupeOutputs = findOutputs(dupeTemplate);
            dupeContainer.appendChild(dupeTemplate);

            // register listeners
            addOptionListeners(inputs, root);
            addJCardListeners(inputs, previewOutputs);
            addJCardListeners(inputs, dupeOutputs);

            // initialize inputs and templates
            populate(inputs, fields);
            update(inputs);
        }
    }
})();
