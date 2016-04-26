/**
 * Created by gaby on 22/04/16.
 */


var octaves = {
    C1 : 0, //,,,
    C2 : 1, //,,
    C3 : 2, //,
    C4 : 3, //'
    C5 : 4, //''
    C6 : 5, //'''
    C7 : 6  //''''
}


var MAX_OCTAVES =  octaves.C7;
var KEYS_PER_OCTAVE = 17;
var _displayedOctaves = 3;
var _startOctave = 3;

var verovioToolkit = new verovio.toolkit();

function numberOfDisplayedOctaves() {
    return _displayedOctaves
}

function paeCodeForKeyAtIndex(keyIndex, baseOctave, duration) {
    var octaveOffset = Math.floor(keyIndex / KEYS_PER_OCTAVE)
    var octaveIndex = baseOctave + octaveOffset
    var octaveSigns = [",,,", ",,", ",", "'", "''", "'''", "''''"]
    var octaveSign = octaveSigns[octaveIndex]
    console.log("octaveInd = " + baseOctave + " + " + octaveOffset)
    var notes = [duration + "C",
        "x" + duration + "C",
        "b" + duration + "D",
        duration + "D",
        "x" + duration + "D",
        "b" + duration + "E",
        duration + "E",

        duration + "F",
        "x" + duration + "F",
        "b" + duration + "G",
        duration + "G",
        "x" + duration + "G",
        "b" + duration + "A",
        duration + "A",
        "x" + duration + "A",
        "b" + duration + "B",
        duration + "B"]
    var note = notes[keyIndex % KEYS_PER_OCTAVE]
    note = octaveSign + note
    return note
}

function svgNotesForPlaineEasieCode(paeCode) {
    var data = "@clef:" + "G-2" + "\n"
    data += "@keysig:" + " " + "\n"
    data += "@timesig:" + " " + "\n"
    console.log("notes " + paeCode)
    data += "@data:" + paeCode

    var windowWidth = $(window).width()
    console.log("Window Width: " + windowWidth)
    var scale = 50
    if (windowWidth < 1000) {
        scale = 30
    } else if (windowWidth < 500) {
        scale = 15
    }

    options = JSON.stringify({
        inputFormat: 'pae',
        pageHeight: 500,
        pageWidth: windowWidth * (1 / scale),
        ignoreLayout: 1,
        border: 0,
        scale: scale,
        adjustPageHeight: 1
    })

    var notesSVG = verovioToolkit.renderData(data, options);
    return notesSVG
}


function htmlForKeyboardWithOctaves(numberOfOctaves, startOctave, showLabels, withShiftButtons) {
    if (typeof(numberOfOctaves)==='undefined') numberOfOctaves = 3
    if (typeof(startOctave)==='undefined') startOctave = octaves.C4
    if (typeof(showLabels)==='undefined') showLabels = true
    if (typeof(withShiftButtons)==='undefined') withShiftButtons = true

    //back keys are seperated to fields sharp and flat; this enables specific input
    _displayedOctaves = limitToRange(numberOfOctaves, 1, MAX_OCTAVES)
    _startOctave = limitToRange(startOctave, octaves.C1, octaves.C6)

    var currentOctave = _startOctave
    var html = '\
        <ul class="DA-PianoKeyboard">\n'
    for (var i = 0; i < _displayedOctaves; i++) {
        if (showLabels) {
            html += '\
            <li class="whiteKey"><p>C' + (currentOctave + 1) + '</p></li>\n\
            <li class="blackKeySharp"><p>♯</p></li>\n\
            <li class="blackKeyFlat"><p>♭</p></li>\n'
        } else {
            html += '\
            <li class="whiteKey"></li>\n\
            <li class="blackKeySharp"></li>\n\
            <li class="blackKeyFlat"></li>\n'
        }

        html += '\
            <li class="whiteKey"></li>\n\
            <li class="blackKeySharp"></li>\n\
            <li class="blackKeyFlat"></li>\n\
            <li class="whiteKey"></li>\n\
            <li class="whiteKey"></li>\n\
            <li class="blackKeySharp"></li>\n\
            <li class="blackKeyFlat"></li>\n\
            <li class="whiteKey"></li>\n\
            <li class="blackKeySharp"></li>\n\
            <li class="blackKeyFlat"></li>\n\
            <li class="whiteKey"></li>\n\
            <li class="blackKeySharp"></li>\n\
            <li class="blackKeyFlat"></li>\n\
            <li class="whiteKey"></li>\n'
        currentOctave++
    }
    html += '\
        </ul>\n'

    if (withShiftButtons) {
        html = '\
        <div class="DA-Keyboardcontainer">\n\
            <button type="button" id="lowerOctave" onclick="lowerOctave()">˂</button>\n'
                + html + '\n\
            <button type="button" id="raiseOctave" onclick="raiseOctave()">˃</button>\n\
        </div>\n'
    }
    return html
}



function bindKeysToFunction(callback) {

    $(".DA-PianoKeyboard li").click(function () {
        var indexOfKey = $(this).index()
        var paeNote = paeCodeForKeyAtIndex(indexOfKey, _startOctave, 4)
        callback(this, paeNote)
    })
    
}

function raiseOctave() {
    _startOctave = Math.min(_startOctave + 1, MAX_OCTAVES - numberOfDisplayedOctaves() + 1)
    updateOctaveLabels()
    updateShiftOctaveButtonsEnabled()
}

function lowerOctave() {
    _startOctave = Math.max(_startOctave - 1, 0)
    updateOctaveLabels()
    updateShiftOctaveButtonsEnabled()
}

function updateShiftOctaveButtonsEnabled() {
    var isMax = _startOctave == MAX_OCTAVES - _displayedOctaves + 1
    var isMin = _startOctave == 0
    $("#raiseOctave").prop('disabled', isMax)
    $("#lowerOctave").prop('disabled', isMin)
}

function updateOctaveLabels(){
    $('.whiteKey>p').each(function(i, domLabel) {
        var label = $(domLabel)
        var currentOctave = _startOctave + 1 + i
        label.text("C" + currentOctave)
    })
}

function limitToRange(number, min, max) {
    return Math.min(Math.max(min, number), max)
}
