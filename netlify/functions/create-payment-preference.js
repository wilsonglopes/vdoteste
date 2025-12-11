const mercadopago = require('mercadopago');

exports.handler = async function(event, context) {
  // Configura a chave de acesso do Mercado Pago
  mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN
  });

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { title, price, quantity, userId, email } = JSON.parse(event.body);
    
    // CORREÇÃO: Definir a URL base explicitamente sem o '/#/dashboard'
    // Isso força o navegador a recarregar a página ao clicar em Voltar
    const BASE_URL = 'https://vozesdooraculo.com.br';

    const preference = {
      items: [
        {
          title: title,
          unit_price: parseFloat(price),
          quantity: parseInt(quantity),
          currency_id: 'BRL',
          category_id: 'virtual_goods'
        }
      ],
      payer: {
        email: email
      },
      external_reference: userId,
      notification_url: `${BASE_URL}/.netlify/functions/mp-webhook`,
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12
      },
      // AQUI ESTÁ A MÁGICA:
      // Removemos o '/#/dashboard' das URLs de retorno.
      // Ao redirecionar para a raiz, o modal some e o site carrega normalmente.
      back_urls: {
        success: BASE_URL,
        failure: BASE_URL,
        pending: BASE_URL
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        preferenceId: response.body.id, 
        init_point: response.body.init_point 
      }),
    };

  } catch (error) {
    console.error('ERRO MP:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro ao criar preferência.', details: error.message }),
    };
  }
};
