import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // Dados atuais
  onUpdate: () => void; // Para recarregar a tela após salvar
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [whatsapp, setWhatsapp] = useState(user?.whatsapp || '');
  const [birthDate, setBirthDate] = useState(user?.birth_date || '');

  // Atualiza estados quando o usuário muda (ex: ao abrir o modal)
  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setWhatsapp(user.whatsapp || '');
      setBirthDate(user.birth_date || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Atualiza na tabela pública 'users'
      const { error } = await supabase
        .from('users')
        .update({ name, whatsapp, birth_date: birthDate })
        .eq('id', user.id);

      if (error) throw error;
      
      // Atualiza também os metadados de auth para manter sincronia (opcional mas recomendado)
      await supabase.auth.updateUser({
        data: { name, whatsapp, birth_date: birthDate }
      });

      onUpdate(); // Recarrega o dashboard
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="p-6 bg-[#16161e] border-b border-white/5 flex justify-between items-center">
            <h3 className="text-white font-serif text-lg">Editar Perfil</h3>
            <button onClick={onClose}><X className="text-slate-400 hover:text-white" /></button>
          </div>

          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Nome</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-purple-500 outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase tracking-wider">WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-purple-500 outline-none" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 uppercase tracking-wider">Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-purple-500 outline-none [color-scheme:dark]" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg mt-4 flex justify-center">
              {loading ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EditProfileModal;
