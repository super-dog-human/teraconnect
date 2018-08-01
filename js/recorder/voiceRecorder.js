const lessonID     = location.search.split('?')[1];
let recorder       = null;
let isReady        = false;
let unityGameInstance;

exports.setGameInstance = function(gameInstance) {
    unityGameInstance = gameInstance;
}
exports.start = startVoiceRecording;
exports.stop  = stopVoiceRecording;

function startVoiceRecording() {
    if (isReady) {
        recorder.port.postMessage({ isRecording: true });
    } else {
        setTimeout(startVoiceRecording, 100);
    }
}

function stopVoiceRecording() {
    if (isReady) {
        recorder.port.postMessage({ isRecording: false });
    } else {
        setTimeout(stopVoiceRecording, 100);
    }
}

const userMediaConstraints = {
    audio: true,
    video: false
};

navigator.mediaDevices
    .getUserMedia(userMediaConstraints)
    .then((stream) => {
        let context = new AudioContext();
        context.audioWorklet.addModule('voiceRecorderProcessor.js').then(() => {
            let micInput = context.createMediaStreamSource(stream);
            recorder = new AudioWorkletNode(context, 'recorder');
            micInput.connect(recorder);
            recorder.connect(context.destination);

            recorder.port.onmessage = (event) => {
                const uploader = new Worker('voiceUploader.js');
                const voice = {
                    timeSec:     event.data.speechedAt,
                    durationSec: event.data.durationSec,
                };
                unityGameInstance.SendMessage("ScriptLoader", "RecordSpeech", JSON.stringify(voice));

                uploader.postMessage({
                    lessonID:          lessonID,
                    time:              event.data.speechedAt,
                    buffers:           event.data.buffers,
                    bufferLength:      event.data.bufferLength,
                    currentSampleRate: context.sampleRate,
                });

                uploader.onmessage = function(event) {
                    voice.fileID = event.data.fileID;
                    unityGameInstance.SendMessage("ScriptLoader", "RecordSpeech", JSON.stringify(voice));

                    uploader.terminate();
                };
            }

            isReady = true;
        })
        .catch((error) => {
            console.error("err: " + error);
        });
    })
    .catch((error) => {
        console.error("err: " + error);
    });
;