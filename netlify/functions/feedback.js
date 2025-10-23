const { OpenAI } = require('openai');

// Test mode - set to true for unlimited testing, false for production
const TEST_MODE = false;

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map();

// Content filtering patterns - focused on hateful and sexual content
const inappropriatePatterns = [
  // Sexual content
  /\b(porn|porno|sex|xxx|nsfw|nude|naked)\b/i,
  
  // Hate speech and racial slurs (comprehensive patterns)
  /\b(hate|racist|discrimination|bigot|slur)\b/i,
  /\b(n[1i]gg[ae]r|n[1i]gg[ae]rs?)\b/i,  // N-word variations
  /\b(k[1i]ke|k[1i]kes?)\b/i,            // Anti-Semitic slur
  /\b(ch[1i]nk|ch[1i]nks?)\b/i,          // Anti-Asian slur
  /\b(sp[1i]c|sp[1i]cs?)\b/i,            // Anti-Hispanic slur
  /\b(wetback|towelhead|sandn[1i]gger)\b/i, // Other racial slurs
  
  // Violence and harm
  /\b(violence|kill|murder|suicide|harm)\b/i,
  
  // Scams and spam
  /\b(spam|scam|phishing)\b/i
];

// Rate limiting: 3 requests per day per user for feedback
function checkFeedbackRateLimit(ip) {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  // Use a simple user identifier instead of IP
  const userKey = 'test_user'; // You can change this to anything
  const key = `feedback_rate_${userKey}`;
  
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
  
  if (data.count >= 3) {
    return false;
  }
  
  data.count++;
  return true;
}

// Content filtering
function isInappropriateContent(text) {
  return inappropriatePatterns.some(pattern => pattern.test(text));
}

// System prompt for immediate response
const IMMEDIATE_RESPONSE_SYSTEM_PROMPT = `You are a friendly, casual assistant responding to user feedback about an AI thesaurus website called WordCompass.io.

Your job is to give a short, appreciative response that:
- Thanks the user warmly
- Shows you read their feedback
- Is casual and friendly (not formal)
- Does NOT commit to implementing anything specific
- If it's clearly a bug or serious issue, show extra gratitude

Keep responses under 50 words. Be genuine and warm.`;

// System prompt for background categorization
const CATEGORIZATION_SYSTEM_PROMPT = `You are analyzing user feedback for an AI thesaurus website. 

Categorize the feedback into one of these types:
1. "bug" - Technical issues, errors, broken functionality
2. "feature_request" - Suggestions for new features or improvements
3. "general_feedback" - General comments, praise, or other feedback

Respond with ONLY the category name (bug, feature_request, or general_feedback).`;

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

  // Check rate limiting (skip if in test mode)
  if (!TEST_MODE && !checkFeedbackRateLimit(clientIP)) {
    return {
      statusCode: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': '86400'
      },
      body: JSON.stringify({ 
        error: 'Rate limit exceeded. Maximum 3 feedback submissions per day.' 
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
    const { feedback, timestamp, userAgent, url } = JSON.parse(event.body);

    if (!feedback || typeof feedback !== 'string' || feedback.trim().length === 0) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Feedback is required' })
      };
    }

    // Content filtering
    if (isInappropriateContent(feedback)) {
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

    // Initialize OpenAI client
    const openai = new OpenAI({ apiKey });

    // First call: Generate immediate response
    const immediateResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: IMMEDIATE_RESPONSE_SYSTEM_PROMPT },
        { role: 'user', content: `User feedback: "${feedback}"` }
      ],
      temperature: 0.8,
      max_tokens: 100
    });

    const userResponse = immediateResponse.choices[0].message.content.trim();

    // Second call: Background categorization (async, don't wait for it)
    setImmediate(async () => {
      try {
        const categorizationResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: CATEGORIZATION_SYSTEM_PROMPT },
            { role: 'user', content: `Feedback: "${feedback}"` }
          ],
          temperature: 0.3,
          max_tokens: 20
        });

        const feedbackType = categorizationResponse.choices[0].message.content.trim().toLowerCase();
        
        // Log the feedback with categorization for your review
        console.log('=== FEEDBACK RECEIVED ===');
        console.log('Timestamp:', timestamp || new Date().toISOString());
        console.log('Type:', feedbackType);
        console.log('Feedback:', feedback);
        console.log('User Agent:', userAgent);
        console.log('URL:', url);
        console.log('Response Sent:', userResponse);
        console.log('========================');
        
      } catch (error) {
        console.error('Background categorization error:', error.message);
        // Still log the feedback even if categorization fails
        console.log('=== FEEDBACK RECEIVED (No categorization) ===');
        console.log('Timestamp:', timestamp || new Date().toISOString());
        console.log('Feedback:', feedback);
        console.log('User Agent:', userAgent);
        console.log('URL:', url);
        console.log('Response Sent:', userResponse);
        console.log('==========================================');
      }
    });

    // Return immediate response
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        response: userResponse,
        feedbackType: 'general_feedback' // Default, will be updated in background
      })
    };

  } catch (error) {
    // Log error server-side only (not exposed to client)
    console.error('Feedback API Error:', error.message);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Failed to process feedback. Please try again.' 
      })
    };
  }
};
