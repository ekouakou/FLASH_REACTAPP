import { useState, useEffect } from 'react';
import { Clock, Calendar, Monitor, CheckCircle, ArrowRightCircle, MessageCircle, Bell } from 'lucide-react';

export default function PremiumQueueDisplay() {
  const [currentTime, setCurrentTime] = useState('00:00');
  const [currentDate, setCurrentDate] = useState('');
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [marqueeText, setMarqueeText] = useState(0);
  
  // Données des patients simulées
  const [queueData] = useState([
    { id: 'A001', name: 'MARTIN J.', status: 'En cours', room: 'Salle 3', waitTime: '0 min', priority: 'urgent' },
    { id: 'A002', name: 'DUBOIS S.', status: 'En attente', room: 'Salle 1', waitTime: '5 min', priority: 'normal' },
    { id: 'A003', name: 'PETIT M.', status: 'En attente', room: 'Salle 4', waitTime: '10 min', priority: 'normal' },
    { id: 'A004', name: 'ROBERT L.', status: 'En attente', room: 'Salle 2', waitTime: '15 min', priority: 'normal' },
    { id: 'A005', name: 'RICHARD P.', status: 'En attente', room: 'Salle 5', waitTime: '20 min', priority: 'low' },
    { id: 'A006', name: 'DURAND T.', status: 'En préparation', room: 'Salle 1', waitTime: '25 min', priority: 'normal' }
  ]);
  
  // Données simulées pour les vidéos et messages
  const videoContent = [
    { placeholder: "/api/placeholder/640/360", title: "Informations sur nos services" },
    { placeholder: "/api/placeholder/640/360", title: "Conseils santé et prévention" }
  ];
  
  const marqueeMessages = [
    "Bienvenue dans notre établissement. Notre équipe vous souhaite la bienvenue.",
    "Pour toute assistance supplémentaire, veuillez vous adresser à l'accueil au numéro 24.",
    "Merci de préparer vos documents et de respecter le silence dans la salle d'attente.",
    "Nos services sont complets aujourd'hui. Nous vous remercions de votre patience."
  ];

  // Mise à jour de l'heure et date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format heure
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      // Format date
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('fr-FR', options));
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Rotation des vidéos
  useEffect(() => {
    const videoInterval = setInterval(() => {
      setActiveVideoIndex(prev => (prev + 1) % videoContent.length);
    }, 30000);
    return () => clearInterval(videoInterval);
  }, [videoContent.length]);
  
  // Rotation des messages défilants
  useEffect(() => {
    const textInterval = setInterval(() => {
      setMarqueeText(prev => (prev + 1) % marqueeMessages.length);
    }, 10000);
    return () => clearInterval(textInterval);
  }, [marqueeMessages.length]);

  // Fonction pour déterminer la couleur de priorité
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-500';
      case 'low': return 'bg-blue-400';
      default: return 'bg-blue-600';
    }
  };
  
  // Fonction pour déterminer l'état
  const getStatusStyle = (status) => {
    switch(status) {
      case 'En cours': return 'text-green-500 font-bold';
      case 'En préparation': return 'text-orange-500 font-semibold';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Header premium avec gradient */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <Clock size={20} className="text-blue-200" /> 
              <span className="text-2xl font-light">{currentTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-blue-200" />
              <span className="text-lg font-light capitalize">{currentDate}</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-wide flex items-center">
            <Monitor size={28} className="mr-3 text-blue-300" />
            ESPACE D'ATTENTE
          </h1>
          
          <div className="flex items-center space-x-3">
            <Bell size={20} className="text-blue-200" />
            <span className="text-lg font-medium bg-blue-900 py-1 px-3 rounded-full">
              {queueData.length} en attente
            </span>
          </div>
        </div>
      </header>
      
      {/* Message défilant animé */}
      <div className="bg-gradient-to-r from-indigo-800 to-blue-900 text-white p-2 overflow-hidden whitespace-nowrap relative">
        <div className="flex items-center space-x-3 animate-marquee">
          <MessageCircle size={18} className="flex-shrink-0 text-blue-300" />
          <span className="text-lg">{marqueeMessages[marqueeText]}</span>
          <div className="mx-12 h-1 w-1 rounded-full bg-blue-300"></div>
          <MessageCircle size={18} className="flex-shrink-0 text-blue-300" />
          <span className="text-lg">{marqueeMessages[(marqueeText + 1) % marqueeMessages.length]}</span>
          <div className="mx-12 h-1 w-1 rounded-full bg-blue-300"></div>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex flex-grow p-4 gap-4">
        {/* Zone de vidéo - Style moderne avec overlay */}
        <div className="w-1/2 flex flex-col gap-4">
          <div className="bg-white rounded-xl overflow-hidden shadow-lg flex-grow relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 z-10"></div>
            <img 
              src={videoContent[activeVideoIndex].placeholder} 
              alt="Contenu vidéo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
              <h3 className="font-bold text-2xl mb-2">{videoContent[activeVideoIndex].title}</h3>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                <span>Diffusion en direct</span>
              </div>
            </div>
          </div>
          
          {/* Infos complémentaires */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle size={20} className="mr-2 text-blue-600" />
              Informations importantes
            </h2>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <ArrowRightCircle size={18} className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                <span>Veuillez préparer votre pièce d'identité et votre numéro de dossier.</span>
              </p>
              <p className="flex items-start">
                <ArrowRightCircle size={18} className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                <span>Le temps d'attente estimé est calculé en fonction de l'affluence actuelle.</span>
              </p>
              <p className="flex items-start">
                <ArrowRightCircle size={18} className="mr-2 text-blue-500 mt-1 flex-shrink-0" />
                <span>Un message sonore sera diffusé lorsque votre numéro sera appelé.</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* File d'attente - Style carte premium */}
        <div className="w-1/2 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-indigo-800 to-blue-700 text-white p-4">
            <h2 className="text-2xl font-bold">File d'attente actuelle</h2>
            <p className="text-blue-200">Les numéros sont appelés dans l'ordre indiqué</p>
          </div>
          
          <div className="flex-grow overflow-auto p-4">
            <div className="space-y-3">
              {queueData.map((item) => (
                <div key={item.id} className="flex items-stretch overflow-hidden rounded-lg border border-gray-100 shadow-sm transition-all hover:shadow">
                  {/* Indicateur de priorité */}
                  <div className={`w-2 ${getPriorityColor(item.priority)}`}></div>
                  
                  {/* Contenu principal */}
                  <div className="flex flex-grow p-4 justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full ${item.status === 'En cours' ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center font-bold text-lg ${item.status === 'En cours' ? 'text-green-700' : 'text-gray-700'}`}>
                        {item.id.substring(1)}
                      </div>
                      
                      <div>
                        <div className="font-bold text-lg text-gray-800">{item.name}</div>
                        <div className={`text-sm ${getStatusStyle(item.status)}`}>{item.status}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-gray-600 font-medium">{item.room}</div>
                      <div className="text-sm text-gray-500">Attente: {item.waitTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Légende */}
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span>Prioritaire</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                <span>Standard</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span>
                <span>Consultation simple</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer avec message défilant */}
      <footer className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-3">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            Pour toute urgence, veuillez vous adresser directement à l'accueil • Les temps d'attente sont donnés à titre indicatif • Merci de votre compréhension et de votre patience • Notre équipe fait son maximum pour vous accueillir dans les meilleures conditions
          </div>
        </div>
      </footer>
    </div>
  );
}
