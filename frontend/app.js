// Word Count Analyzer - Frontend Application

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        analyzeText(text);
    };
    reader.readAsText(file);
}

function analyzeText(text) {
    // Convert to lowercase and remove punctuation
    const cleanText = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    // Calculate statistics
    const totalWords = words.length;
    const uniqueWords = new Set(words).size;
    const totalChars = text.replace(/\s/g, '').length;
    
    // Count word frequencies
    const wordFreq = {};
    words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
    });
    
    // Sort and get top 10 words
    const sortedWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    // Update UI
    displayResults({
        totalWords,
        uniqueWords,
        totalChars,
        wordFreq,
        topWords: sortedWords
    });
}

function displayResults(data) {
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Update statistics
    document.getElementById('totalWords').textContent = data.totalWords.toLocaleString();
    document.getElementById('uniqueWords').textContent = data.uniqueWords.toLocaleString();
    document.getElementById('totalChars').textContent = data.totalChars.toLocaleString();
    
    // Create chart
    createChart(data.topWords);
    
    // Create table
    createTable(data);
}

function createChart(topWords) {
    const maxCount = topWords[0]?.[1] || 1;
    const chartHTML = topWords.map(([word, count]) => {
        const percentage = (count / maxCount) * 100;
        return `<div class="chart-bar" style="height: ${percentage}%;"><div class="chart-bar-label">${word}</div></div>`;
    }).join('');
    
    document.getElementById('wordChart').innerHTML = chartHTML;
}

function createTable(data) {
    const sortedEntries = Object.entries(data.wordFreq)
        .sort((a, b) => b[1] - a[1]);
    
    const tableBody = sortedEntries.map(([word, count]) => {
        const percentage = ((count / data.totalWords) * 100).toFixed(2);
        return `
            <tr>
                <td>${word}</td>
                <td>${count}</td>
                <td>${percentage}%</td>
            </tr>
        `;
    }).join('');
    
    document.getElementById('tableBody').innerHTML = tableBody;
}

// Allow Enter key to trigger upload
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                uploadFile();
            }
        });
    }
});
