const { OpenAI } = require('openai');

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map();

// Content filtering patterns
const inappropriatePatterns = [
  /porn|sex|xxx|adult|nsfw/i,
  /hate|racist|discrimination/i,
  /violence|kill|murder|suicide/i,
  /drug|cocaine|heroin|marijuana/i,
  /gambling|casino|betting/i,
  /spam|scam|phishing/i
];

// Rate limiting: 30 requests per day per IP
function checkRateLimit(ip) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const key = `rate_${ip}`;
  
  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, { count: 1, resetTime: now + dayMs });
    return true;
  }
  
  const data = rateLimitStore.get(key);
  
  if (now > data.resetTime) {
    data.count = 1;
    data.resetTime = now + dayMs;
    return true;
  }
  
  if (data.count >= 30) {
    return false;
  }
  
  data.count++;
  return true;
}

// Content filtering
function isInappropriateContent(text) {
  return inappropriatePatterns.some(pattern => pattern.test(text));
}

exports.handler = async (event, context) => {
  // Get client IP for rate limiting
  const clientIP = event.headers['x-forwarded-for'] || 
                   event.headers['x-real-ip'] || 
                   event.connection?.remoteAddress || 
                   'unknown';
  
  // CORS headers for allowed domains
  const allowedOrigins = [
    'https://wordcompass.io',
    'https://wordcompass.netlify.app',
    'https://wordcompass.netlify.app/'
  ];
  
  const origin = event.headers.origin || event.headers.Origin;
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://wordcompass.io';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check rate limiting
  if (!checkRateLimit(clientIP)) {
    return {
      statusCode: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': '86400'
      },
      body: JSON.stringify({ 
        error: 'Rate limit exceeded. Maximum 30 requests per day.' 
      })
    };
  }

  try {
    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Service temporarily unavailable' })
      };
    }

    // Parse request body
    const { messages, temperature, max_tokens, model } = JSON.parse(event.body);

    // Content filtering - check all messages for inappropriate content
    if (messages && Array.isArray(messages)) {
      for (const message of messages) {
        if (message.content && isInappropriateContent(message.content)) {
          return {
            statusCode: 400,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              error: 'Content not allowed. Please use appropriate language.' 
            })
          };
        }
      }
    }

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo', // Default to fast model
      messages,
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 200
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    // Log error server-side only (not exposed to client)
    console.error('API Error:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch synonyms. Please try again.' 
      })
    };
  }
};
