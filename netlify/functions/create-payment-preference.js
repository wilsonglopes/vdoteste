const mercadopago = require('mercadopago');

exports.handler = async function(event, context) {
  // SUA CHAVE DE PRODUÇÃO NOVA
  mercadopago.configure({
    access_token: 'APP_USR-8229943388926691-090217-058ca460e5c70723e771ba6c5c7e0509-241067158'
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
    const SITE_URL = process.env.URL || 'https://vozesdooraculo.netlify.app';

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
      // OBRIGATÓRIO: Enviar o e-mail para o Pix não pedir na tela
      payer: {
        email: email || 'cliente@vozesdooraculo.com'
      },
      // OBRIGATÓRIO: Avisar que não tem frete para não dar erro de endereço
      shipments: {
        mode: 'not_specified'
      },
      binary_mode: true,
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
