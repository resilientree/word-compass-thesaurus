# WordCompass.io

An AI-powered thesaurus that adapts to your style and context. Find the perfect word with intelligent synonym suggestions powered by OpenAI.

## 🌟 Features

### **Smart Word Discovery**
- **Thesaurus Mode**: Get 12-15 high-quality synonyms for any word
- **Creative Phrases**: Discover 2-4 word phrases that describe your concept
- **Context-Aware**: Add slang, regional dialects, or academic styles for targeted results

### **Model Selection**
- **Fast Mode**: Uses GPT-3.5-turbo for quick, cost-effective results
- **Thoughtful Mode**: Uses GPT-4o for higher quality, more nuanced suggestions

### **Advanced Controls** (Optional)
- **Era Slider**: Modern to historical language
- **Region Slider**: US to UK English variations
- **Rarity Slider**: Common to rare vocabulary
- **Emotion Slider**: Neutral to vivid expressions
- **Formality Slider**: Casual to formal tone
- **Sentiment Slider**: Negative to positive alternatives

### **Smart Features**
- **Find More**: Get additional synonyms without losing previous results
- **Visual Feedback**: Smooth animations and loading states
- **Copy to Clipboard**: Click any word to copy it instantly
- **Mobile Optimized**: Responsive design for all devices

## 🚀 Quick Start

1. **Enter a word** in the search box
2. **Add context** (optional): Try "Gen Z", "Old English", "Academic", etc.
3. **Choose your mode**: Thesaurus or Creative Phrases
4. **Select speed**: Fast (quick) or Thoughtful (quality)
5. **Click Find** to get your results!

## 💡 Usage Examples

- **Basic**: `money` → cash, currency, funds, capital...
- **With Context**: `money` + "Hip-hop culture" → bread, cheddar, paper, stacks...
- **Creative Phrases**: `money` → financial resources, economic capital, monetary assets...
- **Advanced**: Use sliders to fine-tune era, formality, and emotion

## 🛠️ Technical Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/resilientree/word-compass-thesaurus.git
cd word-compass-thesaurus

# Install dependencies
npm install

# Run locally with Netlify CLI
npm install -g netlify-cli
netlify dev
```

### Production Deployment (Netlify)
1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Set Environment Variables**: Add `OPENAI_API_KEY` in Netlify dashboard
3. **Deploy**: Netlify automatically deploys on git push

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Customization
- Modify `netlify/functions/synonyms.js` to adjust AI prompts
- Update `index.html` for UI changes
- Configure `netlify.toml` for deployment settings

## 🎯 Use Cases

- **Writers**: Find the perfect word for your story or article
- **Students**: Expand vocabulary with context-appropriate synonyms
- **Content Creators**: Adapt language for different audiences
- **Language Learners**: Understand word variations and usage
- **Professionals**: Choose appropriate tone for business communication

## 📱 Live Demo

Visit [wordcompass.netlify.app](https://wordcompass.netlify.app) to try it live!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.