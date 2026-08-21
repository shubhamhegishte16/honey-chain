// ttsVoice.util.js - Centralized TTS voice utility for WoolConnect Training Module
// Used by: VoiceLearningPlayer (Read Guide) and ResourceDetails (Step-by-Step)
// Includes Google Translate TTS audio fallback for languages without native browser voice

export const LANG_TO_VOICE_CODE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

// Map BCP-47 voice code to the short language code Google Translate expects
const VOICE_CODE_TO_GTTS = { "en-IN": "en", "hi-IN": "hi", "mr-IN": "mr" };

export function getVoiceCode(appLang) {
  return LANG_TO_VOICE_CODE[appLang] ?? "en-IN";
}

export function findVoice(voices, voiceCode) {
  if (!voices || voices.length === 0) return null;
  const prefix = voiceCode.split("-")[0];
  return voices.find(v => v.lang === voiceCode) || voices.find(v => v.lang.startsWith(prefix)) || null;
}

export function isVoiceAvailable(voices, voiceCode) {
  if (voiceCode.startsWith("en")) return true;
  // With the gTTS fallback every language we list is always "available"
  return true;
}

export function loadVoices() {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) { resolve([]); return; }
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    if (voices.length > 0) { resolve(voices); return; }
    const onChanged = () => { synth.onvoiceschanged = null; resolve(synth.getVoices()); };
    synth.onvoiceschanged = onChanged;
    setTimeout(() => { synth.onvoiceschanged = null; resolve(synth.getVoices()); }, 3000);
  });
}

// ─── Google Translate TTS fallback ──────────────────────────────────────────
// Google Translate's public TTS endpoint accepts up to ~200 chars per request.
// We split long text into chunks and play them sequentially.

let _gttsCancelFlag = false;
let _gttsCurrentAudio = null;

function splitTextForGTTS(text, maxLen = 180) {
  const chunks = [];
  // Split on sentence-ending punctuation followed by space, or pipe-delimited full-stops
  const sentences = text.replace(/([।\.\?\!])\s+/g, "$1|||").split("|||");
  let current = "";
  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + " " + trimmed).length > maxLen && current) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current = current ? current + " " + trimmed : trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  // Safety: if any chunk is still too long, hard-split by space groups
  const result = [];
  for (const chunk of chunks) {
    if (chunk.length <= maxLen) { result.push(chunk); continue; }
    const words = chunk.split(/\s+/);
    let part = "";
    for (const w of words) {
      if ((part + " " + w).length > maxLen && part) {
        result.push(part.trim());
        part = w;
      } else {
        part = part ? part + " " + w : w;
      }
    }
    if (part.trim()) result.push(part.trim());
  }
  return result.length > 0 ? result : [text.substring(0, maxLen)];
}

function buildGTTSUrl(text, langCode) {
  const tl = VOICE_CODE_TO_GTTS[langCode] || langCode.split("-")[0];
  return `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encodeURIComponent(text)}`;
}

async function playGTTSChunks(chunks, langCode, { onEnd, onError } = {}) {
  _gttsCancelFlag = false;
  for (let i = 0; i < chunks.length; i++) {
    if (_gttsCancelFlag) break;
    const url = buildGTTSUrl(chunks[i], langCode);
    try {
      await new Promise((resolve, reject) => {
        const audio = new Audio(url);
        _gttsCurrentAudio = audio;
        audio.onended = () => { _gttsCurrentAudio = null; resolve(); };
        audio.onerror = (e) => { _gttsCurrentAudio = null; reject(e); };
        audio.play().catch(reject);
      });
    } catch (e) {
      console.warn("gTTS chunk playback error:", e);
      if (onError) onError(e);
      return;
    }
  }
  if (!_gttsCancelFlag && onEnd) onEnd();
}

export function cancelGTTS() {
  _gttsCancelFlag = true;
  if (_gttsCurrentAudio) {
    _gttsCurrentAudio.pause();
    _gttsCurrentAudio.currentTime = 0;
    _gttsCurrentAudio = null;
  }
}

export function pauseGTTS() {
  if (_gttsCurrentAudio && !_gttsCurrentAudio.paused) {
    _gttsCurrentAudio.pause();
  }
}

export function resumeGTTS() {
  if (_gttsCurrentAudio && _gttsCurrentAudio.paused) {
    _gttsCurrentAudio.play();
  }
}

export function isGTTSPlaying() {
  return _gttsCurrentAudio !== null && !_gttsCurrentAudio.paused;
}

// ─── Main speak function with automatic fallback ────────────────────────────

export async function speakWithLanguage(text, appLang, options = {}) {
  const { rate = 0.9, onEnd, onError, onVoiceUnavailable } = options;
  if (typeof window === "undefined") return;

  // Always cancel any previous gTTS playback
  cancelGTTS();

  const voiceCode = getVoiceCode(appLang);

  // Try native SpeechSynthesis first
  if ("speechSynthesis" in window) {
    const synth = window.speechSynthesis;
    synth.cancel();
    const voices = await loadVoices();
    const voice = findVoice(voices, voiceCode);

    if (voice || voiceCode.startsWith("en")) {
      // Native voice available — use SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceCode;
      if (voice) utterance.voice = voice;
      utterance.rate = rate;
      if (onEnd) utterance.onend = onEnd;
      if (onError) utterance.onerror = onError;
      synth.speak(utterance);
      return;
    }
  }

  // Fallback: Google Translate TTS audio playback
  const chunks = splitTextForGTTS(text);
  playGTTSChunks(chunks, voiceCode, { onEnd, onError });
}

// ─── Convenience: speak via gTTS directly (used by VoiceLearningPlayer) ─────

export async function speakWithGTTS(text, voiceCode, options = {}) {
  cancelGTTS();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  const chunks = splitTextForGTTS(text);
  playGTTSChunks(chunks, voiceCode, options);
}
