const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };
  
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  try {
    // Busca na tabela 'users'
    const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
    // Busca leituras
    const { count: totalReadings } = await supabase.from('readings').select('*', { count: 'exact', head: true });
    // Busca pagantes (quem tem créditos)
    const { count: payingUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).gt('credits', 0);

    return {
      statusCode: 200, headers,
      body: JSON.stringify({ 
        users: totalUsers || 0, 
        paying: payingUsers || 0, 
        readings: totalReadings || 0,
        // Mantive os nomes antigos para compatibilidade com seu front antigo
        total_clients: totalUsers || 0,
        active_clients: payingUsers || 0,
        total_readings: totalReadings || 0
      }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};