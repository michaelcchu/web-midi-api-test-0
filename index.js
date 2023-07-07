import SoundGenerator from './modules/SoundGenerator.js';

let midi = null; // global MIDIAccess object
function onMIDISuccess(midiAccess) {
  console.log("MIDI ready!");
  midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
  startLoggingMIDIInput(midi, 0);
}

function onMIDIFailure(msg) {
  console.error(`Failed to get MIDI access - ${msg}`);
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

function listInputsAndOutputs(midiAccess) {
    for (const entry of midiAccess.inputs) {
      const input = entry[1];
      console.log(
        `Input port [type:'${input.type}']` +
          ` id:'${input.id}'` +
          ` manufacturer:'${input.manufacturer}'` +
          ` name:'${input.name}'` +
          ` version:'${input.version}'`
      );
    }
  
    for (const entry of midiAccess.outputs) {
      const output = entry[1];
      console.log(
        `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
      );
    }
  }

  function onMIDIMessage(event) {
    let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
    for (const character of event.data) {
      str += `0x${character.toString(16)} `;
    }
    console.log(str);

    const message = event.data;
    const command = message[0];
    const pitch = message[1];
    const velocity = message[2];
    if (command < 144) { //0x80 
        SoundGenerator.stopPlaying([pitch]);
    } else if (command < 160) { //0x90
        if (velocity > 0) {
            SoundGenerator.startPlaying([pitch]);
        } else {
            SoundGenerator.stopPlaying([pitch]);
        }
    }

  }
  
  function startLoggingMIDIInput(midiAccess, indexOfPort) {
    midiAccess.inputs.forEach((entry) => {
      entry.onmidimessage = onMIDIMessage;
    });
  }

