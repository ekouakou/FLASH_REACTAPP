import React, { useState, useEffect, useRef } from 'react';

function TextToSpeech() {
  const [text, setText] = useState('TRI-001');
  const [language, setLanguage] = useState('fr-FR');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const synth = useRef(null);

  // Initialiser la synthèse vocale
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
    }
  }, []);

  // Fonction pour lire le texte
  const speak = () => {
    if (!synth.current) {
      console.error("La synthèse vocale n'est pas disponible");
      return;
    }
    
    // Arrêter toute lecture en cours
    synth.current.cancel();
    
    // Créer un nouvel objet SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Définir la langue
    utterance.lang = language;
    
    // Définir la voix si une est sélectionnée
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Lire le texte
    synth.current.speak(utterance);
  };

  // Charger les voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      if (!synth.current) return;
      
      const availableVoices = synth.current.getVoices();
      
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        
        // Rechercher d'abord une voix Google française
        let voiceToUse = availableVoices.find(v => 
          v.name.toLowerCase().includes('google') && 
          v.lang.includes('fr')
        );
        
        // Si aucune voix Google française n'est trouvée, sélectionner une voix française quelconque
        if (!voiceToUse) {
          voiceToUse = availableVoices.find(v => v.lang.includes('fr'));
        }
        
        // Si toujours aucune voix française, prendre une voix qui correspond à la langue sélectionnée
        if (!voiceToUse) {
          voiceToUse = availableVoices.find(v => v.lang.includes(language.slice(0, 2)));
        }
        
        if (voiceToUse) {
          setSelectedVoice(voiceToUse);
          console.log("Voix sélectionnée:", voiceToUse.name);
        }
      }
    };

    // Firefox et certains navigateurs peuvent avoir les voix déjà chargées
    loadVoices();
    
    // Chrome et autres navigateurs nécessitent d'attendre l'événement voiceschanged
    if (synth.current) {
      synth.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (synth.current) {
        synth.current.onvoiceschanged = null;
      }
    };
  }, [language]);

  // Déclencher la lecture automatique lorsque le composant est monté
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedVoice) {
        speak();
      }
    }, 500); // Délai court pour s'assurer que les voix sont chargées
    
    return () => clearTimeout(timer);
  }, [selectedVoice]);

  // Lire automatiquement quand le texte change
  useEffect(() => {
    if (selectedVoice) {
      speak();
    }
  }, [text]);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="mb-4">
        <p className="mb-2 font-semibold">Synthèse vocale automatique</p>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          cols={40}
          className="w-full p-2 border rounded"
          placeholder="Entrez du texte à lire automatiquement..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">
          Langue:
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-2 p-1 border rounded"
          >
            <option value="fr-FR">Français</option>
            <option value="en-US">Anglais (US)</option>
            <option value="es-ES">Espagnol</option>
            <option value="de-DE">Allemand</option>
            <option value="it-IT">Italien</option>
            <option value="ja-JP">Japonais</option>
            <option value="ru-RU">Russe</option>
            <option value="zh-CN">Chinois</option>
          </select>
        </label>
      </div>
      
      {voices.length > 0 && (
        <div>
          <label className="block">
            Voix:
            <select 
              value={selectedVoice ? selectedVoice.name : ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              className="ml-2 p-1 border rounded"
            >
              {voices
                .filter(voice => voice.lang.includes(language.slice(0, 2)))
                .map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
      )}
      
      {/* Message d'information */}
      <div className="mt-4 text-sm text-gray-600">
        La lecture démarre automatiquement lorsque vous modifiez le texte ou changez la voix.
      </div>
    </div>
  );
}

export default TextToSpeech;