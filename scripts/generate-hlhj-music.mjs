// Original pentatonic sketches, rendered with synthesized strings, breath and bells.
// Asset generation only; no external recordings, samples or melodies are used.
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const folder = resolve(import.meta.dirname, "../apps/core/extension/红楼幻境/theme");
await mkdir(folder, { recursive: true });
const rate = 22050;
function render({ file, bpm, melody, chords, seed }) {
    const beat = 60 / bpm, seconds = 64 * beat, length = Math.round(seconds * rate);
    const left = new Float32Array(length), right = new Float32Array(length);
    function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
    function note(midi, start, beats, voice, gain, pan = 0) {
        const frequency = 440 * 2 ** ((midi - 69) / 12), duration = beats * beat;
        const frames = Math.ceil((duration + 2) * rate), offset = Math.round(start * beat * rate);
        const l = Math.sqrt((1 - pan) / 2), r = Math.sqrt((1 + pan) / 2);
        for (let i = 0; i < frames; i++) {
            const t = i / rate, release = Math.exp(-Math.max(0, t - duration) * 3.2);
            const phase = 2 * Math.PI * frequency * t;
            let sample;
            if (voice === "string") {
                const attack = 1 - Math.exp(-t * 170);
                sample = attack * (Math.sin(phase) * Math.exp(-t * 1.8) +
                    .32 * Math.sin(phase * 2.002) * Math.exp(-t * 3.4) +
                    .16 * Math.sin(phase * 3.007) * Math.exp(-t * 5.2));
            } else if (voice === "flute") {
                const envelope = Math.min(1, t / .24) * release;
                const vibrato = .016 * Math.sin(2 * Math.PI * 4.6 * t) * Math.min(t, 1);
                sample = envelope * (Math.sin(phase + vibrato) + .13 * Math.sin(phase * 2) + .025 * (random() - .5));
            } else {
                sample = Math.min(1, t / .8) * release *
                    (Math.sin(phase) + .18 * Math.sin(phase * 1.002) + .08 * Math.sin(phase * 2));
            }
            sample *= gain * (voice === "string" ? release : 1);
            const index = (offset + i) % length;
            left[index] += sample * l; right[index] += sample * r;
        }
    }
    for (let bar = 0; bar < 16; bar++) {
        const chord = chords[bar % chords.length], start = bar * 4;
        note(chord[0] - 12, start, 3.3, "pad", .045, -.2);
        for (let n = 0; n < 4; n++) note(chord[n % chord.length], start + n, .8, "string", .13, n % 2 ? .32 : -.32);
        const phrase = melody[bar % melody.length];
        phrase.forEach(([pitch, time, duration], i) => note(pitch, start + time, duration, bar % 4 === 3 ? "string" : "flute", bar % 4 === 3 ? .15 : .075, i % 2 ? .14 : -.1));
    }
    // Circular taps retain the previous phrase's tail at the loop boundary.
    const wetL = new Float32Array(length), wetR = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        wetL[i] = left[i]; wetR[i] = right[i];
        for (const [delay, gain] of [[.19, .18], [.37, .12], [.61, .08]]) {
            const j = (i - Math.round(delay * rate) + length) % length;
            wetL[i] += right[j] * gain; wetR[i] += left[j] * gain;
        }
    }
    const bytes = Buffer.alloc(44 + length * 4);
    bytes.write("RIFF", 0); bytes.writeUInt32LE(bytes.length - 8, 4); bytes.write("WAVEfmt ", 8);
    bytes.writeUInt32LE(16, 16); bytes.writeUInt16LE(1, 20); bytes.writeUInt16LE(2, 22);
    bytes.writeUInt32LE(rate, 24); bytes.writeUInt32LE(rate * 4, 28);
    bytes.writeUInt16LE(4, 32); bytes.writeUInt16LE(16, 34); bytes.write("data", 36);
    bytes.writeUInt32LE(length * 4, 40);
    for (let i = 0; i < length; i++) {
        bytes.writeInt16LE(Math.round(Math.tanh(wetL[i] * 1.8) * 26000), 44 + i * 4);
        bytes.writeInt16LE(Math.round(Math.tanh(wetR[i] * 1.8) * 26000), 46 + i * 4);
    }
    return writeFile(resolve(folder, file), bytes);
}
await render({
    file: "zhuying.wav", bpm: 80, seed: 20260913,
    chords: [[50, 57, 62], [55, 62, 67], [57, 64, 69], [50, 57, 62]],
    melody: [
        [[74, 0, 1.3], [76, 2, .6], [81, 3, .65]],
        [[79, .5, 1], [76, 2, 1.4]],
        [[74, 0, .8], [69, 1.5, .8], [72, 3, .65]],
        [[74, 0, 2.5]],
        [[81, 0, 1], [79, 1.5, .65], [76, 3, .65]],
        [[74, .5, 1.3], [72, 2.5, .9]],
        [[69, 0, 1], [72, 1.5, .8], [76, 3, .65]],
        [[74, 0, 2.8]],
    ],
});
await render({
    file: "guimeng.wav", bpm: 64, seed: 20260914,
    chords: [[45, 52, 57], [48, 55, 60], [43, 50, 55], [45, 52, 57]],
    melody: [
        [[76, .5, 1.5], [72, 2.5, .9]],
        [[69, 0, 2.2]],
        [[67, .5, .8], [69, 2, 1.2]],
        [[64, 0, 2.8]],
        [[72, 0, 1.2], [76, 2, 1.3]],
        [[79, .5, 1.2], [76, 2.5, 1]],
        [[72, 0, 1], [69, 1.5, .8], [67, 3, .7]],
        [[69, 0, 2.7]],
    ],
});
