# WordCompass Model Testing Framework

This testing framework compares different OpenAI models to find the best one for your thesaurus application.

## 🎯 What It Tests

- **Success Rate**: How often each model returns valid JSON
- **Response Time**: Speed of API calls
- **Quality**: Number and relevance of synonyms
- **Cost vs Performance**: Balance between model cost and results

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd Test
   npm install
   ```

2. **Set up your API key:**
   ```bash
   # Copy your API key from the main project
   cp ../.env .env
   # Or edit Test/.env and add your key
   ```

3. **Run tests:**
   ```bash
   # Quick test (3 words, 2 scenarios per model)
   npm run test:quick
   
   # Detailed test (all words and scenarios)
   npm run test:detailed
   
   # Default (same as quick)
   npm test
   ```

## 📊 Models Tested

| Model | Cost | Description |
|-------|------|-------------|
| `gpt-4o-mini` | Low | Current model - fast and cheap |
| `gpt-3.5-turbo` | Low | Classic fast model |
| `gpt-4o` | Medium | Latest GPT-4, more capable |
| `gpt-4-turbo` | High | Most capable, expensive |

## 🧪 Test Scenarios

The framework tests each model with:

- **15 different words** (easy, medium, hard difficulty)
- **5 different scenarios** (Modern Casual, Historical Formal, UK Academic, Creative Vivid, Rare Negative)
- **Various slider combinations** to test parameter adherence

## 📈 What You'll Get

- **Performance comparison table**
- **Success rate analysis**
- **Response time metrics**
- **Cost vs performance recommendations**
- **Detailed JSON report** saved to file

## 💡 Example Output

```
🚀 Running Quick Model Comparison Test

Testing gpt-4o-mini...
  ✅ happy (Modern Casual): 12 synonyms, 1847ms
  ✅ beautiful (Modern Casual): 14 synonyms, 1923ms
  ✅ smart (Historical Formal): 11 synonyms, 1756ms

📊 Test Results Summary

┌─────────────────┬─────────────┬─────────────────┬─────────────┬────────────┐
│ Model           │ Success Rate│ Avg Response Time│ Avg Synonyms│ Cost Level │
├─────────────────┼─────────────┼─────────────────┼─────────────┼────────────┤
│ gpt-4o-mini     │ 100.0%      │ 1854ms          │ 12          │ low        │
│ gpt-3.5-turbo   │ 100.0%      │ 2103ms          │ 11          │ low        │
│ gpt-4o          │ 100.0%      │ 3245ms          │ 13          │ medium     │
│ gpt-4-turbo     │ 100.0%      │ 4567ms          │ 14          │ high       │
└─────────────────┴─────────────┴─────────────────┴─────────────┴────────────┘

💡 Recommendations:

🏆 Best Success Rate: gpt-4o-mini (100.0%)
⚡ Fastest Response: gpt-4o-mini (1854ms)
✅ Low-cost models perform well - consider staying with current model
```

## 🔧 Customization

You can modify:
- **Test words** in `test-data.js`
- **Test scenarios** in `test-data.js`
- **Models to test** in `test-models.js`
- **Evaluation criteria** in the code

## 📁 Output Files

- `test-results-[timestamp].json` - Detailed results for analysis
- Console output with real-time progress and summary

## ⚠️ Cost Warning

The detailed test makes many API calls. Monitor your OpenAI usage:
- Quick test: ~24 API calls
- Detailed test: ~300 API calls

Start with the quick test to get a feel for the results!
