const getSigningUrl = 'https://api.teraconnect.org/raw_voice_signing';
const wavSampleRate = 16000;
const numChannels   = 1;

onmessage = function(event) {
    const voice = event.data;
    const lessonID = voice.lessonID;
    const axios = require('axios');

    const params = { params: { lesson_id: lessonID } };
    axios.get(getSigningUrl, params)
        .then((response) => { return response.data; })
        .then((response) => {
            const fileID = response.file_id;
            voice.fileID = fileID;
            const putURL = response.signed_url;

            const audioLength      = voice.bufferLength;
            const recordSampleRate = voice.currentSampleRate;
            const audioBuffer      = createWAVFile(voice.buffers, audioLength, recordSampleRate);

            const instance = axios.create({
                transformRequest: [(data, header) => {
                    header.put['Content-Type'] = 'audio/wav';
                    return data;
                }],
            });

            return instance.put(putURL, audioBuffer);
        })
        .catch((error) => {
            console.error(error);
            voice.error = error;
        })
        .then(() => {
            self.postMessage(voice);
        });
}

function createWAVFile(buffers, bufferLength, recordSampleRate) {
    const mergedBuffers = mergeBuffers(buffers, recordSampleRate);
    const dataview      = encodeWAV(mergedBuffers);
    const audioBlob     = new Blob([dataview], { 'type': 'audio/wav' });
    return audioBlob;

    function mergeBuffers(buffers, recordSampleRate) {
        const resampledResult = [];
        let   resampledLength = 0;
        buffers.forEach((buffer) => {
            const resampledBuffer = downSampling(buffer, recordSampleRate);
            resampledResult.push(resampledBuffer);
            resampledLength += resampledBuffer.length;
        });

        const result = new Float32Array(resampledLength);
        let offset = 0;
        resampledResult.forEach((buffer) => {
            result.set(buffer, offset);
            offset += buffer.length;
        });

        return result;
    }

    function downSampling(buffer, recordSampleRate) {
        const compression = recordSampleRate / wavSampleRate;
        const resampledLength = parseInt(buffer.length / compression);
        const resampledBuffer = new Float32Array(resampledLength);

        let loopIndex = 0;
        while (loopIndex < resampledLength) {
            const bufferIndex = Math.round(loopIndex * compression);
            if (!buffer[bufferIndex]) { console.error('empty audio buffer!'); }
            resampledBuffer[loopIndex] = buffer[bufferIndex];
            loopIndex ++;
        }

        return resampledBuffer;
    }

    function encodeWAV(buffers) {
        const buffer = new ArrayBuffer(44 + buffers.length * 2);
        let view = new DataView(buffer);

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + buffers.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, wavSampleRate, true);
        view.setUint32(28, wavSampleRate * numChannels * 2, true);
        view.setUint16(32, numChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, buffers.length * 2, true);

        floatTo16BitPCM(view, 44, buffers);

        return view;
    }

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }
}