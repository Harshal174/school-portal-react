// src/api/geminiAPI.js

/**
 * A helper function to call the Gemini API for text generation.
 * @param {string} prompt - The text prompt to send to the model.
 * @returns {Promise<string>} - A promise that resolves to the generated text.
 * @throws {Error} - Throws an error if the API call fails or the response is invalid.
 */
export const callGeminiAPI = async (prompt) => {
    try {
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };
        const apiKey = ""; // API key is handled by the environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API call failed with status: ${response.status}. Body: ${errorBody}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error('Invalid API response structure:', result);
            throw new Error('Unexpected API response structure');
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Re-throw the error to be caught by the calling component
        throw error;
    }
};
