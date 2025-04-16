import { elem } from "./FuzzyTableHelper";
import paginationUpdate from './FuzzyTablePagination.js';

/**
 * Creates a search input element for filtering table data using Jaro-Winkler similarity
 *
 * @param {Object} context - The FuzzyTable context
 * @returns {HTMLInputElement} - The created search input element
 */
export default function createSearchBox(context) {
    const label = elem('label', { className: context.classes.searchWrapper });

    const searchBox = elem('input', {
        type: 'search',
        id: 'fuzzy_search',
        placeholder: context.t?.search_placeholder ?? 'Search',
        className: context.classes.searchInput,
    });

    // Define similarity thresholds

    
    searchBox.oninput = () => filterAwareSearch(context);
    
    context.searchBox = searchBox;

    const iconContainer = elem('span', {
        className: context.classes.searchIcon,
        innerHTML: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>`
    });

    label.append(iconContainer, searchBox);
    return label;
}

export function filterAwareSearch(context) {
    const searchTerm = context.searchBox.value.trim();
    let tempTable = (searchTerm !== "") ? performJaroWinklerSearch(context, searchTerm) : context.data

    for (const filter of context.filters) {
        for (const option of filter.options.filter(option => option.active)) {
            tempTable = tempTable.filter((row) => {
                const match = option.value.test(row[filter.filterColumn]);
                option.active = true;
                return option.inverse ? !match : match;
            });
        }
    }

    context.table = tempTable
    context.currentPage = 0;
    context.updateTable();
    paginationUpdate(context);
}


/**
 * Performs a search using the Jaro-Winkler similarity algorithm
 * 
 * @param {Array} data
 * @param {string} searchTerm
 * @param {number} threshold - Minimum similarity score to be considered a match
 * @param {number} exactMatchBonus - Bonus score for substring matches
 * @param {number} prefixScale - Scaling factor for prefix matches
 * @returns {Array}
 */
function performJaroWinklerSearch(context, searchTerm) {
    const prefixScale = 0.1
    const threshold = context.config?.similarityThreshold || 0.9;
    const exactMatchBonus = context.config?.exactMatchBonus || 0.5;
    const searchTermLower = searchTerm.toLowerCase();
    const results = [];
    
    for (const row of context.data) {
        let bestScore = 0;
        let hasExactMatch = false;
        
        // Check each value in the row
        for (const value of Object.values(row)) {
            if (value == null) continue;
            
            const stringValue = String(value).toLowerCase();
            
            // Check for substring match
            if (stringValue.includes(searchTermLower)) {
                hasExactMatch = true;
                const positionScore = 1 - (stringValue.indexOf(searchTermLower) / stringValue.length);
                bestScore = Math.max(bestScore, 0.8 + (positionScore * 0.2));
            } 
            // For longer strings, check word by word
            else if (stringValue.length > searchTermLower.length) {
                const words = stringValue.split(/\s+/);
                for (const word of words) {
                    bestScore = Math.max(bestScore, calculateJaroWinkler(word, searchTermLower, prefixScale));
                }
            } 
            else {
                bestScore = Math.max(bestScore, calculateJaroWinkler(stringValue, searchTermLower, prefixScale));
            }
        }
        
        // Apply exact match bonus
        if (hasExactMatch) {
            bestScore = Math.min(bestScore + exactMatchBonus, 1);
        }
        
        if (bestScore >= threshold) {
            results.push({ item: row, score: bestScore });
        }
    }
    
    // Sort by score descending and return items only
    return results.sort((a, b) => b.score - a.score).map(result => result.item);
}

/**
 * Calculates the Jaro-Winkler similarity between two strings
 * 
 * @param {string} s1 - First string
 * @param {string} s2 - Second string
 * @param {number} prefixScale - Scaling factor for prefix matches (default: 0.1)
 * @return {number} - Similarity score between 0 and 1
 */
function calculateJaroWinkler(s1, s2, prefixScale = 0.1) {
    // Handle edge cases
    if (s1 === s2) return 1.0;
    if (!s1.length || !s2.length) return 0.0;

    // Calculate match window based on the longer string
    const matchDistance = Math.max(Math.floor(Math.max(s1.length, s2.length) / 2) - 1, 0);
    
    // Find matching characters within the window
    const s2Matched = new Array(s2.length).fill(false);
    const s1Matches = [];
    const s2Matches = [];
    
    for (let i = 0; i < s1.length; i++) {
        const start = Math.max(0, i - matchDistance);
        const end = Math.min(i + matchDistance + 1, s2.length);
        
        for (let j = start; j < end; j++) {
            if (!s2Matched[j] && s1[i] === s2[j]) {
                s1Matches.push(s1[i]);
                s2Matches.push(s2[j]);
                s2Matched[j] = true;
                break;
            }
        }
    }
    
    const matches = s1Matches.length;
    if (matches === 0) return 0.0;
    
    let transpositions = 0;
    for (let i = 0; i < matches; i++) {
        if (s1Matches[i] !== s2Matches[i]) {
            transpositions++;
        }
    }
    const jaroSimilarity = (
        matches / s1.length + 
        matches / s2.length + 
        (matches - transpositions / 2) / matches
    ) / 3;
    
    // Calculate common prefix length (up to 4 characters)
    let prefixLength = 0;
    const maxPrefixLength = 4;
    const minLength = Math.min(maxPrefixLength, s1.length, s2.length);
    
    for (let i = 0; i < minLength && s1[i] === s2[i]; i++) {
        prefixLength++;
    }
    
    // Apply prefix adjustment to Jaro similarity
    return jaroSimilarity + prefixLength * prefixScale * (1 - jaroSimilarity);
}