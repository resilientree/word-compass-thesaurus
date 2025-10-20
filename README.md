# WordCompass.io

An AI-powered thesaurus that adapts to your style and context. Find the perfect word with intelligent synonym suggestions powered by OpenAI.

> **v1.2.0** - Now with Antonyms, Definitions toggle, and 3D Serendipity Sphere! 🌐

## 🌟 Features

### **Smart Word Discovery**
- **Synonyms & Antonyms**: Switch between similar and opposite words
- **Thesaurus Mode**: Get 12-15 high-quality synonyms for any word
- **Creative Phrases**: Discover 2-4 word phrases that describe your concept
- **Context-Aware**: Add slang, regional dialects, or academic styles for targeted results
- **Definitions**: Toggle to show brief definitions with your results

### **Model Selection**
- **Fast Mode**: Uses GPT-3.5-turbo for quick, cost-effective results
- **Thoughtful Mode**: Uses GPT-4o for higher quality, more nuanced suggestions

### **3D Visualization**
- **🌐 Serendipity Sphere**: Interactive 3D space to explore your words
- **Drag to rotate, scroll to zoom**: Intuitive 3D navigation
- **Same controls**: All toggles and sliders work in 3D mode

### **Advanced Controls** (Optional)
- **Era Slider**: Modern to historical language
- **Region Slider**: US to UK English variations
- **Rarity Slider**: Common to rare vocabulary
- **Emotion Slider**: Neutral to vivid expressions
- **Formality Slider**: Casual to formal tone
- **Sentiment Slider**: Negative to positive alternatives

### **Smart Features**
- **Find More**: Click Find again to add more words to your collection
- **Visual Feedback**: Smooth animations and loading states
- **Copy to Clipboard**: Click any word to copy it instantly
- **Mobile Optimized**: Responsive design for all devices

## 🚀 Quick Start

1. **Enter a word** in the search box
2. **Add context** (optional): Try "Gen Z", "Old English", "Academic", etc.
3. **Click Find** to get your results!
4. **Click Find again** to add more words to your collection
5. **Explore the 3D Sphere** (🌐) for a unique visual experience
6. **Use Preferences menu** (⚙️) to switch between Synonyms/Antonyms, Thesaurus/Creative Phrases, and more!

## 💡 Usage Examples

- **Basic**: `money` → cash, currency, funds, capital...
- **With Context**: `money` + "Hip-hop culture" → bread, cheddar, paper, stacks...
- **Antonyms**: `good` → bad, terrible, awful, horrible...
- **Creative Phrases**: `money` → financial resources, economic capital, monetary assets...
- **With Definitions**: `happy` → joyful (full of joy), elated (in high spirits), ecstatic (overwhelmingly happy)...
- **3D Sphere**: Visual exploration of your word relationships
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

Visit [wordcompass.io](https://wordcompass.io) to try it live!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.