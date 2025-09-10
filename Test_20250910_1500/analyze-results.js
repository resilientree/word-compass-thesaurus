#!/usr/bin/env node

import fs from 'fs';
import { table } from 'table';
import chalk from 'chalk';

// Load the most recent test results
const resultFiles = fs.readdirSync('.').filter(f => f.startsWith('test-results-')).sort().reverse();
const latestFile = resultFiles[0];

if (!latestFile) {
  console.error(chalk.red('No test results found!'));
  process.exit(1);
}

console.log(chalk.blue(`📊 Analyzing results from: ${latestFile}\n`));

const data = JSON.parse(fs.readFileSync(latestFile, 'utf8'));

// Group results by test case (word + scenario)
const testCases = {};
data.results.forEach(result => {
  const key = `${result.word} - ${result.scenario}`;
  if (!testCases[key]) {
    testCases[key] = {
      word: result.word,
      scenario: result.scenario,
      models: {}
    };
  }
  testCases[key].models[result.model] = result;
});

// Create comparison table
const models = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4o', 'gpt-4-turbo'];
const testCaseKeys = Object.keys(testCases).sort();

console.log(chalk.green.bold('🔍 Side-by-Side Model Comparison\n'));

testCaseKeys.forEach((key, index) => {
  const testCase = testCases[key];
  
  console.log(chalk.cyan.bold(`\n${index + 1}. ${testCase.word} (${testCase.scenario})`));
  console.log(chalk.gray('─'.repeat(80)));
  
  // Create table for this test case
  const tableData = [
    ['Model', 'Synonyms', 'Time (ms)', 'Success', 'Raw Response']
  ];
  
  models.forEach(model => {
    const result = testCase.models[model];
    if (result && result.success) {
      const synonyms = result.synonyms || [];
      const synonymList = synonyms.length > 0 ? synonyms.join(', ') : 'None';
      const truncatedList = synonymList.length > 60 ? synonymList.substring(0, 57) + '...' : synonymList;
      
      tableData.push([
        model,
        synonyms.length.toString(),
        result.responseTime.toString(),
        '✅',
        truncatedList
      ]);
    } else {
      tableData.push([
        model,
        '0',
        result ? result.responseTime.toString() : 'N/A',
        '❌',
        result ? result.error || 'Failed' : 'No data'
      ]);
    }
  });
  
  console.log(table(tableData, {
    header: {
      alignment: 'center',
      content: `${testCase.word} - ${testCase.scenario}`
    },
    columnDefault: {
      alignment: 'left'
    },
    columns: {
      0: { alignment: 'left', width: 15 },
      1: { alignment: 'center', width: 8 },
      2: { alignment: 'center', width: 10 },
      3: { alignment: 'center', width: 8 },
      4: { alignment: 'left', width: 40 }
    }
  }));
});

// Summary statistics
console.log(chalk.green.bold('\n📈 Summary Statistics\n'));

const summaryData = [
  ['Model', 'Total Tests', 'Success Rate', 'Avg Time', 'Avg Synonyms', 'Total Synonyms']
];

models.forEach(model => {
  const modelResults = data.results.filter(r => r.model === model);
  const successful = modelResults.filter(r => r.success);
  const successRate = (successful.length / modelResults.length * 100).toFixed(1);
  const avgTime = successful.length > 0 ? 
    Math.round(successful.reduce((sum, r) => sum + r.responseTime, 0) / successful.length) : 0;
  const avgSynonyms = successful.length > 0 ?
    Math.round(successful.reduce((sum, r) => sum + (r.synonyms?.length || 0), 0) / successful.length) : 0;
  const totalSynonyms = successful.reduce((sum, r) => sum + (r.synonyms?.length || 0), 0);
  
  summaryData.push([
    model,
    modelResults.length.toString(),
    `${successRate}%`,
    `${avgTime}ms`,
    avgSynonyms.toString(),
    totalSynonyms.toString()
  ]);
});

console.log(table(summaryData, {
  header: {
    alignment: 'center',
    content: 'Model Performance Summary'
  }
}));

// Detailed synonym comparison for specific words
console.log(chalk.green.bold('\n🔍 Detailed Synonym Comparison\n'));

const interestingWords = ['happy', 'beautiful', 'smart', 'mysterious', 'ephemeral'];
interestingWords.forEach(word => {
  const wordTests = testCaseKeys.filter(key => key.startsWith(word));
  if (wordTests.length > 0) {
    console.log(chalk.yellow.bold(`\n${word.toUpperCase()} - All Scenarios:`));
    
    wordTests.forEach(testKey => {
      const testCase = testCases[testKey];
      console.log(chalk.cyan(`\n  ${testCase.scenario}:`));
      
      models.forEach(model => {
        const result = testCase.models[model];
        if (result && result.success && result.synonyms) {
          console.log(chalk.gray(`    ${model}: [${result.synonyms.join(', ')}]`));
        }
      });
    });
  }
});

// Save organized results to file
const organizedResults = {
  timestamp: data.timestamp,
  testCases: testCases,
  summary: summaryData.slice(1).map(row => ({
    model: row[0],
    totalTests: parseInt(row[1]),
    successRate: parseFloat(row[2]),
    avgTime: parseInt(row[3]),
    avgSynonyms: parseInt(row[4]),
    totalSynonyms: parseInt(row[5])
  }))
};

const outputFile = `organized-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
fs.writeFileSync(outputFile, JSON.stringify(organizedResults, null, 2));

console.log(chalk.blue(`\n📁 Organized results saved to: ${outputFile}`));
console.log(chalk.gray('This file contains the data in a more structured format for further analysis.'));
