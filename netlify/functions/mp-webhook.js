const mercadopago = require('mercadopago');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const { id, topic } = event.queryStringParameters || {};
  
  if (topic !== 'payment' && event.queryStringParameters?.type !== 'payment') {
    return { statusCode: 200, body: 'OK' };
  }

  const paymentId = id || event.queryStringParameters?.['data.id'];

  try {
    mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const payment = await mercadopago.payment.get(paymentId);
    const { status, external_reference, transaction_amount } = payment.body;

    if (status === 'approved') {
      const userId = external_reference;
      console.log(`Pagamento aprovado: User ${userId}, Valor R$ ${transaction_amount}`);

      // BUSCA CRÉDITOS ATUAIS
      const { data: user } = await supabase.from('users').select('credits').eq('id', userId).single();
      const currentCredits = user?.credits || 0;
      let creditsToAdd = 0;

      // LÓGICA DE PACOTES DE CRÉDITOS
      if (transaction_amount >= 19 && transaction_amount < 30) {
        creditsToAdd = 3; // Pacote Básico
      } else if (transaction_amount >= 30 && transaction_amount < 60) {
        creditsToAdd = 7; // Pacote Popular
      } else if (transaction_amount >= 60) {
        creditsToAdd = 15; // Pacote Mestre
      }

      if (creditsToAdd > 0) {
        await supabase.from('users').update({ 
          credits: currentCredits + creditsToAdd 
        }).eq('id', userId);
        console.log(`Adicionados ${creditsToAdd} créditos com sucesso.`);
      }
    }

    return { statusCode: 200, body: 'OK' };

  } catch (error) {
    console.error('Erro Webhook:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
