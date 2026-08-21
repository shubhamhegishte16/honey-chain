import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, AlertCircle, Globe, Check } from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', nativeName: 'English', fallbackCode: 'en' },
  { code: 'hi-IN', nativeName: 'हिंदी', fallbackCode: 'hi' },
  { code: 'mr-IN', nativeName: 'मराठी', fallbackCode: 'mr' },
  { code: 'gu-IN', nativeName: 'ગુજરાતી', fallbackCode: 'gu' },
  { code: 'pa-IN', nativeName: 'ਪੰਜਾਬੀ', fallbackCode: 'pa' },
  { code: 'bn-IN', nativeName: 'বাংলা', fallbackCode: 'bn' },
  { code: 'kn-IN', nativeName: 'ಕನ್ನಡ', fallbackCode: 'kn' },
  { code: 'te-IN', nativeName: 'తెలుగు', fallbackCode: 'te' },
  { code: 'ta-IN', nativeName: 'தமிழ்', fallbackCode: 'ta' },
  { code: 'ml-IN', nativeName: 'മലയാളം', fallbackCode: 'ml' }
];

export default function VoiceLearningPlayer({ resource }) {
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [voiceAvailable, setVoiceAvailable] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);

  const synthRef = useRef(null);
  const utteranceRef = useRef(null);

  // Initialize SpeechSynthesis and load voices
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    } else {
      setSpeechSupported(false);
    }

    return () => {
      stopSpeech();
    };
  }, []);

  // Stop speech if resource ID changes or component unmounts
  useEffect(() => {
    stopSpeech();
  }, [resource?._id || resource?.id]);

  // Check voice availability when selected language or voices change
  useEffect(() => {
    if (!synthRef.current) return;
    
    const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];
    
    const matchingVoice = voices.find(v => 
      v.lang === targetLang.code || 
      v.lang.startsWith(targetLang.fallbackCode)
    );

    // If English, browser always has fallback. For regional languages check explicitly.
    if (matchingVoice || targetLang.fallbackCode === 'en') {
      setVoiceAvailable(true);
    } else {
      setVoiceAvailable(false);
    }
  }, [selectedLang, voices]);

  const constructTextToRead = () => {
    if (!resource) return '';
    let text = `${resource.title}. `;
    if (resource.summary) {
      text += `Summary: ${resource.summary}. `;
    }
    if (resource.content) {
      // Strip markdown hashes and extra formatting characters
      const cleanContent = resource.content
        .replace(/###|##|#|\*\*|\*/g, '')
        .replace(/\n+/g, '. ');
      text += `Content: ${cleanContent}. `;
    }
    if (resource.keyTakeaways && resource.keyTakeaways.length > 0) {
      text += `Key Takeaways: ${resource.keyTakeaways.join('. ')}.`;
    }
    return text;
  };

  const handlePlay = () => {
    if (!synthRef.current || !speechSupported) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Cancel any current speech
    synthRef.current.cancel();

    const text = constructTextToRead();
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

    // Find voice
    const matchedVoice = voices.find(v => 
      v.lang === targetLang.code || 
      v.lang.startsWith(targetLang.fallbackCode)
    );

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }
    utterance.lang = targetLang.code;
    utterance.rate = 0.95; // Slightly comfortable reading pace for farmers

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (synthRef.current && isPlaying && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!speechSupported) {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
        Text-to-speech is not supported on this browser.
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-green-950 text-white shadow-md border border-white/10 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-white/15 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-emerald-300 border border-white/15">
            <Volume2 size={18} />
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-tight">Listen to this Guide</h3>
            <p className="text-xs text-white/70">Browser regional voice learning reader</p>
          </div>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-emerald-300" />
          <select
            value={selectedLang}
            onChange={(e) => {
              stopSpeech();
              setSelectedLang(e.target.value);
            }}
            className="bg-white/15 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code} className="bg-surface text-textPrimary font-semibold">
                {lang.nativeName} ({lang.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice Warning Notice if unavailable */}
      {!voiceAvailable && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0 text-amber-300" />
          <span>Regional voice is not available on this device. Fallback audio will be used.</span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Play size={15} fill="currentColor" />
            <span>{isPaused ? 'Resume' : 'Play Audio'}</span>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-extrabold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Pause size={15} fill="currentColor" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={stopSpeech}
          disabled={!isPlaying && !isPaused}
          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2"
        >
          <Square size={14} fill="currentColor" />
          <span>Stop</span>
        </button>

        {(isPlaying || isPaused) && (
          <span className="text-xs text-emerald-300 font-semibold animate-pulse flex items-center gap-1.5 ml-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {isPaused ? 'Paused' : 'Reading aloud...'}
          </span>
        )}
      </div>
    </div>
  );
}
