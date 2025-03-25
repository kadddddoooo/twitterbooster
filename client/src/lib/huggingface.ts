import axios from 'axios';
import { apiRequest } from './api';

// Types
export interface GenerationOptions {
  model?: string;
  prompt: string;
  maxLength?: number;
  temperature?: number;
  numResults?: number;
  stopSequences?: string[];
}

export interface GeneratedContent {
  text: string;
  model: string;
  finishReason: string;
}

// Constants
export const HUGGING_FACE_MODELS = {
  TEXT_GENERATION: "gpt2",
  TWEET_GENERATION: "drangoai/twitter-style-content-generator",
  CRYPTO_ANALYSIS: "EleutherAI/gpt-neo-1.3B"
};

// Default options
const defaultOptions = {
  model: HUGGING_FACE_MODELS.TEXT_GENERATION,
  maxLength: 280, // Twitter character limit
  temperature: 0.7,
  numResults: 1,
  stopSequences: []
};

/**
 * Generate content using Hugging Face API
 */
export async function generateContent(options: GenerationOptions): Promise<GeneratedContent | null> {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await apiRequest('/api/ai/generate', {
      method: 'POST',
      data: mergedOptions
    });
    
    return response as GeneratedContent;
  } catch (error) {
    console.error('Errore nella generazione del contenuto:', error);
    return null;
  }
}

/**
 * Generate a tweet based on topic and styles
 */
export async function generateTweet(topic: string, styles: string[] = ['viral']): Promise<string | null> {
  // Convert styles to a meaningful prompt
  let styleDescription = '';
  
  if (styles.includes('viral')) {
    styleDescription += 'virale e coinvolgente ';
  }
  
  if (styles.includes('professional')) {
    styleDescription += 'professionale e informativo ';
  }
  
  if (styles.includes('controversial')) {
    styleDescription += 'controverso e stimolante ';
  }
  
  if (styles.includes('educational')) {
    styleDescription += 'educativo e informativo ';
  }
  
  if (styles.includes('humorous')) {
    styleDescription += 'umoristico e divertente ';
  }
  
  // Build prompt
  const prompt = `Genera un tweet ${styleDescription}sul tema "${topic}" per Twitter. Il tweet deve essere rilevante, coinvolgente e includere hashtag appropriati:`;
  
  try {
    const content = await generateContent({
      model: HUGGING_FACE_MODELS.TWEET_GENERATION,
      prompt,
      maxLength: 280,
      temperature: 0.8
    });
    
    return content?.text || null;
  } catch (error) {
    console.error('Errore nella generazione del tweet:', error);
    return null;
  }
}

/**
 * Generate a thread of multiple tweets on a topic
 */
export async function generateThread(topic: string, tweetCount: number = 4): Promise<string[] | null> {
  const prompt = `Genera un thread Twitter di ${tweetCount} tweet sul tema "${topic}". I tweet devono essere collegati logicamente, informativi e coinvolgenti:`;
  
  try {
    const content = await generateContent({
      model: HUGGING_FACE_MODELS.TWEET_GENERATION,
      prompt,
      maxLength: 1000,
      temperature: 0.8
    });
    
    if (!content?.text) return null;
    
    // Split the content into separate tweets
    const tweets = content.text
      .split(/\n(?=\d+\.\s)/)
      .map(tweet => tweet.replace(/^\d+\.\s/, '').trim())
      .filter(tweet => tweet.length > 0 && tweet.length <= 280);
    
    return tweets.length > 0 ? tweets : null;
  } catch (error) {
    console.error('Errore nella generazione del thread:', error);
    return null;
  }
}

/**
 * Generate crypto market analysis
 */
export async function generateCryptoAnalysis(coin: string): Promise<string | null> {
  const prompt = `Analisi tecnica e fondamentale di ${coin} per il mercato crypto, incluse previsioni e pattern di trading:`;
  
  try {
    const content = await generateContent({
      model: HUGGING_FACE_MODELS.CRYPTO_ANALYSIS,
      prompt,
      maxLength: 500,
      temperature: 0.7
    });
    
    return content?.text || null;
  } catch (error) {
    console.error('Errore nella generazione dell\'analisi crypto:', error);
    return null;
  }
}
