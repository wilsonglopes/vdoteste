const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    // Aceita os formatos do seu front (clientId ou id)
    const body = JSON.parse(event.body);
    const id = body.id || body.clientId;
    const { name, credits, role, subscription_status } = body;

    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    // Monta o objeto de atualização
    const updates = {};
    if (name) updates.name = name;
    if (credits !== undefined) updates.credits = parseInt(credits);
    // Atualiza role se vier 'role' ou 'subscription_status' for admin
    if (role) updates.role = role;
    if (subscription_status === 'admin') updates.role = 'admin';

    // Atualiza na tabela 'users'
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Atualizado', data }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};