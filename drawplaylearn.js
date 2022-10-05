function getKeySig() {
    let thisKeySig;
    if (document.getElementById("keySigSelect").value == "random") {
      let possibleKeySigs = ['A','Bb','B','C','C#','Db','D','Eb','E','F','F#','Gb','G','Ab'];
      thisKeySig = possibleKeySigs[Math.floor(Math.random() * 13)];
    } else {
      thisKeySig = document.getElementById("keySigSelect").value;
    }
    return thisKeySig
  }

  function getClef() {
    let possibleClefs = ['treble', 'bass'];
    thisClef = possibleClefs[Math.floor(Math.random() * 2)];
    return thisClef
  }

  function getAvailableNotes(keySigValue, scaleType) {
    if (scaleType == "major") {
      switch(keySigValue) {
        case "A":
          availableNotes = ["A", "B", "C#", "D", "E", "F#", "G#", "A"];
          break;
        case "Bb":
          availableNotes = ["Bb", "C", "D", "Eb", "F", "G", "A", "Bb"];
          break;
        case "B":
          availableNotes = ["B", "C#", "D#", "E", "F#", "G#", "A#", "B"];
          break;
        case "C":
          availableNotes = ["C", "D", "E", "F", "G", "A", "B", "C"];
          break;
        case "C#":
          availableNotes = ["C#", "D#", "E#", "F#", "G#", "A#", "B#"];
          break;
        case "Db":
          availableNotes = ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C", "Db"];
          break;
        case "D":
          availableNotes = ["D", "E", "F#", "G", "A", "B", "C#", "D"];
          break;
        case "Eb":
          availableNotes = ["D", "E", "F#", "G", "A", "B", "C#", "D"];
          break;
        case "E":
          availableNotes = ["E", "F#", "G#", "A", "B", "C#", "D#", "E"];
          break;
        case "F":
          availableNotes = ["F", "G", "A", "Bb", "C", "D", "E", "F"];
          break;
        case "F#":
          availableNotes = ["F#", "G#", "A#", "B", "C#", "D#", "F", "F#"];
          break;
        case "Gb":
          availableNotes = ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"];
          break;
        case "G":
          availableNotes = ["G", "A", "B", "C", "D", "E", "F#", "G"];
          break;
        case "Ab":
          availableNotes = ["Ab", "Bb", "C", "Db", "Eb", "F", "G", "Ab"];
          break;
      }
    }
    return availableNotes
  }

  function getNoteInfo() {
    // Return the note value and the octave suited for each format.
    // For the keyboard, middle C is denoted "KEY_C,1", but 
    // for VexFlow, middle C is denoted "C/4".
    let keySigValue = getKeySig();
    let possibleNotes = getAvailableNotes(keySigValue, "major");
    let noteValue = possibleNotes[Math.floor(Math.random() * 7)];

    let keyboardOctave = Math.floor(Math.random() * 3);
    let vexFlowOctave = keyboardOctave+3;

    let clefValue = getClef();
    if (clefValue=='bass'){
      keyboardOctave--;
      vexFlowOctave--;
    }

    let keyboardNoteValue = "KEY_" + noteValue + "," + keyboardOctave;
    let vexFlowNoteValue = noteValue + "/" + vexFlowOctave;
    return [keyboardNoteValue, vexFlowNoteValue, keyboardOctave, vexFlowOctave, noteValue, clefValue, keySigValue]
  };

  function drawNewNote() {
    document.querySelector("#output").replaceChildren();
    noteArray = getNoteInfo();
    let myClef = noteArray[5];
    let myKeySig = noteArray[6];
    let vexFlowNoteValue = noteArray[1];
    // https://github.com/0xfe/vexflow/wiki/Tutorial
    const { Renderer, Stave, StaveNote, Voice, Formatter } = Vex.Flow;
    Vex.Flow.setMusicFont('Bravura');

    // Create an SVG renderer and attach it to the DIV element with id="output" and
    // configure the rendering context. Then create stave at position 60, 40 width 200.
    const div = document.getElementById('output');
    const renderer = new Renderer(div, Renderer.Backends.SVG);
    renderer.resize(300, 200);
    const context = renderer.getContext();
    const stave = new Stave(60, 40, 200);
    stave.addClef(myClef).addKeySignature(myKeySig)
    const notes = [
      new StaveNote({ clef: myClef, keys: [vexFlowNoteValue], duration: "q" }),
      ];
    const voice = new Voice({ num_beats: 1, beat_value: 4 });
    voice.addTickables(notes);
    // Format and justify the notes to 400 pixels. Then
    // render the stave, then render the voice.
    new Formatter().joinVoices([voice]).format([voice], 200);
    stave.setContext(context).draw();
    voice.draw(context, stave);

    return noteArray;
  };