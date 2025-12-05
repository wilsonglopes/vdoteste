import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Users, Activity, Trash2, Edit, Save, X, Search, DollarSign } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [clients, setClients] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ credits: 0, role: 'user' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/'); return; }

      const token = session.access_token;

      const resStats = await fetch('/.netlify/functions/get-dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (resStats.status === 403) { 
        alert('Área restrita!'); 
        navigate('/dashboard'); 
        return; 
      }
      
      const dataStats = await resStats.json();
      setStats(dataStats);

      const resClients = await fetch('/.netlify/functions/get-clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dataClients = await resClients.json();
      setClients(dataClients);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const newStatus = editForm.role === 'admin' ? 'admin' : 'free';

    await fetch('/.netlify/functions/update-client-status', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ 
        clientId: id, 
        credits: editForm.credits, 
        subscription_status: newStatus 
      })
    });
    setEditingId(null);
    checkAdminAndLoad();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja EXCLUIR este usuário?')) return;
    const { data: { session } } = await supabase.auth.getSession();
    await fetch('/.netlify/functions/delete-client', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ clientId: id })
    });
    checkAdminAndLoad();
  };

  const filteredClients = clients.filter(c => 
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-purple-500">Carregando Painel Mestre...</div>;

  return (
    <div className="min-h-screen bg-[#0f0c29] text-slate-200 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-serif text-white">Painel do Oráculo</h1>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-slate-400 hover:text-white border border-slate-700 px-4 py-2 rounded-lg w-full md:w-auto">
            Voltar ao Site
          </button>
        </div>

        {/* Stats Cards - Grid Responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-purple-500/30 p-5 rounded-xl shadow-lg flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg shrink-0"><Users className="text-purple-400" /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Usuários</p>
              <p className="text-2xl font-bold text-white">{stats.total_clients}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-green-500/30 p-5 rounded-xl shadow-lg flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg shrink-0"><DollarSign className="text-green-400" /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Pagantes</p>
              <p className="text-2xl font-bold text-white">{stats.active_clients}</p>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-blue-500/30 p-5 rounded-xl shadow-lg flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg shrink-0"><Activity className="text-blue-400" /></div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">Leituras</p>
              <p className="text-2xl font-bold text-white">{stats.total_readings}</p>
            </div>
          </div>
        </div>

        {/* Lista de Clientes */}
        <div className="bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden">
          
          {/* Barra de Busca */}
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-white self-start sm:self-center">Gerenciar Usuários</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar usuário..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 text-white"
              />
            </div>
          </div>

          {/* TABELA PARA DESKTOP (Escondida no Mobile) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-white/5 text-slate-200 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-3">Usuário</th>
                  <th className="px-6 py-3">WhatsApp</th>
                  <th className="px-6 py-3">Créditos</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/5 transition-colors">
                    {/* ... (Mantive a lógica de linhas da tabela igual) ... */}
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{client.name || 'Sem nome'}</div>
                      <div className="text-xs">{client.email}</div>
                    </td>
                    <td className="px-6 py-4">{client.whatsapp || '-'}</td>
                    
                    {editingId === client.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input type="number" className="w-20 bg-black/50 border border-purple-500 rounded p-1 text-white text-center" value={editForm.credits} onChange={e => setEditForm({...editForm, credits: parseInt(e.target.value) || 0})} />
                        </td>
                        <td className="px-6 py-4">
                          <select className="bg-black/50 border border-purple-500 rounded p-1 text-white" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                            <option value="user">Usuário</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => handleUpdate(client.id)} className="text-green-400 hover:text-green-300"><Save size={18} /></button>
                          <button onClick={() => setEditingId(null)} className="text-red-400 hover:text-red-300"><X size={18} /></button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-bold text-gold">{client.credits}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${client.subscription_status === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                            {client.subscription_status === 'admin' ? 'ADMIN' : 'USER'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-3">
                          <button onClick={() => { setEditingId(client.id); setEditForm({ credits: client.credits, role: client.subscription_status === 'admin' ? 'admin' : 'user' }); }} className="text-purple-400 hover:text-purple-300"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(client.id)} className="text-slate-500 hover:text-red-500"><Trash2 size={18} /></button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARDS PARA MOBILE (Visível apenas no Mobile) */}
          <div className="md:hidden flex flex-col gap-2 p-4 bg-black/20">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-slate-800 p-4 rounded-lg border border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-white font-bold">{client.name || 'Sem nome'}</p>
                    <p className="text-xs text-slate-400">{client.email}</p>
                    <p className="text-xs text-slate-500 mt-1">{client.whatsapp || 'Sem Whats'}</p>
                  </div>
                  {editingId !== client.id && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(client.id); setEditForm({ credits: client.credits, role: client.subscription_status === 'admin' ? 'admin' : 'user' }); }} className="p-2 bg-purple-500/10 rounded text-purple-400"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(client.id)} className="p-2 bg-red-500/10 rounded text-red-400"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>

                {/* Modo Edição no Card */}
                {editingId === client.id ? (
                  <div className="mt-3 p-3 bg-black/30 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-slate-400">Créditos:</label>
                      <input type="number" className="w-20 bg-slate-700 border border-purple-500 rounded p-1 text-white text-center" value={editForm.credits} onChange={e => setEditForm({...editForm, credits: parseInt(e.target.value) || 0})} />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-slate-400">Tipo:</label>
                      <select className="bg-slate-700 border border-purple-500 rounded p-1 text-white text-xs" value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                        <option value="user">Usuário</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={() => handleUpdate(client.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Salvar</button>
                      <button onClick={() => setEditingId(null)} className="bg-slate-600 text-white px-3 py-1 rounded text-xs">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                    <div className="text-xs text-slate-400">Créditos: <span className="text-gold font-bold text-sm">{client.credits}</span></div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${client.subscription_status === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700 text-slate-300'}`}>
                      {client.subscription_status === 'admin' ? 'ADMIN' : 'USER'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
