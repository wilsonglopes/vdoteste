const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const body = JSON.parse(event.body);
    // Aceita os dois formatos que seu site envia
    const targetId = body.id || body.clientId; 
    
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // 1. Deleta do Auth (Login)
    const { error: authError } = await supabase.auth.admin.deleteUser(targetId);
    if (authError) throw authError;

    // 2. Deleta da tabela 'users' (Limpeza visual)
    await supabase.from('users').delete().eq('id', targetId);

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Deletado' }) };
  } catch (error) {
    console.log(error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};