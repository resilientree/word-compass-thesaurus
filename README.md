# Synonym Tuner

A web-based thesaurus tool that allows you to tune synonym suggestions using various parameters like era, region, formality, and more.

## Setup

### Local Development

1. Create a `.env` file in the root directory:
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

2. Replace `your_openai_api_key_here` with your actual OpenAI API key.

3. Open `index.html` in your browser or serve it using a local server.

### Netlify Deployment

1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add a new environment variable:
   - Key: `VITE_OPENAI_API_KEY`
   - Value: Your OpenAI API key
3. Deploy your site

## Environment Variables

- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required)

## Features

- **Era Slider**: Modern to historical words
- **Region Slider**: US to UK English
- **Rarity Slider**: Common to rare words
- **Emotion Slider**: Neutral to vivid words
- **Formality Slider**: Informal to formal words
- **Abstractness Slider**: Concrete to abstract words
- **Sentiment Slider**: Negative to positive words
- **Creativity Slider**: Focused to creative alternatives

## Security

- API keys are stored in environment variables
- Never commit API keys to version control
- The `.env` file is included in `.gitignore` 