const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, DELETE'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    console.log("Iniciando exclusão...");

    // 1. Verificação de Variáveis de Ambiente
    if (!process.env.SUPABASE_SERVICE_KEY) {
      console.error("ERRO CRÍTICO: SUPABASE_SERVICE_KEY não encontrada no Netlify.");
      throw new Error("Configuração de servidor incompleta (Service Key).");
    }

    // 2. Parse do Body com segurança
    if (!event.body) throw new Error("Body vazio.");
    const body = JSON.parse(event.body);
    
    // ACEITA OS DOIS FORMATOS (id ou clientId) para não quebrar
    const targetId = body.id || body.clientId;

    if (!targetId) {
      console.error("ID não recebido. Body:", event.body);
      throw new Error("ID do usuário não fornecido.");
    }

    console.log("Alvo identificado:", targetId);

    // 3. Conexão Admin
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // 4. (Opcional) Verificar se quem pede é admin
    // Se quiser pular essa verificação para testar, comente este bloco
    const token = event.headers.authorization?.split('Bearer ')[1];
    if (token) {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
            const { data: adminCheck } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (adminCheck?.role !== 'admin') {
                return { statusCode: 403, headers, body: JSON.stringify({ error: 'Apenas admins podem deletar.' }) };
            }
        }
    }

    // 5. Deletar do Banco de Dados (profiles)
    const { error: dbError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', targetId);

    if (dbError) {
      console.error("Erro ao deletar profile:", dbError);
      // Não damos throw aqui porque o usuário pode já não ter perfil
    }

    // 6. Deletar do Sistema de Login (Auth) - A PARTE CRÍTICA
    const { error: authError } = await supabase.auth.admin.deleteUser(targetId);

    if (authError) {
      console.error("Erro ao deletar Auth:", authError);
      throw authError;
    }

    console.log("Sucesso total.");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Cliente deletado com sucesso!' }),
    };

  } catch (error) {
    console.error('FALHA GERAL:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Erro interno no servidor.' }),
    };
  }
};
