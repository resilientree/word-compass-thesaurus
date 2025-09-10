# Synonym Tuner

A web-based thesaurus tool that allows you to tune synonym suggestions using various parameters like era, region, formality, and more.

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Test locally:**
   - Open `index.html` directly in your browser
   - The app will work locally (though API calls will fail without the Netlify function)
   - For full testing, deploy to Netlify or use Netlify CLI

3. **Using Netlify CLI (optional):**
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

### Netlify Deployment

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository: `resilientree/word-compass-thesaurus`

2. **Configure build settings:**
   - Build command: `npm install` (or leave empty)
   - Publish directory: `.` (root directory)
   - Netlify will automatically detect your `netlify.toml` configuration

3. **Set up environment variables:**
   - In Netlify dashboard: Site settings > Environment variables
   - Add: `OPENAI_API_KEY` = `your_actual_api_key_here`

4. **Deploy:**
   - Netlify will automatically deploy your site
   - The Netlify Functions will handle API calls securely

5. **Test your deployment:**
   - Visit your deployed site
   - Try searching for synonyms to ensure everything works

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required for Netlify Functions)

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