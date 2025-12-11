const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // CORREÇÃO: Busca na tabela 'users'
    const { data: clients, error } = await supabase
      .from('users') 
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { statusCode: 200, headers, body: JSON.stringify(clients) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};