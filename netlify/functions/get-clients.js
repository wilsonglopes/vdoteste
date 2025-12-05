const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const token = event.headers.authorization?.split('Bearer ')[1];
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) throw new Error('Não autorizado');

    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (userData?.role !== 'admin') return { statusCode: 403, body: 'Acesso negado' };

    // Busca Clientes
    const { data: clients, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify(clients) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
