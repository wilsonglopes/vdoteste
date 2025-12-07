const mercadopago = require('mercadopago');

exports.handler = async function(event, context) {
  // 1. Configuração CORRETA para versão 1.x
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
    const { title, price, quantity, userId } = JSON.parse(event.body);
    const SITE_URL = process.env.URL || 'https://vozesdooraculo.netlify.app';

    // 2. Criação da preferência
    const preference = {
      items: [
        {
          title: title,
          unit_price: parseFloat(price),
          quantity: parseInt(quantity),
          currency_id: 'BRL'
        }
      ],
      external_reference: userId,
      notification_url: `${SITE_URL}/.netlify/functions/mp-webhook`,
      payment_methods: {
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12
      },
      back_urls: {
        success: `${SITE_URL}/#/dashboard`,
        failure: `${SITE_URL}/#/dashboard`,
        pending: `${SITE_URL}/#/dashboard`
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    
    console.log("Preferência criada:", response.body.id);
    
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
