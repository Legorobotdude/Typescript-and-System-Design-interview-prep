/**
 * Trie (Prefix Tree) Implementation
 *
 * A tree-like data structure for efficient string operations.
 * LeetCode #208 - Implement Trie (Prefix Tree)
 *
 * Use Cases:
 * - Autocomplete
 * - Spell checker
 * - IP routing (longest prefix matching)
 * - Dictionary implementation
 *
 * Time Complexity:
 * - Insert: O(m) where m = word length
 * - Search: O(m)
 * - StartsWith: O(m)
 *
 * Space Complexity: O(ALPHABET_SIZE * m * n)
 * where n = number of words, m = average word length
 */

// ============================================================================
// TRIE NODE
// ============================================================================

class TrieNode {
  children: Map<string, TrieNode>;
  isEndOfWord: boolean;

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

// ============================================================================
// TRIE IMPLEMENTATION
// ============================================================================

class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert a word into the trie
   * TODO(human): Implement this method
   */
  insert(word: string): void {
    // TODO(human): Implement this method
    // 1. Start at root
    // 2. For each character in word:
    //    - If character doesn't exist in current node's children, create new TrieNode
    //    - Move to that child node
    // 3. Mark the last node as end of word

    throw new Error("Not implemented");
  }

  /**
   * Search for an exact word in the trie
   * TODO(human): Implement this method
   */
  search(word: string): boolean {
    // TODO(human): Implement this method
    // 1. Start at root
    // 2. For each character in word:
    //    - If character doesn't exist in current node's children, return false
    //    - Move to that child node
    // 3. After traversing all characters, check if current node is marked as end of word

    throw new Error("Not implemented");
  }

  /**
   * Check if there's any word in the trie that starts with the given prefix
   * TODO(human): Implement this method
   */
  startsWith(prefix: string): boolean {
    // TODO(human): Implement this method
    // 1. Start at root
    // 2. For each character in prefix:
    //    - If character doesn't exist in current node's children, return false
    //    - Move to that child node
    // 3. If we successfully traverse all characters, return true

    throw new Error("Not implemented");
  }

  /**
   * Delete a word from the trie
   * More advanced - shows understanding of recursion and cleanup
   */
  delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  private deleteHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      // Base case: reached end of word
      if (!node.isEndOfWord) {
        return false; // Word doesn't exist
      }
      node.isEndOfWord = false;

      // Delete node if it has no children
      return node.children.size === 0;
    }

    const char = word[index];
    const childNode = node.children.get(char);

    if (!childNode) {
      return false; // Word doesn't exist
    }

    const shouldDeleteChild = this.deleteHelper(childNode, word, index + 1);

    if (shouldDeleteChild) {
      node.children.delete(char);
      // Return true if no children and not end of another word
      return node.children.size === 0 && !node.isEndOfWord;
    }

    return false;
  }

  /**
   * Get all words in the trie
   */
  getAllWords(): string[] {
    const words: string[] = [];
    this.collectWords(this.root, "", words);
    return words;
  }

  private collectWords(node: TrieNode, prefix: string, words: string[]): void {
    if (node.isEndOfWord) {
      words.push(prefix);
    }

    for (const [char, childNode] of node.children) {
      this.collectWords(childNode, prefix + char, words);
    }
  }

  /**
   * Get all words with a given prefix (autocomplete)
   */
  getWordsWithPrefix(prefix: string): string[] {
    const words: string[] = [];
    let current = this.root;

    // Navigate to the prefix
    for (const char of prefix) {
      const child = current.children.get(char);
      if (!child) {
        return []; // Prefix doesn't exist
      }
      current = child;
    }

    // Collect all words from this point
    this.collectWords(current, prefix, words);
    return words;
  }

  /**
   * Count total number of words in the trie
   */
  countWords(): number {
    return this.countWordsHelper(this.root);
  }

  private countWordsHelper(node: TrieNode): number {
    let count = node.isEndOfWord ? 1 : 0;

    for (const childNode of node.children.values()) {
      count += this.countWordsHelper(childNode);
    }

    return count;
  }

  /**
   * Check if trie is empty
   */
  isEmpty(): boolean {
    return this.root.children.size === 0;
  }

  /**
   * Clear all words from trie
   */
  clear(): void {
    this.root = new TrieNode();
  }
}

// ============================================================================
// ADVANCED: Trie with Word Count (for frequency analysis)
// ============================================================================

class TrieNodeWithCount extends TrieNode {
  count: number = 0; // How many times this word was inserted
}

class TrieWithCount {
  private root: TrieNodeWithCount;

  constructor() {
    this.root = new TrieNodeWithCount();
  }

  insert(word: string): void {
    let current = this.root;

    for (const char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNodeWithCount());
      }
      current = current.children.get(char) as TrieNodeWithCount;
    }

    current.isEndOfWord = true;
    current.count++;
  }

  getCount(word: string): number {
    let current = this.root;

    for (const char of word) {
      const child = current.children.get(char);
      if (!child) return 0;
      current = child as TrieNodeWithCount;
    }

    return current.isEndOfWord ? current.count : 0;
  }

  getMostFrequentWords(limit: number = 10): Array<{ word: string; count: number }> {
    const words: Array<{ word: string; count: number }> = [];
    this.collectWordsWithCount(this.root as TrieNodeWithCount, "", words);

    // Sort by count descending
    words.sort((a, b) => b.count - a.count);

    return words.slice(0, limit);
  }

  private collectWordsWithCount(
    node: TrieNodeWithCount,
    prefix: string,
    words: Array<{ word: string; count: number }>
  ): void {
    if (node.isEndOfWord) {
      words.push({ word: prefix, count: node.count });
    }

    for (const [char, childNode] of node.children) {
      this.collectWordsWithCount(
        childNode as TrieNodeWithCount,
        prefix + char,
        words
      );
    }
  }
}

// ============================================================================
// ADVANCED: Wildcard Search Trie
// ============================================================================

class WildcardTrie extends Trie {
  /**
   * Search with wildcard '.' matching any character
   * Example: "a.c" matches "abc", "adc", "aec", etc.
   */
  searchWithWildcard(word: string): boolean {
    return this.searchWildcardHelper(this['root'], word, 0);
  }

  private searchWildcardHelper(node: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      return node.isEndOfWord;
    }

    const char = word[index];

    if (char === '.') {
      // Try all possible children
      for (const childNode of node.children.values()) {
        if (this.searchWildcardHelper(childNode, word, index + 1)) {
          return true;
        }
      }
      return false;
    } else {
      const childNode = node.children.get(char);
      if (!childNode) return false;
      return this.searchWildcardHelper(childNode, word, index + 1);
    }
  }
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

// Example 1: Basic autocomplete
const autocomplete = new Trie();
autocomplete.insert("apple");
autocomplete.insert("app");
autocomplete.insert("application");

// Example 2: Dictionary with word frequency
const dictionary = new TrieWithCount();
dictionary.insert("hello");
dictionary.insert("hello");
dictionary.insert("world");

// Example 3: Wildcard search
const wildcardSearch = new WildcardTrie();
wildcardSearch.insert("bad");
wildcardSearch.insert("dad");
wildcardSearch.insert("mad");

export { Trie, TrieWithCount, WildcardTrie };
