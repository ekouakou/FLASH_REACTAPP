import { useState, useEffect } from 'react';
import { Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function QueueScreen() {
  const [queuePosition, setQueuePosition] = useState(42);
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [totalUsers, setTotalUsers] = useState(108);
  const [progress, setProgress] = useState(0);
  const [animation, setAnimation] = useState(false);

  // Simuler la progression de la file d'attente
  useEffect(() => {
    const timer = setInterval(() => {
      setQueuePosition(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
      
      setEstimatedTime(prev => {
        if (prev <= 1) return 0;
        return prev - 0.5;
      });
      
      setTotalUsers(prev => prev - 1);
      
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
      
    }, 2000);
    
    return () => clearInterval(timer);
  }, []);

  // Animation pour l'effet de particules
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setAnimation(prev => !prev);
    }, 3000);
    
    return () => clearInterval(animationTimer);
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-950 to-black overflow-hidden">
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i}
            className={`absolute rounded-full bg-blue-500 opacity-20 ${animation ? 'animate-pulse' : ''}`}
            style={{
              width: Math.random() * 8 + 2 + 'px',
              height: Math.random() * 8 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDuration: Math.random() * 3 + 2 + 's',
              animationDelay: Math.random() * 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center max-w-md w-full p-8 rounded-2xl backdrop-blur-xl bg-white/10 shadow-2xl border border-white/20">
        <div className="absolute -top-12 w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
          <div className="text-white text-4xl font-bold">{queuePosition}</div>
        </div>
        
        <h1 className="mt-16 mb-2 text-3xl font-bold text-white text-center">File d'attente</h1>
        <p className="text-blue-200 mb-8 text-center">Veuillez patienter pendant que nous préparons votre accès</p>
        
        {/* Barre de progression avec un design moderne */}
        <div className="w-full h-3 bg-white/30 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4 w-full mb-8">
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 border border-white/10">
            <Clock className="text-blue-300 mb-2" size={28} />
            <span className="text-white text-lg font-bold">{estimatedTime} min</span>
            <span className="text-blue-200 text-xs">Temps estimé</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 border border-white/10">
            <Users className="text-blue-300 mb-2" size={28} />
            <span className="text-white text-lg font-bold">{totalUsers}</span>
            <span className="text-blue-200 text-xs">Utilisateurs</span>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-lg bg-white/5 border border-white/10">
            <ArrowRight className="text-blue-300 mb-2" size={28} />
            <span className="text-white text-lg font-bold">{Math.round(progress)}%</span>
            <span className="text-blue-200 text-xs">Progression</span>
          </div>
        </div>
        
        {queuePosition === 0 ? (
          <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-green-500 text-white w-full">
            <CheckCircle size={20} />
            <span className="font-medium">Accès prêt !</span>
          </div>
        ) : (
          <div className="flex items-center justify-center p-3 rounded-lg bg-blue-600 text-white w-full">
            <div className="animate-pulse">Préparation de votre accès...</div>
          </div>
        )}
        
        <p className="mt-6 text-blue-200 text-sm text-center">
          Vous pouvez quitter cette page, nous vous enverrons une notification dès que vous pourrez accéder à la plateforme.
        </p>
      </div>
    </div>
  );
}
