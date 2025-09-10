#!/usr/bin/env node

import { OpenAI } from 'openai';
import { testWords, testScenarios, expectedCriteria } from './test-data.js';
import chalk from 'chalk/index.js';
import { table } from 'table';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Models to test (from cheapest to most expensive)
const models = [
  { name: 'gpt-4o-mini', cost: 'low', description: 'Current model - fast and cheap' },
  { name: 'gpt-3.5-turbo', cost: 'low', description: 'Classic fast model' },
  { name: 'gpt-4o', cost: 'medium', description: 'Latest GPT-4, more capable' },
  { name: 'gpt-4-turbo', cost: 'high', description: 'Most capable, expensive' }
];

class ModelTester {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.results = [];
  }

  async testModel(modelName, word, scenario) {
    const system = `You are an assistant that returns synonyms tuned by metadata sliders. Return ONLY a JSON array of strings, with no additional text or formatting. Example: ["word1", "word2", "word3"]

Slider Definitions:
- Era (0-100): 0 = modern/contemporary words, 100 = historical/archaic words
- Region (0-100): 0 = American English, 100 = British English
- Rarity (0-100): 0 = common/everyday words, 100 = rare/unusual words
- Emotion (0-100): 0 = neutral/plain words, 100 = emotionally vivid/expressive words
- Formality (0-100): 0 = casual/informal words, 100 = formal/professional words
- Sentiment (0-100): 0 = negative words, 100 = positive words

Return 12-15 high-quality synonyms that match the specified parameters.`;

    const user = `Word: "${word}"
Era slider ${scenario.settings.era} (0=modern,100=historical)
Region slider ${scenario.settings.region} (0=US,100=UK)
Rarity slider ${scenario.settings.rarity} (0=common,100=rare)
Emotion slider ${scenario.settings.emotion} (0=neutral,100=vivid)
Formality slider ${scenario.settings.formality} (0=casual,100=formal)
Sentiment slider ${scenario.settings.sentiment} (0=negative,100=positive)`;

    const startTime = Date.now();
    
    try {
      const response = await this.openai.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      const content = response.choices[0].message.content;
      let synonyms = [];
      
      try {
        synonyms = JSON.parse(content);
        if (!Array.isArray(synonyms)) {
          throw new Error('Response is not an array');
        }
      } catch (parseError) {
        console.warn(chalk.yellow(`Parse error for ${modelName}: ${parseError.message}`));
        synonyms = [];
      }

      return {
        success: true,
        synonyms,
        responseTime,
        tokenUsage: response.usage,
        rawResponse: content
      };
    } catch (error) {
      const endTime = Date.now();
      return {
        success: false,
        error: error.message,
        responseTime: endTime - startTime,
        synonyms: []
      };
    }
  }

  async runQuickTest() {
    console.log(chalk.blue.bold('\n🚀 Running Quick Model Comparison Test\n'));
    
    const quickWords = testWords.slice(0, 3); // Test first 3 words
    const quickScenarios = testScenarios.slice(0, 2); // Test first 2 scenarios
    
    for (const model of models) {
      console.log(chalk.cyan(`\nTesting ${model.name}...`));
      
      for (const wordData of quickWords) {
        for (const scenario of quickScenarios) {
          const result = await this.testModel(model.name, wordData.word, scenario);
          
          this.results.push({
            model: model.name,
            word: wordData.word,
            scenario: scenario.name,
            ...result
          });
          
          if (result.success) {
            console.log(chalk.green(`  ✅ ${wordData.word} (${scenario.name}): ${result.synonyms.length} synonyms, ${result.responseTime}ms`));
          } else {
            console.log(chalk.red(`  ❌ ${wordData.word} (${scenario.name}): ${result.error}`));
          }
        }
      }
    }
  }

  async runDetailedTest() {
    console.log(chalk.blue.bold('\n🔬 Running Detailed Model Comparison Test\n'));
    
    for (const model of models) {
      console.log(chalk.cyan(`\nTesting ${model.name} (${model.description})...`));
      
      for (const wordData of testWords) {
        for (const scenario of testScenarios) {
          const result = await this.testModel(model.name, wordData.word, scenario);
          
          this.results.push({
            model: model.name,
            word: wordData.word,
            scenario: scenario.name,
            difficulty: wordData.difficulty,
            category: wordData.category,
            ...result
          });
          
          if (result.success) {
            console.log(chalk.green(`  ✅ ${wordData.word} (${scenario.name}): ${result.synonyms.length} synonyms, ${result.responseTime}ms`));
          } else {
            console.log(chalk.red(`  ❌ ${wordData.word} (${scenario.name}): ${result.error}`));
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
  }

  generateReport() {
    console.log(chalk.blue.bold('\n📊 Test Results Summary\n'));
    
    // Success rate by model
    const modelStats = {};
    models.forEach(model => {
      const modelResults = this.results.filter(r => r.model === model.name);
      const successful = modelResults.filter(r => r.success);
      
      modelStats[model.name] = {
        total: modelResults.length,
        successful: successful.length,
        successRate: (successful.length / modelResults.length * 100).toFixed(1),
        avgResponseTime: successful.length > 0 ? 
          Math.round(successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length) : 0,
        avgSynonyms: successful.length > 0 ?
          Math.round(successful.reduce((sum, r) => sum + r.synonyms.length, 0) / successful.length) : 0
      };
    });

    // Create summary table
    const tableData = [
      ['Model', 'Success Rate', 'Avg Response Time', 'Avg Synonyms', 'Cost Level']
    ];

    models.forEach(model => {
      const stats = modelStats[model.name];
      tableData.push([
        model.name,
        `${stats.successRate}%`,
        `${stats.avgResponseTime}ms`,
        stats.avgSynonyms.toString(),
        model.cost
      ]);
    });

    console.log(table(tableData, {
      header: {
        alignment: 'center',
        content: 'Model Performance Summary'
      }
    }));

    // Detailed analysis
    console.log(chalk.yellow.bold('\n🔍 Detailed Analysis:\n'));
    
    models.forEach(model => {
      const stats = modelStats[model.name];
      console.log(chalk.cyan(`${model.name}:`));
      console.log(`  Success Rate: ${stats.successRate}%`);
      console.log(`  Average Response Time: ${stats.avgResponseTime}ms`);
      console.log(`  Average Synonyms per Request: ${stats.avgSynonyms}`);
      console.log(`  Cost Level: ${model.cost}`);
      console.log(`  Description: ${model.description}\n`);
    });

    // Recommendations
    console.log(chalk.green.bold('\n💡 Recommendations:\n'));
    
    const bestSuccess = Object.entries(modelStats)
      .sort((a, b) => parseFloat(b[1].successRate) - parseFloat(a[1].successRate))[0];
    
    const fastest = Object.entries(modelStats)
      .filter(([_, stats]) => stats.successful > 0)
      .sort((a, b) => a[1].avgResponseTime - b[1].avgResponseTime)[0];
    
    console.log(`🏆 Best Success Rate: ${bestSuccess[0]} (${bestSuccess[1].successRate}%)`);
    console.log(`⚡ Fastest Response: ${fastest[0]} (${fastest[1].avgResponseTime}ms)`);
    
    // Cost vs Performance analysis
    const lowCostModels = models.filter(m => m.cost === 'low');
    const lowCostStats = lowCostModels.map(m => modelStats[m.name]);
    
    if (lowCostStats.some(s => parseFloat(s.successRate) > 90)) {
      console.log(chalk.green('✅ Low-cost models perform well - consider staying with current model'));
    } else {
      console.log(chalk.yellow('⚠️  Consider upgrading to a higher-cost model for better performance'));
    }
  }

  async saveDetailedResults() {
    const fs = await import('fs');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test-results-${timestamp}.json`;
    
    const report = {
      timestamp: new Date().toISOString(),
      models: models.map(m => ({ name: m.name, cost: m.cost, description: m.description })),
      testData: { words: testWords.length, scenarios: testScenarios.length },
      results: this.results,
      summary: this.generateSummaryStats()
    };
    
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(chalk.blue(`\n📁 Detailed results saved to: ${filename}`));
  }

  generateSummaryStats() {
    const modelStats = {};
    models.forEach(model => {
      const modelResults = this.results.filter(r => r.model === model.name);
      const successful = modelResults.filter(r => r.success);
      
      modelStats[model.name] = {
        totalTests: modelResults.length,
        successfulTests: successful.length,
        successRate: successful.length / modelResults.length * 100,
        avgResponseTime: successful.length > 0 ? 
          successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length : 0,
        avgSynonyms: successful.length > 0 ?
          successful.reduce((sum, r) => sum + r.synonyms.length, 0) / successful.length : 0
      };
    });
    
    return modelStats;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const isQuick = args.includes('--quick');
  const isDetailed = args.includes('--detailed');
  
  if (!process.env.OPENAI_API_KEY) {
    console.error(chalk.red('❌ OPENAI_API_KEY not found in environment variables'));
    console.log('Please set your OpenAI API key in the .env file');
    process.exit(1);
  }

  const tester = new ModelTester();
  
  try {
    if (isQuick) {
      await tester.runQuickTest();
    } else if (isDetailed) {
      await tester.runDetailedTest();
    } else {
      // Default: run quick test
      await tester.runQuickTest();
    }
    
    tester.generateReport();
    await tester.saveDetailedResults();
    
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    process.exit(1);
  }
}

main();
