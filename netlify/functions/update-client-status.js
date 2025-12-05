const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const token = event.headers.authorization?.split('Bearer ')[1];
    const { clientId, credits, subscription_status } = JSON.parse(event.body);
    
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Verifica Admin
    const { data: { user } } = await supabase.auth.getUser(token);
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (userData?.role !== 'admin') return { statusCode: 403, body: 'Acesso negado' };

    // Atualiza
    const { error } = await supabase.from('users').update({ credits, subscription_status }).eq('id', clientId);
    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ message: 'Atualizado' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
