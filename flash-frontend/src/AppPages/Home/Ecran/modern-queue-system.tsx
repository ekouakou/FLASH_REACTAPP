import { useState, useEffect } from 'react';
import { Clock, ChevronRight, Play, X, Info, Bell, MessageSquare } from 'lucide-react';

export default function ModernQueueSystem() {
  const [currentTime, setCurrentTime] = useState('00:00');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [activeMessage, setActiveMessage] = useState(0);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [nextPatient, setNextPatient] = useState(null);
  
  // Données simulées
  const [queueItems] = useState([
    { id: 'B127', name: 'LAMBERT T.', status: 'En cours', estimatedTime: '0', room: 'Cabinet 3', type: 'premium' },
    { id: 'B128', name: 'LEROY C.', status: 'Préparation', estimatedTime: '3', room: 'Cabinet 1', type: 'standard' },
    { id: 'B129', name: 'GIRARD M.', status: 'En attente', estimatedTime: '7', room: 'Cabinet 2', type: 'standard' },
    { id: 'B130', name: 'MOREAU S.', status: 'En attente', estimatedTime: '15', room: 'Cabinet 3', type: 'urgent' },
    { id: 'B131', name: 'ANDRE P.', status: 'En attente', estimatedTime: '18', room: 'Cabinet 1', type: 'standard' },
    { id: 'B132', name: 'SIMON R.', status: 'En attente', estimatedTime: '23', room: 'Cabinet 2', type: 'standard' },
    { id: 'B133', name: 'LEGRAND J.', status: 'En attente', estimatedTime: '30', room: 'Cabinet 3', type: 'standard' }
  ]);
  
  const scrollMessages = [
    "Bienvenue dans notre centre. N'hésitez pas à demander de l'aide à nos conseillers.",
    "Merci de respecter les règles sanitaires et la distanciation sociale.",
    "Pour une meilleure expérience, veuillez préparer vos documents avant votre rendez-vous.",
    "Nos équipes sont mobilisées pour réduire votre temps d'attente."
  ];
  
  const videos = [
    { id: 1, title: "Présentation de nos services", placeholder: "/api/placeholder/640/360" },
    { id: 2, title: "Guide d'utilisation de l'espace client", placeholder: "/api/placeholder/640/360" }
  ];

  // Mise à jour de l'heure
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Rotation des messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setActiveMessage(prev => (prev + 1) % scrollMessages.length);
    }, 8000);
    return () => clearInterval(messageInterval);
  }, [scrollMessages.length]);
  
  // Rotation des vidéos
  useEffect(() => {
    const videoInterval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % videos.length);
    }, 45000);
    return () => clearInterval(videoInterval);
  }, [videos.length]);
  
  // Simulation d'une notification de prochain patient
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      // Simuler l'appel du prochain patient
      const randomIndex = Math.floor(Math.random() * queueItems.slice(1, 3).length);
      setNextPatient(queueItems[randomIndex + 1]);
      setShowNotification(true);
      
      // Masquer la notification après 10 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }, 30000);
    
    return () => clearInterval(notificationInterval);
  }, [queueItems]);

  // Fonction pour obtenir la couleur basée sur le type
  const getTypeColor = (type) => {
    switch(type) {
      case 'urgent': return 'bg-red-500';
      case 'premium': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'En cours': return 'text-green-500';
      case 'Préparation': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">
      {/* Notification popup */}
      {showNotification && nextPatient && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-72 z-50 border-l-4 border-green-500 animate-slideIn">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-gray-800">Prochain patient</h3>
            <button onClick={() => setShowNotification(false)}>
              <X size={16} className="text-gray-500 hover:text-gray-800" />
            </button>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Bell size={18} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold">{nextPatient.name}</p>
              <p className="text-sm text-gray-600">{nextPatient.room}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header moderne */}
      <header className="bg-white border-b border-gray-200 shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock size={22} className="text-gray-500 mr-2" />
              <span className="text-2xl font-semibold text-gray-800">{currentTime}</span>
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <span className="text-gray-600 font-medium">Centre de services</span>
          </div>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            SYSTÈME D'ATTENTE
          </h1>
          
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium text-sm">
              {queueItems.length} en attente
            </span>
            <Bell size={20} className="text-blue-600" />
          </div>
        </div>
      </header>
      
      {/* Message défilant avec transition fade */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 relative overflow-hidden">
        <div className="flex items-center transition-opacity duration-1000">
          <MessageSquare size={18} className="mr-3 text-blue-200" />
          <span className="text-lg font-medium">{scrollMessages[activeMessage]}</span>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="flex flex-grow p-4 gap-4">
        {/* Section vidéo avec effet moderne */}
        <div className={`transition-all duration-300 ease-in-out ${videoExpanded ? 'w-2/3' : 'w-1/2'} flex flex-col gap-4`}>
          <div className="bg-white rounded-xl shadow-md overflow-hidden flex-grow relative group">
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 z-10"></div>
            
            <img 
              src={videos[currentVideo].placeholder} 
              alt="Contenu vidéo" 
              className="w-full h-full object-cover"
            />
            
            {/* Contrôles vidéo */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white font-bold text-xl mb-2">{videos[currentVideo].title}</h3>
                  <div className="flex items-center space-x-3">
                    <button className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-all">
                      <Play size={16} className="text-white" fill="white" />
                    </button>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm py-1 px-3 rounded-full">
                      <span className="text-white text-sm">En direct</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setVideoExpanded(!videoExpanded)}
                  className="bg-white bg-opacity-20 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-30 transition-all"
                >
                  <ChevronRight size={18} className={`text-white transform transition-transform ${videoExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages importants */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center mb-4">
              <Info size={20} className="text-blue-600 mr-2" />
              <h2 className="text-lg font-bold text-gray-800">Informations importantes</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p className="text-gray-700">Veuillez garder votre téléphone allumé pour recevoir les notifications.</p>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p className="text-gray-700">Préparez vos documents d'identité et votre numéro de dossier avant l'appel.</p>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 mr-3 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p className="text-gray-700">L'ordre de passage peut être modifié selon les urgences et les priorités.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* File d'attente avec design moderne */}
        <div className={`transition-all duration-300 ease-in-out ${videoExpanded ? 'w-1/3' : 'w-1/2'}`}>
          <div className="bg-white rounded-xl shadow-md h-full flex flex-col overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-5">
              <h2 className="text-xl font-bold text-white">File d'attente actuelle</h2>
              <p className="text-blue-200 text-sm">Mise à jour en temps réel</p>
            </div>
            
            <div className="flex-grow overflow-auto p-4">
              <div className="space-y-3">
                {queueItems.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`rounded-lg ${index === 0 ? 'bg-green-50 border border-green-100' : 'bg-white border border-gray-100'} shadow-sm overflow-hidden transition-all hover:shadow`}
                  >
                    <div className="flex items-center p-4">
                      {/* Barre latérale colorée */}
                      <div className={`w-1 self-stretch mr-4 rounded-full ${getTypeColor(item.type)}`}></div>
                      
                      {/* Contenu principal */}
                      <div className="flex-grow flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-full ${index === 0 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                            <span className={`font-bold ${index === 0 ? 'text-green-700' : 'text-gray-700'}`}>{item.id.slice(-2)}</span>
                          </div>
                          
                          <div>
                            <div className="font-semibold text-gray-800">{item.name}</div>
                            <div className={`text-sm ${getStatusColor(item.status)}`}>{item.status}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-gray-700">{item.room}</div>
                          <div className="text-sm text-gray-500">{item.estimatedTime} min</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Légende */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <h3 className="font-medium text-gray-700 mb-2">Légende</h3>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span>Urgent</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-purple-600 mr-2"></span>
                  <span>Premium</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                  <span>Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer moderne avec défilement */}
      <footer className="bg-gradient-to-r from-indigo-800 to-blue-700 text-white p-3">
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-marquee inline-block">
            Nous vous remercions de votre patience • Les temps d'attente sont estimés et peuvent varier • Pour toute urgence, adressez-vous à l'accueil • Notre équipe fait de son mieux pour réduire votre temps d'attente
          </div>
        </div>
      </footer>
    </div>
  );
}
