// useSpeechRecognition.ts
import { useEffect, useRef, useState } from 'react';

export function useSpeechRecognition() {
    const [transcript, setTranscript] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                interimTranscript += event.results[i][0].transcript;
                isFinal = event.results[i].isFinal;
            }

            setTranscript(interimTranscript);

            if (isFinal) {
                stopListening(); // Auto-stop on final result
            }
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event);
            if (event.error === 'not-allowed') {
                alert('Microphone access is blocked. Please allow access in your browser and system settings.');
            } else if (event.error === 'audio-capture') {
                alert('No microphone found. Please connect a microphone and try again.');
            }
            setIsListening(false);
            setIsDone(true);
        };


        recognition.onend = () => {
            setIsListening(false);
            setIsDone(true);
        };
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript('');
            setIsDone(false);
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setIsDone(true);
        }
    };


    return {
        transcript,
        isDone,
        isListening,
        startListening,
        stopListening,
    };
}
