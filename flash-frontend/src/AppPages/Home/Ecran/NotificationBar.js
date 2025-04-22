import React, { useEffect, useRef, useState } from "react";

function AudioNotification({ nextPatient, voiceGender = "female" }) {
  // Reference to the speech synthesis object
  const synth = useRef(null);
  const voiceRef = useRef(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Initialize speech synthesis immediately when component mounts
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const availableVoices = synth.current.getVoices();

        if (availableVoices.length > 0) {
          // First try to find a Google French voice with the specified gender
          let voiceToUse = availableVoices.find(
            (v) =>
              v.name.toLowerCase().includes("google") && 
              v.lang.includes("fr") &&
              ((voiceGender === "male" && v.name.toLowerCase().includes("male")) ||
               (voiceGender === "female" && v.name.toLowerCase().includes("female")))
          );

          // If no specific gender Google French voice is found, try any Google French voice
          if (!voiceToUse) {
            voiceToUse = availableVoices.find(
              (v) =>
                v.name.toLowerCase().includes("google") && v.lang.includes("fr")
            );
          }

          // If still no voice, try any French voice with the specified gender
          if (!voiceToUse) {
            voiceToUse = availableVoices.find(
              (v) => 
                v.lang.includes("fr") &&
                ((voiceGender === "male" && v.name.toLowerCase().includes("male")) ||
                 (voiceGender === "female" && v.name.toLowerCase().includes("female")))
            );
          }

          // If no gender-specific French voice, select any French voice
          if (!voiceToUse) {
            voiceToUse = availableVoices.find((v) => v.lang.includes("fr"));
          }

          // If still no French voice, take the default voice
          if (!voiceToUse && availableVoices.length > 0) {
            voiceToUse = availableVoices[0];
          }

          if (voiceToUse) {
            voiceRef.current = voiceToUse;
            console.log("Selected voice:", voiceToUse.name);
            setVoicesLoaded(true); // Mark voices as loaded
          }
        }
      };

      // Firefox and some browsers may already have voices loaded
      loadVoices();

      // Chrome and other browsers need to wait for the voiceschanged event
      synth.current.onvoiceschanged = () => {
        loadVoices();
        // Ensure voices are marked as loaded
        setVoicesLoaded(true);
      };

      // Initialize voices even if onvoiceschanged is not triggered
      if (synth.current.getVoices().length > 0) {
        setVoicesLoaded(true);
      }
    }

    return () => {
      if (synth.current) {
        synth.current.onvoiceschanged = null;
        synth.current.cancel(); // Stop speech synthesis if component is unmounted
      }
    };
  }, [voiceGender]); // Add voiceGender as a dependency so voice changes when gender changes

  // Function to read ticket information
  const speakTicketInfo = () => {
    if (!synth.current) {
      console.error("Speech synthesis is not available");
      return;
    }

    // Stop any ongoing speech
    synth.current.cancel();

    try {
      // Create text from ticket information
      const textToSpeak = ` Le ticket numéro ${nextPatient.STR_TICNAME}. pour une opération de ${nextPatient.LG_LSTOPEID}. est appelé a la ${nextPatient.LG_PAPID}`;

      // Create a new SpeechSynthesisUtterance object
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      // Set language
      utterance.lang = "fr-FR";

      // Slow down speech rate
      utterance.rate = 0.9;

      // Set voice if one is selected
      if (voiceRef.current) {
        utterance.voice = voiceRef.current;
      }

      // Events for debugging
      utterance.onstart = () => console.log("Voice announcement started");
      utterance.onend = () => console.log("Voice announcement ended");
      utterance.onerror = (e) => console.error("Voice announcement error:", e);

      // Speak the text
      synth.current.speak(utterance);
    } catch (error) {
      console.error("Error during voice reading:", error);
    }
  };

  // Perform voice reading as soon as component is mounted and voices are loaded
  useEffect(() => {
    if (nextPatient && voicesLoaded) {
      // First reading immediately when voices are loaded
      speakTicketInfo();

      // Second reading after 10 seconds
      const timer = setTimeout(() => {
        speakTicketInfo();
      }, 10000);

      return () => {
        clearTimeout(timer);
        if (synth.current) {
          synth.current.cancel(); // Stop speech synthesis if component is unmounted
        }
      };
    }
  }, [nextPatient, voicesLoaded]); // Dependency on voicesLoaded to ensure voices are ready

  // No visible UI is rendered
  return null;
}

export default AudioNotification;