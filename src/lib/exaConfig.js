// EXA API Configuration
// For security, you should store your API key in environment variables
// and never commit it to version control

export const EXA_CONFIG = {
  apiUrl: 'https://api.exa.ai',
  // Add your EXA API key here or use environment variables
  // Get your API key from https://dashboard.exa.ai
  apiKey: import.meta.env.VITE_EXA_API_KEY || 'YOUR_EXA_API_KEY',
};

/**
 * Search using EXA API
 * @param {string} query - The search query
 * @param {object} options - Additional search options
 * @returns {Promise<object>} - Search results
 */
export async function searchExa(query, options = {}) {
  const {
    numResults = 10,
    type = 'auto',
    category = 'research paper',
    includeText = true,
    includeHighlights = true,
  } = options;

  try {
    const response = await fetch(`${EXA_CONFIG.apiUrl}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXA_CONFIG.apiKey,
      },
      body: JSON.stringify({
        query,
        numResults,
        type,
        category,
        contents: {
          text: includeText,
          highlights: includeHighlights,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`EXA API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results || [],
    };
  } catch (error) {
    console.error('Error searching with EXA:', error);
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
}

/**
 * Find similar links using EXA API
 * @param {string} url - The reference URL
 * @param {number} numResults - Number of results to return
 * @returns {Promise<object>} - Similar links
 */
export async function findSimilarLinks(url, numResults = 10) {
  try {
    const response = await fetch(`${EXA_CONFIG.apiUrl}/findSimilar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXA_CONFIG.apiKey,
      },
      body: JSON.stringify({
        url,
        numResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`EXA API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      results: data.results || [],
    };
  } catch (error) {
    console.error('Error finding similar links with EXA:', error);
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
}

/**
 * Get content from URLs using EXA API
 * @param {string[]} ids - Result IDs from previous search
 * @returns {Promise<object>} - Content data
 */
export async function getContents(ids) {
  try {
    const response = await fetch(`${EXA_CONFIG.apiUrl}/contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EXA_CONFIG.apiKey,
      },
      body: JSON.stringify({
        ids,
        text: true,
        highlights: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`EXA API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      contents: data.results || [],
    };
  } catch (error) {
    console.error('Error getting contents from EXA:', error);
    return {
      success: false,
      error: error.message,
      contents: [],
    };
  }
}

/**
 * Generate mock results for demo/testing purposes
 * @param {string} query - The search query
 * @returns {Array} - Mock search results
 */
export function generateMockResults(query) {
  const categories = ['book', 'article', 'research', 'blog', 'tutorial'];
  const domains = ['example.com', 'research.org', 'books.io', 'knowledge.net', 'learn.edu'];
  
  return Array.from({ length: 5 }, (_, i) => ({
    url: `https://${domains[i % domains.length]}/${query.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    title: `${query}: ${['Complete Guide', 'In-Depth Analysis', 'Comprehensive Overview', 'Practical Examples', 'Advanced Concepts'][i]}`,
    text: `This is a comprehensive ${categories[i % categories.length]} about ${query}. It covers fundamental concepts, practical applications, and advanced techniques. The content includes detailed explanations, real-world examples, and expert insights that will help you understand ${query} thoroughly. Whether you're a beginner or an experienced professional, this resource provides valuable information that you can apply immediately.`,
    publishedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    author: ['Dr. Jane Smith', 'Prof. John Doe', 'Sarah Johnson', 'Michael Chen', 'Emily Rodriguez'][i],
    score: 0.95 - i * 0.05,
  }));
}
