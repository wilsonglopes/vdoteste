const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const token = event.headers.authorization?.split('Bearer ')[1];
    const { clientId } = JSON.parse(event.body);
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: { user } } = await supabase.auth.getUser(token);
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (userData?.role !== 'admin') return { statusCode: 403, body: 'Acesso negado' };

    // Deleta do Auth (A tabela users deve ter cascade, senão deletamos manualmente)
    const { error } = await supabase.auth.admin.deleteUser(clientId);
    if (error) throw error;

    // Garante limpeza da tabela publica também
    await supabase.from('users').delete().eq('id', clientId);

    return { statusCode: 200, body: JSON.stringify({ message: 'Deletado' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
