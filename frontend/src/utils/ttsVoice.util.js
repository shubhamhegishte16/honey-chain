// ttsVoice.util.js - Centralized TTS voice utility for WoolConnect Training Module
// Used by: VoiceLearningPlayer (Read Guide) and ResourceDetails (Step-by-Step)

export const LANG_TO_VOICE_CODE = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

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
  return findVoice(voices, voiceCode) !== null;
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

export async function speakWithLanguage(text, appLang, options = {}) {
  const { rate = 0.9, onEnd, onError, onVoiceUnavailable } = options;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voiceCode = getVoiceCode(appLang);
  const voices = await loadVoices();
  const voice = findVoice(voices, voiceCode);
  if (!voiceCode.startsWith("en") && !voice) {
    if (onVoiceUnavailable) onVoiceUnavailable(voiceCode);
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voiceCode;
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  if (onEnd) utterance.onend = onEnd;
  if (onError) utterance.onerror = onError;
  synth.speak(utterance);
}
