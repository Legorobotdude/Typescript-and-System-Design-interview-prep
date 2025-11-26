/**
 * Test the Trie implementation
 * Run with: pnpm test:trie
 */

import { Trie, TrieWithCount, WildcardTrie } from '../data-structures/trie';

// ============================================================================
// Test 1: Basic Insert and Search
// ============================================================================
function testBasicInsertSearch() {
  console.log('\n=== Test 1: Basic Insert and Search ===');

  const trie = new Trie();

  trie.insert('apple');
  console.log('Inserted: "apple"');

  const found1 = trie.search('apple');
  const found2 = trie.search('app');

  console.log(`Search "apple": ${found1} (expected: true)`);
  console.log(`Search "app": ${found2} (expected: false - not inserted as complete word)`);

  const passed = found1 === true && found2 === false;
  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 2: Prefix Search (startsWith)
// ============================================================================
function testPrefixSearch() {
  console.log('\n=== Test 2: Prefix Search (startsWith) ===');

  const trie = new Trie();

  trie.insert('apple');
  trie.insert('application');
  trie.insert('app');

  console.log('Inserted: "apple", "application", "app"');

  const has1 = trie.startsWith('app');
  const has2 = trie.startsWith('appl');
  const has3 = trie.startsWith('banana');

  console.log(`startsWith "app": ${has1} (expected: true)`);
  console.log(`startsWith "appl": ${has2} (expected: true)`);
  console.log(`startsWith "banana": ${has3} (expected: false)`);

  const passed = has1 === true && has2 === true && has3 === false;
  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 3: LeetCode Example Test Case
// ============================================================================
function testLeetCodeExample() {
  console.log('\n=== Test 3: LeetCode Official Test Case ===');

  const trie = new Trie();
  const results: boolean[] = [];

  trie.insert('apple');
  results.push(trie.search('apple'));   // true
  results.push(trie.search('app'));     // false
  results.push(trie.startsWith('app')); // true
  trie.insert('app');
  results.push(trie.search('app'));     // true

  console.log('Operations: insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")');
  console.log(`Results: ${results.join(', ')}`);
  console.log('Expected: true, false, true, true');

  const passed =
    results[0] === true &&
    results[1] === false &&
    results[2] === true &&
    results[3] === true;

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 4: Multiple Words with Common Prefix
// ============================================================================
function testCommonPrefix() {
  console.log('\n=== Test 4: Multiple Words with Common Prefix ===');

  const trie = new Trie();

  const words = ['cat', 'cats', 'car', 'card', 'care', 'careful'];
  words.forEach(word => trie.insert(word));

  console.log(`Inserted: ${words.join(', ')}`);

  const test1 = trie.startsWith('ca');
  const test2 = trie.search('cat');
  const test3 = trie.search('cats');
  const test4 = trie.search('category'); // Not inserted

  console.log(`startsWith "ca": ${test1} (expected: true)`);
  console.log(`search "cat": ${test2} (expected: true)`);
  console.log(`search "cats": ${test3} (expected: true)`);
  console.log(`search "category": ${test4} (expected: false)`);

  const passed = test1 && test2 && test3 && !test4;
  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 5: Empty String and Single Character
// ============================================================================
function testEdgeCases() {
  console.log('\n=== Test 5: Edge Cases ===');

  const trie = new Trie();

  // Single character
  trie.insert('a');
  const test1 = trie.search('a');
  const test2 = trie.startsWith('a');

  console.log('Inserted: "a"');
  console.log(`search "a": ${test1} (expected: true)`);
  console.log(`startsWith "a": ${test2} (expected: true)`);

  // Empty trie
  const trie2 = new Trie();
  const test3 = trie2.search('anything');
  const test4 = trie2.startsWith('any');

  console.log('\nEmpty trie:');
  console.log(`search "anything": ${test3} (expected: false)`);
  console.log(`startsWith "any": ${test4} (expected: false)`);

  const passed = test1 && test2 && !test3 && !test4;
  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 6: Delete Operation
// ============================================================================
function testDelete() {
  console.log('\n=== Test 6: Delete Operation ===');

  const trie = new Trie();

  trie.insert('apple');
  trie.insert('app');
  trie.insert('application');

  console.log('Initial words: "apple", "app", "application"');

  // Delete 'app'
  const deleted1 = trie.delete('app');
  console.log(`\nDelete "app": ${deleted1} (expected: true)`);
  console.log(`search "app" after delete: ${trie.search('app')} (expected: false)`);
  console.log(`search "apple" still exists: ${trie.search('apple')} (expected: true)`);
  console.log(`startsWith "app" still works: ${trie.startsWith('app')} (expected: true)`);

  // Try to delete non-existent word
  const deleted2 = trie.delete('banana');
  console.log(`\nDelete "banana" (doesn't exist): ${deleted2} (expected: false)`);

  const passed =
    deleted1 === true &&
    trie.search('app') === false &&
    trie.search('apple') === true &&
    trie.startsWith('app') === true &&
    deleted2 === false;

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 7: Get All Words and Autocomplete
// ============================================================================
function testAutocomplete() {
  console.log('\n=== Test 7: Autocomplete (Get Words with Prefix) ===');

  const trie = new Trie();

  const words = ['apple', 'app', 'application', 'apply', 'banana', 'band'];
  words.forEach(word => trie.insert(word));

  console.log(`Dictionary: ${words.join(', ')}`);

  const appWords = trie.getWordsWithPrefix('app');
  console.log(`\nWords starting with "app": ${appWords.join(', ')}`);
  console.log('Expected: app, apple, application, apply');

  const banWords = trie.getWordsWithPrefix('ban');
  console.log(`Words starting with "ban": ${banWords.join(', ')}`);
  console.log('Expected: banana, band');

  const allWords = trie.getAllWords();
  console.log(`\nAll words: ${allWords.join(', ')}`);
  console.log(`Total count: ${trie.countWords()} (expected: 6)`);

  const passed =
    appWords.length === 4 &&
    banWords.length === 2 &&
    allWords.length === 6;

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 8: Trie with Word Count
// ============================================================================
function testTrieWithCount() {
  console.log('\n=== Test 8: Trie with Word Frequency ===');

  const trie = new TrieWithCount();

  // Insert some words multiple times
  trie.insert('hello');
  trie.insert('hello');
  trie.insert('hello');
  trie.insert('world');
  trie.insert('world');
  trie.insert('code');

  const count1 = trie.getCount('hello');
  const count2 = trie.getCount('world');
  const count3 = trie.getCount('code');
  const count4 = trie.getCount('notfound');

  console.log(`Count of "hello": ${count1} (expected: 3)`);
  console.log(`Count of "world": ${count2} (expected: 2)`);
  console.log(`Count of "code": ${count3} (expected: 1)`);
  console.log(`Count of "notfound": ${count4} (expected: 0)`);

  const mostFrequent = trie.getMostFrequentWords(2);
  console.log(`\nTop 2 most frequent: ${mostFrequent.map(w => `${w.word}(${w.count})`).join(', ')}`);

  const passed =
    count1 === 3 &&
    count2 === 2 &&
    count3 === 1 &&
    count4 === 0 &&
    mostFrequent[0].word === 'hello' &&
    mostFrequent[0].count === 3;

  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 9: Wildcard Search
// ============================================================================
function testWildcardSearch() {
  console.log('\n=== Test 9: Wildcard Search ===');

  const trie = new WildcardTrie();

  trie.insert('bad');
  trie.insert('dad');
  trie.insert('mad');

  console.log('Inserted: "bad", "dad", "mad"');

  const test1 = trie.searchWithWildcard('.ad');
  const test2 = trie.searchWithWildcard('b.d');
  const test3 = trie.searchWithWildcard('..d');
  const test4 = trie.searchWithWildcard('....');

  console.log(`searchWithWildcard ".ad": ${test1} (expected: true - matches bad, dad, mad)`);
  console.log(`searchWithWildcard "b.d": ${test2} (expected: true - matches bad)`);
  console.log(`searchWithWildcard "..d": ${test3} (expected: true - matches all)`);
  console.log(`searchWithWildcard "....": ${test4} (expected: false - no 4-letter words)`);

  const passed = test1 && test2 && test3 && !test4;
  console.log(passed ? '✓ PASSED' : '✗ FAILED');

  return passed;
}

// ============================================================================
// Test 10: Performance Test
// ============================================================================
function testPerformance() {
  console.log('\n=== Test 10: Performance (10,000 words) ===');

  const trie = new Trie();
  const words: string[] = [];

  // Generate random words
  for (let i = 0; i < 10000; i++) {
    const length = 5 + Math.floor(Math.random() * 10);
    let word = '';
    for (let j = 0; j < length; j++) {
      word += String.fromCharCode(97 + Math.floor(Math.random() * 26));
    }
    words.push(word);
  }

  // Insert
  const insertStart = Date.now();
  words.forEach(word => trie.insert(word));
  const insertTime = Date.now() - insertStart;

  // Search
  const searchStart = Date.now();
  let found = 0;
  words.forEach(word => {
    if (trie.search(word)) found++;
  });
  const searchTime = Date.now() - searchStart;

  console.log(`Inserted 10,000 words in ${insertTime}ms`);
  console.log(`Searched 10,000 words in ${searchTime}ms`);
  console.log(`Found: ${found}/10000`);
  console.log(`Total words in trie: ${trie.countWords()}`);

  console.log('✓ PASSED');
}

// ============================================================================
// Run All Tests
// ============================================================================
function runAllTests() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║           Trie Implementation Tests               ║');
  console.log('╚════════════════════════════════════════════════════╝');

  let passed = 0;
  let total = 0;

  try {
    if (testBasicInsertSearch()) passed++; total++;
    if (testPrefixSearch()) passed++; total++;
    if (testLeetCodeExample()) passed++; total++;
    if (testCommonPrefix()) passed++; total++;
    if (testEdgeCases()) passed++; total++;
    if (testDelete()) passed++; total++;
    if (testAutocomplete()) passed++; total++;
    if (testTrieWithCount()) passed++; total++;
    if (testWildcardSearch()) passed++; total++;

    testPerformance();

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log(`║  Tests Passed: ${passed}/${total}${' '.repeat(38 - passed.toString().length - total.toString().length)}║`);
    console.log('╚════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n✗ Test failed with error:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run if executed directly
if (require.main === module) {
  runAllTests();
}

export { runAllTests };
