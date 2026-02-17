import { useState, useEffect, useRef } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  error: string | null;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    return () => {
      if (isSupported && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  const speak = (text: string) => {
    if (!isSupported) {
      setError('Text-to-speech is not supported in your browser');
      return;
    }

    setError(null);
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a Nepali voice
    const voices = window.speechSynthesis.getVoices();
    const nepaliVoice = voices.find(voice => 
      voice.lang.startsWith('ne') || voice.lang.includes('NP')
    );
    
    if (nepaliVoice) {
      utterance.voice = nepaliVoice;
    }
    
    utterance.lang = 'ne-NP';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setError('Text-to-speech error occurred');
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  };

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    error,
  };
}
