import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, User, Trash2, Check } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileSelector() {
  const { profiles, setActiveProfile, createProfile, deleteProfile } = useProgress();
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const id = createProfile(newName.trim());
    setActiveProfile(id);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-fredoka text-3xl text-text-dark">Who is learning?</h2>
          <p className="text-text-medium mt-2">Pick your profile to start the adventure!</p>
        </div>

        <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-2">
          {profiles.length === 0 && (
            <p className="text-center text-text-light italic py-4">No adventurers yet. Create your first profile below!</p>
          )}
          {profiles.map(profile => (
            <div 
              key={profile.id} 
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary/10 rounded-2xl transition-colors border border-gray-100 group"
            >

              <button 
                onClick={() => { setActiveProfile(profile.id); navigate('/'); }}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {profile.name[0].toUpperCase()}
                </div>
                <span className="font-bold text-text-dark">{profile.name}</span>
              </button>
              <button 
                onClick={() => deleteProfile(profile.id)}
                className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleCreate} className="space-y-4 pt-6 border-t border-gray-100">
          <div className="relative">
            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
            <input 
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-primary rounded-2xl outline-none transition-all font-bold text-text-dark"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            Start Learning!
          </button>
        </form>
      </motion.div>
    </div>
  );
}
