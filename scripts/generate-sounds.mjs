#!/usr/bin/env node

/**
 * Generate scanner sound effects
 * Creates simple sine wave beep sounds for success and error feedback
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOUNDS_DIR = path.join(__dirname, '../apps/admin/public/sounds');

// WAV file parameters
const SAMPLE_RATE = 44100;
const BITS_PER_SAMPLE = 16;
const NUM_CHANNELS = 1;

/**
 * Generate a sine wave tone
 */
function generateTone(frequency, duration, volume = 0.5) {
  const numSamples = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(numSamples);
  
  for (let i = 0; i < numSamples; i++) {
    // Fade in/out to avoid clicks
    let envelope = 1;
    const fadeLength = Math.floor(numSamples * 0.1);
    if (i < fadeLength) {
      envelope = i / fadeLength;
    } else if (i > numSamples - fadeLength) {
      envelope = (numSamples - i) / fadeLength;
    }
    
    const sample = Math.sin(2 * Math.PI * frequency * i / SAMPLE_RATE) * volume * envelope;
    samples[i] = Math.floor(sample * 32767);
  }
  
  return samples;
}

/**
 * Create WAV file buffer from samples
 */
function createWavBuffer(samples) {
  const dataSize = samples.length * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Chunk size
  buffer.writeUInt16LE(1, 20);  // Audio format (1 = PCM)
  buffer.writeUInt16LE(NUM_CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * NUM_CHANNELS * BITS_PER_SAMPLE / 8, 28); // Byte rate
  buffer.writeUInt16LE(NUM_CHANNELS * BITS_PER_SAMPLE / 8, 32); // Block align
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  
  // data chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  // Write samples
  for (let i = 0; i < samples.length; i++) {
    buffer.writeInt16LE(samples[i], 44 + i * 2);
  }
  
  return buffer;
}

/**
 * Concatenate multiple sample arrays
 */
function concatenateSamples(...sampleArrays) {
  const totalLength = sampleArrays.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Int16Array(totalLength);
  let offset = 0;
  for (const arr of sampleArrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

async function generateSounds() {
  console.log('Generating scanner sound effects...');
  
  await fs.mkdir(SOUNDS_DIR, { recursive: true });
  
  // Success sound: Two ascending tones (C5 -> E5)
  const successTone1 = generateTone(523.25, 0.15, 0.4); // C5
  const successGap = new Int16Array(Math.floor(SAMPLE_RATE * 0.05));
  const successTone2 = generateTone(659.25, 0.2, 0.4);  // E5
  const successSamples = concatenateSamples(successTone1, successGap, successTone2);
  const successBuffer = createWavBuffer(successSamples);
  
  await fs.writeFile(path.join(SOUNDS_DIR, 'success.wav'), successBuffer);
  console.log('  Created: success.wav');
  
  // Error sound: Two descending tones (E4 -> C4)
  const errorTone1 = generateTone(329.63, 0.15, 0.4); // E4
  const errorGap = new Int16Array(Math.floor(SAMPLE_RATE * 0.05));
  const errorTone2 = generateTone(261.63, 0.25, 0.4); // C4
  const errorSamples = concatenateSamples(errorTone1, errorGap, errorTone2);
  const errorBuffer = createWavBuffer(errorSamples);
  
  await fs.writeFile(path.join(SOUNDS_DIR, 'error.wav'), errorBuffer);
  console.log('  Created: error.wav');
  
  console.log('\nDone! Sound effects generated successfully.');
}

generateSounds().catch(console.error);
