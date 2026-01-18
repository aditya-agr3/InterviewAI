import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with validation
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

// Cache the working model name to avoid repeated lookups
let cachedModelName: string | null = null;

// Get available model name - with fallback support
const getAvailableModel = (): string => {
  // If we've already found a working model, use it
  if (cachedModelName) {
    return cachedModelName;
  }

  // Default to gemini-1.5-flash (most widely available as of 2024)
  return 'gemini-1.5-flash';
};

// Set the working model name (called after successful API call)
const setWorkingModel = (modelName: string): void => {
  cachedModelName = modelName;
  console.log(`✓ Cached working model: ${modelName}`);
};

// Delay utility
const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry with exponential backoff for rate limit errors
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const errorMessage = error?.message || String(error) || '';
      const isRateLimit = errorMessage.includes('429') || 
                         errorMessage.includes('quota') ||
                         errorMessage.includes('Too Many Requests');
      
      if (isRateLimit && attempt < maxRetries - 1) {
        // Extract retry delay from error if available
        let retryDelay = baseDelay * Math.pow(2, attempt);
        
        // Try to extract retry delay from error message
        const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
        if (retryMatch) {
          retryDelay = Math.max(parseFloat(retryMatch[1]) * 1000, 1000);
        }
        
        console.log(`Rate limit hit, retrying in ${retryDelay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`);
        await delay(retryDelay);
        continue;
      }
      
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
};

// Try to list available models from the API
const listAvailableModels = async (genAI: GoogleGenerativeAI): Promise<string[]> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return [];
    
    // Use the REST API to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      console.log('Could not list models via API');
      return [];
    }
    
    const data = await response.json() as { models?: Array<{ name?: string }> };
    if (data.models && Array.isArray(data.models)) {
      const modelNames = data.models
        .map((m) => m.name?.replace('models/', '') || '')
        .filter((name: string) => name.length > 0);
      console.log('Available models from API:', modelNames);
      return modelNames;
    }
    
    return [];
  } catch (error) {
    console.log('Error listing models:', error);
    return [];
  }
};

/**
 * Generate interview questions based on job role, experience level, and tech stack
 */
export const generateInterviewQuestions = async (
  jobRole: string,
  experienceLevel: string,
  techStack: string[]
): Promise<string[]> => {
  try {
    const genAI = getGenAI();
    
    const prompt = `You are an expert technical interviewer. Generate 2 high-quality interview questions for a ${experienceLevel} level ${jobRole} position.

Tech Stack: ${techStack.join(', ')}

Requirements:
- Questions should be relevant to the role and experience level
- Mix of conceptual, practical, and problem-solving questions
- Questions should test both technical knowledge and problem-solving ability
- Format: Return ONLY a JSON array of question strings, no additional text

Example format:
["Question 1?", "Question 2?"]`;

    // Get model name (cached or default)
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });
    
    // Try to use the model, if it fails with 404, try alternatives
    try {
      // Use retry logic for rate limits
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text();
      
      // Success! Cache this model for future use
      setWorkingModel(modelName);
      
      // Parse JSON from response
      const jsonMatch = text.match(/\[.*\]/s);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return Array.isArray(questions) ? questions : [];
      }

      // Fallback: split by newlines if JSON parsing fails
      return text
        .split('\n')
        .filter((line) => line.trim().length > 0 && line.includes('?'))
        .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
        .slice(0, 2);
    } catch (modelError: any) {
      // Check if it's a 404/model not found error
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound = 
        errorMessage.includes('404') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        errorMessage.toLowerCase().includes('model') && errorMessage.includes('404');
      
      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        
        // Try to get list of available models from API
        const availableModels = await listAvailableModels(genAI);
        
        // Build list of alternatives to try
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        
        // If we got a list from API, prioritize those
        if (availableModels.length > 0) {
          // Filter to only include models that support generateContent
          const supportedModels = availableModels.filter((name: string) => 
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            // Remove duplicates
            alternatives = [...new Set(alternatives)];
          }
        }
        
        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            // Use retry logic for rate limits
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text();
            
            // Success with alternative model!
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);
            
            // Parse JSON from response
            const jsonMatch = text.match(/\[.*\]/s);
            if (jsonMatch) {
              const questions = JSON.parse(jsonMatch[0]);
              return Array.isArray(questions) ? questions : [];
            }

            // Fallback: split by newlines if JSON parsing fails
            return text
              .split('\n')
              .filter((line) => line.trim().length > 0 && line.includes('?'))
              .map((line) => line.replace(/^\d+[\.\)]\s*/, '').trim())
              .slice(0, 2);
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }
        
        // If all models failed, throw a helpful error
        throw new Error(`None of the available Gemini models are accessible. Please check your API key and model availability. Tried: ${modelName}, gemini-1.5-pro, gemini-pro`);
      } else {
        // Not a model not found error, rethrow
        throw modelError;
      }
    }
  } catch (error: any) {
    console.error('Error generating questions:', error);
    
    // Provide more specific error messages
    if (error?.message?.includes('API Key') || error?.message?.includes('403')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file');
    }
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please check your API usage limits');
    }
    
    throw new Error(`Failed to generate interview questions: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Generate a high-quality answer for an interview question
 */
export const generateAnswer = async (
  question: string,
  jobRole: string,
  experienceLevel: string,
  techStack: string[]
): Promise<string> => {
  try {
    const genAI = getGenAI();
    // Use cached model name
    const modelName = getAvailableModel();
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are an expert technical interviewer providing model answers. Generate a comprehensive, well-structured answer for this interview question.

Question: ${question}
Job Role: ${jobRole}
Experience Level: ${experienceLevel}
Tech Stack: ${techStack.join(', ')}

Requirements:
- Provide a clear, detailed answer
- Include code examples where relevant
- Explain concepts thoroughly
- Structure the answer with proper formatting
- Keep it professional and concise (300-500 words)
- Return ONLY the answer text, no prefixes or labels`;

    // Use retry logic for rate limits
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    return response.text().trim();
  } catch (error: any) {
    console.error('Error generating answer:', error);
    
    // Provide more specific error messages
    if (error?.message?.includes('API Key') || error?.message?.includes('403')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file');
    }
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please wait a moment and try again, or check your API usage limits');
    }
    
    throw new Error(`Failed to generate answer: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Generate a simplified AI explanation for a question/answer
 */
export const generateExplanation = async (
  question: string,
  answer: string
): Promise<string> => {
  try {
    const genAI = getGenAI();
    // Use cached model name
    const modelName = getAvailableModel();
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Explain this interview Q&A in a simple, easy-to-understand way. Break down complex concepts and provide examples.

Question: ${question}

Answer: ${answer}

Requirements:
- Simplify technical jargon
- Use analogies where helpful
- Provide practical examples
- Keep it concise (200-300 words)
- Make it beginner-friendly
- Return ONLY the explanation text, no prefixes or labels`;

    // Use retry logic for rate limits
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt);
    });
    
    const response = await result.response;
    return response.text().trim();
  } catch (error: any) {
    console.error('Error generating explanation:', error);
    
    // Provide more specific error messages
    if (error?.message?.includes('API Key') || error?.message?.includes('403')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API_KEY in .env file');
    }
    if (error?.message?.includes('quota') || error?.message?.includes('429')) {
      throw new Error('Gemini API quota exceeded. Please wait a moment and try again, or check your API usage limits');
    }
    
    throw new Error(`Failed to generate explanation: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Generate AI chat response about a document
 */
export const generateChatResponse = async (
  message: string,
  documentContent?: string,
  chatHistory: Array<{ role: string; content: string }> = []
): Promise<string> => {
  try {
    const genAI = getGenAI();
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });

    let prompt = `You are an AI assistant helping users understand documents. Answer questions based on the document content provided.\n\n`;

    if (documentContent) {
      prompt += `Document Content:\n${documentContent.substring(0, 10000)}\n\n`; // Limit to 10k chars
    }

    if (chatHistory.length > 0) {
      prompt += `Previous conversation:\n`;
      chatHistory.slice(-5).forEach((msg) => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
      prompt += `\n`;
    }

    prompt += `User question: ${message}\n\nAnswer the question based on the document content. If the answer isn't in the document, say so politely.`;

    // Try to use the model, if it fails with 404, try alternatives
    try {
      // Use retry logic for rate limits
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text().trim();
      
      // Success! Cache this model for future use
      setWorkingModel(modelName);
      
      return text;
    } catch (modelError: any) {
      // Check if it's a 404/model not found error
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound = 
        errorMessage.includes('404') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        (errorMessage.toLowerCase().includes('model') && errorMessage.includes('404'));
      
      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        
        // Try to get list of available models from API
        const availableModels = await listAvailableModels(genAI);
        
        // Build list of alternatives to try
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        
        // If we got a list from API, prioritize those
        if (availableModels.length > 0) {
          // Filter to only include models that support generateContent
          const supportedModels = availableModels.filter((name: string) => 
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            // Remove duplicates
            alternatives = [...new Set(alternatives)];
          }
        }
        
        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            // Use retry logic for rate limits
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text().trim();
            
            // Success with alternative model!
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);
            
            return text;
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }
        
        // If all models failed, throw a helpful error
        throw new Error(`None of the available Gemini models are accessible. Please check your API key and model availability. Tried: ${modelName}, ${alternatives.join(', ')}`);
      } else {
        // Not a model not found error, rethrow
        throw modelError;
      }
    }
  } catch (error: any) {
    console.error('Error generating chat response:', error);
    throw new Error(`Failed to generate chat response: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Generate document summary
 */
export const generateDocumentSummary = async (documentContent: string): Promise<string> => {
  try {
    const genAI = getGenAI();
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Summarize this document in a concise, well-structured format. Include key points, main topics, and important details.

Document Content:
${documentContent.substring(0, 20000)}

Requirements:
- Create a comprehensive summary (300-500 words)
- Organize with clear sections if applicable
- Highlight key concepts and takeaways
- Keep it professional and informative
- Return ONLY the summary text, no prefixes or labels`;

    try {
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text().trim();
      
      setWorkingModel(modelName);
      return text;
    } catch (modelError: any) {
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound = 
        errorMessage.includes('404') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        (errorMessage.toLowerCase().includes('model') && errorMessage.includes('404'));
      
      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        const availableModels = await listAvailableModels(genAI);
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        if (availableModels.length > 0) {
          const supportedModels = availableModels.filter((name: string) => 
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            alternatives = [...new Set(alternatives)];
          }
        }
        
        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text().trim();
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);
            return text;
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }
        throw new Error(`None of the available Gemini models are accessible. Tried: ${modelName}, ${alternatives.join(', ')}`);
      }
      throw modelError;
    }
  } catch (error: any) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Explain a concept from a document
 */
export const explainConcept = async (concept: string, documentContent: string): Promise<string> => {
  try {
    const genAI = getGenAI();
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Explain the concept "${concept}" based on the following document content. Provide a detailed, easy-to-understand explanation.

Document Content:
${documentContent.substring(0, 15000)}

Requirements:
- Explain the concept clearly and thoroughly
- Use examples from the document if available
- Break down complex ideas
- Keep it educational and accessible (400-600 words)
- Return ONLY the explanation text, no prefixes or labels`;

    try {
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text().trim();
      setWorkingModel(modelName);
      return text;
    } catch (modelError: any) {
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound = 
        errorMessage.includes('404') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        (errorMessage.toLowerCase().includes('model') && errorMessage.includes('404'));
      
      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        const availableModels = await listAvailableModels(genAI);
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        if (availableModels.length > 0) {
          const supportedModels = availableModels.filter((name: string) => 
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            alternatives = [...new Set(alternatives)];
          }
        }
        
        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text().trim();
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);
            return text;
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }
        throw new Error(`None of the available Gemini models are accessible. Tried: ${modelName}, ${alternatives.join(', ')}`);
      }
      throw modelError;
    }
  } catch (error: any) {
    console.error('Error explaining concept:', error);
    throw new Error(`Failed to explain concept: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Generate flashcards from document content
 */
export const generateFlashcards = async (documentContent: string, count: number = 10): Promise<Array<{ front: string; back: string }>> => {
  try {
    const genAI = getGenAI();
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Generate ${count} high-quality flashcards from this document. Each flashcard should have a question on the front and a detailed answer on the back.

Document Content:
${documentContent.substring(0, 20000)}

Requirements:
- Generate exactly ${count} flashcards
- Front: Clear, concise question
- Back: Detailed, informative answer
- Cover key concepts from the document
- Format: Return ONLY a JSON array, no additional text

Example format:
[{"front": "What is...?", "back": "It is..."}, {"front": "How does...?", "back": "It works by..."}]`;

    try {
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text().trim();
      setWorkingModel(modelName);
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const flashcards = JSON.parse(jsonMatch[0]);
        if (Array.isArray(flashcards) && flashcards.length > 0) {
          return flashcards.slice(0, count).map((card: any) => ({
            front: card.front || card.question || '',
            back: card.back || card.answer || '',
          }));
        }
      }
      throw new Error('Failed to parse flashcards from AI response');
    } catch (modelError: any) {
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound = 
        errorMessage.includes('404') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        (errorMessage.toLowerCase().includes('model') && errorMessage.includes('404'));
      
      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        const availableModels = await listAvailableModels(genAI);
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        if (availableModels.length > 0) {
          const supportedModels = availableModels.filter((name: string) => 
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            alternatives = [...new Set(alternatives)];
          }
        }
        
        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text().trim();
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);
            
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const flashcards = JSON.parse(jsonMatch[0]);
              if (Array.isArray(flashcards) && flashcards.length > 0) {
                return flashcards.slice(0, count).map((card: any) => ({
                  front: card.front || card.question || '',
                  back: card.back || card.answer || '',
                }));
              }
            }
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }
        throw new Error(`None of the available Gemini models are accessible. Tried: ${modelName}, ${alternatives.join(', ')}`);
      }
      throw modelError;
    }
  } catch (error: any) {
    console.error('Error generating flashcards:', error);
    throw new Error(`Failed to generate flashcards: ${error?.message || 'Unknown error'}`);
  }
};

/**
 * Generate quiz questions from document content
 */
export const generateQuizQuestions = async (
  documentContent: string,
  questionCount: number = 5
): Promise<Array<{ question: string; options: string[]; correctAnswer: number; explanation?: string }>> => {
  try {
    const genAI = getGenAI();
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Generate ${questionCount} multiple-choice quiz questions from this document. Each question should have 4 options with one correct answer.

Document Content:
${documentContent.substring(0, 20000)}

Requirements:
- Generate exactly ${questionCount} questions
- Each question must have exactly 4 options
- Mark the correct answer (0-3 index)
- Include brief explanations for each answer
- Cover important concepts from the document
- Format: Return ONLY a JSON array, no additional text

Example format:
[{"question": "What is...?", "options": ["Option A", "Option B", "Option C", "Option D"], "correctAnswer": 0, "explanation": "Because..."}]`;

    try {
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text().trim();
      setWorkingModel(modelName);
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(questions) && questions.length > 0) {
          return questions.slice(0, questionCount).map((q: any) => ({
            question: q.question || '',
            options: Array.isArray(q.options) ? q.options : [],
            correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
            explanation: q.explanation || '',
          }));
        }
      }
      throw new Error('Failed to parse quiz questions from AI response');
    } catch (modelError: any) {
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound = 
        errorMessage.includes('404') || 
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        (errorMessage.toLowerCase().includes('model') && errorMessage.includes('404'));
      
      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        const availableModels = await listAvailableModels(genAI);
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        if (availableModels.length > 0) {
          const supportedModels = availableModels.filter((name: string) => 
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            alternatives = [...new Set(alternatives)];
          }
        }
        
        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text().trim();
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);
            
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const questions = JSON.parse(jsonMatch[0]);
              if (Array.isArray(questions) && questions.length > 0) {
                return questions.slice(0, questionCount).map((q: any) => ({
                  question: q.question || '',
                  options: Array.isArray(q.options) ? q.options : [],
                  correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
                  explanation: q.explanation || '',
                }));
              }
            }
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }
        throw new Error(`None of the available Gemini models are accessible. Tried: ${modelName}, ${alternatives.join(', ')}`);
      }
      throw modelError;
    }
  } catch (error: any) {
    console.error('Error generating quiz questions:', error);
    throw new Error(`Failed to generate quiz questions: ${error?.message || 'Unknown error'}`);
  }
};

interface OutreachParams {
  platform: string;
  tone: string;
  relationship: string;
  length: string;
  jobDescription: string;
  resumeText: string;
  companyName?: string;
  roleTitle?: string;
  recruiterName?: string;
  senderName?: string;
}

const getLengthGuidance = (platform: string, length: string): string => {
  const normalized = platform.toLowerCase();
  const lengthKey = length.toLowerCase();

  if (normalized.includes('text')) {
    return lengthKey === 'short'
      ? 'Keep it under 220 characters.'
      : lengthKey === 'long'
      ? 'Keep it under 320 characters.'
      : 'Keep it under 260 characters.';
  }

  if (normalized.includes('linkedin')) {
    return lengthKey === 'short'
      ? 'Keep it 350-450 characters.'
      : lengthKey === 'long'
      ? 'Keep it 700-900 characters.'
      : 'Keep it 500-650 characters.';
  }

  return lengthKey === 'short'
    ? 'Keep it 120-160 words.'
    : lengthKey === 'long'
    ? 'Keep it 220-280 words.'
    : 'Keep it 170-210 words.';
};

export const generateOutreachMessages = async ({
  platform,
  tone,
  relationship,
  length,
  jobDescription,
  resumeText,
  companyName,
  roleTitle,
  recruiterName,
  senderName,
}: OutreachParams): Promise<string[]> => {
  try {
    const genAI = getGenAI();
    let modelName = getAvailableModel();
    let model = genAI.getGenerativeModel({ model: modelName });

    const lengthGuidance = getLengthGuidance(platform, length);
    const prompt = `You are a career coach writing outreach messages that feel human and specific.

Platform: ${platform}
Tone: ${tone}
Relationship: ${relationship}
Company: ${companyName || '[Company]'}
Role: ${roleTitle || '[Role]'}
Recruiter Name: ${recruiterName || '[Recruiter Name]'}
Sender Name: ${senderName || '[Your Name]'}

Job Description:
${jobDescription.substring(0, 6000)}

Resume:
${resumeText.substring(0, 6000)}

Requirements:
- Write 3 distinct messages for the selected platform.
- Highlight 1-2 relevant strengths from the resume that match the job description.
- Be specific, concise, and natural. Avoid buzzword-heavy or overly formal language.
- Do not sound AI-generated or generic. No phrases like "As an AI" or "I hope this message finds you well."
- ${lengthGuidance}
- If platform is Email, include a short subject line followed by the email body.
- Use placeholders like [Recruiter Name], [Company], [Role] when missing.
- Return ONLY a JSON array of strings, no extra text.

Example:
["Message 1...", "Message 2...", "Message 3..."]`;

    try {
      const result = await retryWithBackoff(async () => {
        return await model.generateContent(prompt);
      });
      const response = await result.response;
      const text = response.text().trim();
      setWorkingModel(modelName);

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const messages = JSON.parse(jsonMatch[0]);
        if (Array.isArray(messages) && messages.length > 0) {
          return messages.slice(0, 3).map((message: any) => String(message).trim());
        }
      }

      return text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .slice(0, 3);
    } catch (modelError: any) {
      const errorMessage = modelError?.message || String(modelError) || '';
      const isModelNotFound =
        errorMessage.includes('404') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('is not found for API version') ||
        (errorMessage.toLowerCase().includes('model') && errorMessage.includes('404'));

      if (isModelNotFound) {
        console.log(`Model ${modelName} not available, trying alternatives...`);
        const availableModels = await listAvailableModels(genAI);
        let alternatives = ['gemini-1.5-pro', 'gemini-pro'];
        if (availableModels.length > 0) {
          const supportedModels = availableModels.filter((name: string) =>
            !name.includes('embedding') && !name.includes('embed')
          );
          if (supportedModels.length > 0) {
            alternatives = [...supportedModels, ...alternatives];
            alternatives = [...new Set(alternatives)];
          }
        }

        for (const altModel of alternatives) {
          try {
            console.log(`Trying model: ${altModel}...`);
            model = genAI.getGenerativeModel({ model: altModel });
            const result = await retryWithBackoff(async () => {
              return await model.generateContent(prompt);
            });
            const response = await result.response;
            const text = response.text().trim();
            setWorkingModel(altModel);
            console.log(`✓ Successfully using model: ${altModel}`);

            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              const messages = JSON.parse(jsonMatch[0]);
              if (Array.isArray(messages) && messages.length > 0) {
                return messages.slice(0, 3).map((message: any) => String(message).trim());
              }
            }

            return text
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
              .slice(0, 3);
          } catch (altError: any) {
            const altErrorMessage = altError?.message || String(altError) || '';
            console.log(`Model ${altModel} also failed: ${altErrorMessage.substring(0, 100)}`);
            continue;
          }
        }

        throw new Error(`None of the available Gemini models are accessible. Tried: ${modelName}, ${alternatives.join(', ')}`);
      }

      throw modelError;
    }
  } catch (error: any) {
    console.error('Error generating outreach messages:', error);
    throw new Error(`Failed to generate outreach messages: ${error?.message || 'Unknown error'}`);
  }
};
