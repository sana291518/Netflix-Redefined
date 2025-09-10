import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useSpring, animated } from 'react-spring';

// -- Netflix-style Intro Messages --
const INTRO_MESSAGES = [
  "Heyyy!!! I am Trellis.",
  "The name Trellis is all about that supportive vibe. Think of it as your digital bestie, here to help your entertainment interests totally blossom and grow.",
  "How can I help you today?"
];

// --- Utility functions for parsing user intent --
const extractShowName = (input) => {
  const plotMatch = input.match(/plot of ([\w\s]+)/i);
  if (plotMatch) return plotMatch[1].trim();
  const reviewMatch = input.match(/reviews? for ([\w\s]+)/i);
  if (reviewMatch) return reviewMatch[1].trim();
  const triviaMatch = input.match(/trivia (about|for) ([\w\s]+)/i);
  if (triviaMatch) return triviaMatch[2].trim();
  const showMatch = input.match(/(?:movie|show|series)\s*['"]?([\w\s]+)['"]?/i);
  if (showMatch) return showMatch[1].trim();
  return null;
};

const extractActors = (input) => {
  // Remove leading question/context so we can just analyze names
  let cleaned = input.replace(/^Did\s+/i, '')
                     .replace(/(star|starring|act(?:ed)?|appear(?:ed)?|play|perform)[^\w]*/gi, '')
                     .replace(/together|on netflix|\?/gi, '');
  // Now look for exactly "Name and Name"
  const andPattern = /([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\s+and\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b/;
  const match = cleaned.match(andPattern);
  if (match) return [match[1].trim(), match[2].trim()];
  // Fallback: pick first two full capitalized names only
  const regex = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)\b/g;
  let found = [];
  let m;
  while ((m = regex.exec(cleaned)) !== null) found.push(m[1].trim());
  return [...new Set(found)].slice(0, 2);
};


const extractKeywords = (input) => {
  const lower = input.toLowerCase();
  let genre = null;
  let mood = null;
  if (lower.includes('romantic')) genre = 'romantic';
  else if (lower.includes('comedy')) genre = 'comedy';
  else if (lower.includes('thriller')) genre = 'thriller';
  if (lower.includes('date night')) mood = 'date night';
  return { genre, mood };
};

const wantsActorDetails = (input) => {
  const lower = input.toLowerCase();
  return (
    lower.includes('age') ||
    lower.includes('how old') ||
    lower.includes(' old') ||
    lower.includes('biography') ||
    lower.includes('bio') ||
    lower.includes('tell me about')
  );
};

// --- Main Trellis Chatbox UI ---
const TrellisChatbox = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingMessage, setTypingMessage] = useState('');
  const [introComplete, setIntroComplete] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatboxRef = useRef(null);
  const inputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // ---- Typewriter intro effect ----
  useEffect(() => {
    if (typingIndex < INTRO_MESSAGES.length) {
      const fullMessage = INTRO_MESSAGES[typingIndex];
      let currentCharIndex = 0;
      setTypingMessage('');
      const interval = setInterval(() => {
        setTypingMessage(fullMessage.slice(0, currentCharIndex + 1));
        currentCharIndex++;
        if (currentCharIndex === fullMessage.length) {
          clearInterval(interval);
          setTimeout(() => {
            addMessage({ text: fullMessage, sender: 'bot' });
            setTypingMessage('');
            setTypingIndex(idx => idx + 1);
          }, 600);
        }
      }, 35);
      return () => clearInterval(interval);
    } else if (typingIndex === INTRO_MESSAGES.length && !introComplete) {
      setIntroComplete(true);
    }
  }, [typingIndex]);

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [messages, typingMessage]);

  useEffect(() => { if (!isLoading) inputRef.current?.focus(); }, [isLoading]);

  // --- Speech-to-text handling ---
  const isSpeechRecognitionSupported =
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  useEffect(() => {
    if (isSpeechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onstart = () => { setIsListening(true); setIsLoading(true); };
      recognitionRef.current.onresult = (event) => sendMessage(event.results[0][0].transcript);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => {
        setIsListening(false); setIsLoading(false); addMessage({ text: 'Voice input failed. Please try typing.', sender: 'bot' });
      };
    }
  }, [isSpeechRecognitionSupported]);

  // --- Add a new chat message ---
  const addMessage = (message) => { setMessages(prev => [...prev, message]); };

  // --- Handle sending and parsing logic for queries ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !introComplete) return;
    await sendMessage(inputMessage);
  };

  const sendMessage = async (text) => {
  addMessage({ text, sender: 'user' });
  setInputMessage('');
  setIsLoading(true);
  try {
    // Parse slots
    const actors = extractActors(text);
    const actor = actors.length === 1 ? actors[0] : null;
    const actor1 = actors.length === 2 ? actors[0] : null;
    const actor2 = actors.length === 2 ? actors[1] : null;
    const show_name = extractShowName(text);
// Determine infoType for show_details
let infoType = null;
if (/trivia/i.test(text)) infoType = 'trivia';
else if (/review/i.test(text)) infoType = 'review';
else if (/plot|synopsis|summary/i.test(text)) infoType = 'plot';
// Only set info="all" if asking for multiple types or if prompt is ambiguous
else if (/about|details|tell me/i.test(text)) infoType = 'all';
const isShowDetailsQuery = !!show_name && infoType != null;


    const { genre, mood } = extractKeywords(text);
    const includeDetails = actor ? wantsActorDetails(text) : false;

    // INTENT LOGIC:
    const isCoActorQuery = actors.length === 2 && /together|with|co-star|coact|both|appear|star|starring|acted|acting|play|perform/i.test(text);
    const isSingleActorQuery = actor && wantsActorDetails(text);
    // If all else fails, default to recommend
    const isRecommendQuery = !(isCoActorQuery || isSingleActorQuery || isShowDetailsQuery);

    // Backend Calls
    const queries = [
      isRecommendQuery
        ? axios.get('http://localhost:8000/skills/recommend/recommend', { params: { actor, genre, mood } })
        : Promise.resolve({ data: {} }),
      isSingleActorQuery
        ? axios.get('http://localhost:8000/skills/actor_info/actor_info', { params: { name: actor, include_details: includeDetails } })
        : Promise.resolve({ data: {} }),
      isCoActorQuery
        ? axios.get('http://localhost:8000/skills/co_actor/co_actor', { params: { actor1, actor2 } })
        : Promise.resolve({ data: {} }),
     isShowDetailsQuery
  ? axios.get('http://localhost:8000/skills/show_details/show_details', { params: { show_name, info: infoType } })
  : Promise.resolve({ data: {} }),

    ];

    const results = await Promise.allSettled(queries);
    const recommendData = results[0].status === 'fulfilled' ? results[0].value.data : {};
    const actorData = results[1].status === 'fulfilled' ? results[1].value.data : {};
    const coActorData = results[2].status === 'fulfilled' ? results[2].value.data : {};
    const showDetailsData = results[3].status === 'fulfilled' ? results[3].value.data : {};

    let responseParts = [];
    [recommendData, actorData, coActorData, showDetailsData].forEach(data => {
      if (data.error) responseParts.push(`❌ ${data.error}`);
    });
    if (recommendData.recommendations?.length) {
      responseParts.push(
        "Netflix Recommendations:\n" +
        recommendData.recommendations.map((rec, i) =>
          `${i+1}. ${rec.title}` +
          (rec.link ? ` - [Watch here](${rec.link})` : "") +
          (rec.description ? `\n${rec.description}` : "")
        ).join('\n\n')
      );
    } else if (recommendData.message) {
      responseParts.push(recommendData.message);
    }
    if (actorData.friendly_message) responseParts.push(actorData.friendly_message);
    if (coActorData.friendly_message) responseParts.push(coActorData.friendly_message);
    if (showDetailsData.plot_message) responseParts.push(showDetailsData.plot_message);
    if (showDetailsData.review_message) responseParts.push(showDetailsData.review_message);
    if (showDetailsData.trivia_message) responseParts.push(showDetailsData.trivia_message);
    if (showDetailsData.reddit_discussions?.length) {
      const redditList = showDetailsData.reddit_discussions.map(
        (post, i) =>
          `${i+1}. ${post.title} (${post.num_comments} comments, score: ${post.score})\n${post.url}`
      );
      responseParts.push("Related Reddit Discussions:\n" + redditList.join('\n\n'));
    }
    if (showDetailsData.reddit_error) responseParts.push(`Note: ${showDetailsData.reddit_error}`);
    if (responseParts.length === 0) responseParts.push("Sorry, I couldn't find anything for that.");
    addMessage({ text: responseParts.join('\n\n'), sender: 'bot' });
  } catch (error) {
    addMessage({
      text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
      sender: 'bot'
    });
    console.error('Error fetching skill data:', error);
  } finally {
    setIsLoading(false);
  }
};


  // --- Voice input control
  const toggleListening = () => {
    if (isListening) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  // --- "RenderMultilineText" for showing full, untruncated text (urls as links) ---
  const RenderMultilineText = ({ text }) => {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return (
      <>
        {parts.map((part, i) =>
          part.match(urlRegex) ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ffeeee', textDecoration: 'underline' }}
            >
              {part}
            </a>
          ) : (
            <p key={i} style={{ margin: '0 0 8px 0', whiteSpace: 'pre-wrap' }}>
              {part}
            </p>
          )
        )}
      </>
    );
  };

  // --- Animations ---
  const animationStyles = useSpring({
    opacity: 1,
    transform: 'translateY(0%)',
    from: { opacity: 0, transform: 'translateY(30%)' },
    config: { tension: 280, friction: 30 },
  });

  // --- Main Render ---
  return (
    <animated.div
      style={animationStyles}
      className="chatbox-container"
      role="region"
      aria-live="polite"
      aria-label="Chat with Trellis agent"
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .chatbox-container {
          display: flex;
          flex-direction: column;
          width: 480px;
          height: 620px;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(31, 0, 0, 0.9);
          overflow: hidden;
          position: fixed;
          bottom: 24px;
          right: 24px;
          font-family: 'Netflix Sans', 'Arial', 'Helvetica Neue', sans-serif;
          color: #f9f9f9;
          background: linear-gradient(120deg, #1a0000, #410000, #1a0000, #400008);
          background-size: 600% 600%;
          animation: gradientShift 30s ease infinite;
        }
        .chatbox-header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 18px;
          background: #220000;
          font-weight: 700;
          font-size: 1.4em;
          border-bottom: 1px solid #660000;
          color: #ff0d1a;
          user-select: none;
          position: relative;
        }
        .chatbox-header button {
          position: absolute;
          top: 14px;
          right: 14px;
          font-size: 1.7rem;
          background: transparent;
          border: none;
          color: #ff0d1a;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: color 0.2s ease;
        }
        .chatbox-header button:hover { color: #ff4d4d; }
        .chatbox-messages {
          flex-grow: 1;
          padding: 24px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 22px;
          background: #2b0000;
          border-radius: 0 0 16px 16px;
          scrollbar-width: thin;
          scrollbar-color: #ff1a1a transparent;
        }
        .chatbox-messages::-webkit-scrollbar { width: 8px; }
        .chatbox-messages::-webkit-scrollbar-thumb { background-color: #ff1a1a; border-radius: 4px; }
        .agent-bubble, .user-bubble {
          min-width: 50px;
          max-width: 90%;
          border-radius: 24px;
          padding: 20px 22px;
          font-size: 1.15em;
          line-height: 1.6;
          word-break: break-word;
          white-space: pre-line;
          transition: background-color 0.3s ease;
          box-shadow: 0 8px 15px rgba(255, 13, 26, 0.25);
          display: inline-block !important;
        }
        .agent-bubble {
          background: #ff0d1a;
          color: #fff;
          align-self: flex-start;
          font-weight: 600;
          letter-spacing: 0.02em;
        }
        .agent-bubble p {
          display: block;
          overflow: visible;
          text-overflow: unset;
          white-space: normal;
          -webkit-line-clamp: unset;
          -webkit-box-orient: unset;
        }
        .agent-bubble a {
          color: #ffeeee;
          text-decoration: underline;
          word-break: break-all;
        }
        .user-bubble {
          background: #181818;
          color: #e6e6e6;
          align-self: flex-end;
          font-weight: 500;
        }
        .loading-dots {
          display: flex; align-items: flex-end; gap: 8px; margin-top: 6px;
        }
        .loading-dots span {
          width: 10px; height: 10px; background-color: #fff;
          border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both;
        }
        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
        .loading-dots span:nth-child(3) { animation-delay: 0s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0);}
          40% { transform: scale(1);}
        }
        textarea.chatbox-input {
          flex-grow: 1;
          padding: 16px 24px;
          border-radius: 26px;
          border: 1px solid #660000;
          background: #181818;
          color: #fff;
          outline: none;
          resize: none;
          font-size: 1.15em;
          font-family: inherit;
          max-height: 130px;
          line-height: 1.5;
          transition: border-color 0.3s;
        }
        textarea.chatbox-input:focus { border-color: #ff4d4d; }
        .chatbox-input-container {
          display: flex;
          gap: 14px;
          padding: 16px 24px;
          background: #220000;
          border-top: 1px solid #660000;
        }
        button.send-button,
        button.voice-button {
          background: #ff0d1a;
          border: none;
          border-radius: 50%;
          color: white;
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: box-shadow 0.2s ease;
          box-shadow: 0 0 8px #ff0d1aaa;
        }
        button.send-button:disabled { background: #7b0000; cursor: not-allowed; box-shadow: none; }
        button.send-button:hover:not(:disabled), button.voice-button:hover { box-shadow: 0 0 14px #ff6666cc; }
        button.voice-button.listening { background: #ff4d4d; box-shadow: 0 0 16px #ff4d4dcc; }
      `}</style>

      <div className="chatbox-header" role="banner">
        <p>Trellis</p>
        <button onClick={onClose} aria-label="Close chat">&times;</button>
      </div>

      <div className="chatbox-messages" ref={chatboxRef} aria-live="polite" aria-atomic="false" tabIndex={-1}>
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === 'bot' ? 'agent-bubble' : 'user-bubble'}>
            <RenderMultilineText text={msg.text} />
          </div>
        ))}
        {typingMessage && !introComplete && (
          <div className="agent-bubble" aria-live="assertive"><p style={{ margin: 0 }}>{typingMessage}</p></div>
        )}
        {isLoading && introComplete && (
          <div className="agent-bubble" aria-live="assertive">
            <p>
              <span style={{ fontWeight: 'bold', letterSpacing: '0.04em' }}>Trellis is thinking</span>
              <span role="img" aria-label="popcorn" style={{ marginLeft: 8 }}>🍿</span>
            </p>
            <div className="loading-dots"><span></span><span></span><span></span></div>
          </div>
        )}
      </div>

      <form className="chatbox-input-container" onSubmit={handleSendMessage}>
        <textarea
          className="chatbox-input"
          ref={inputRef}
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || !introComplete}
          rows={1}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          aria-label="Chat input"
        />
        {isSpeechRecognitionSupported && (
          <button
            type="button"
            className={`voice-button ${isListening ? 'listening' : ''}`}
            onClick={toggleListening}
            aria-pressed={isListening}
            aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {/* Mic icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
          </button>
        )}
        <button type="submit" className="send-button" disabled={isLoading || !introComplete} aria-label="Send message">
          {/* Send icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send">
            <line x1="22" x2="11" y1="2" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </animated.div>
  );
};

TrellisChatbox.propTypes = { onClose: PropTypes.func.isRequired };

export default TrellisChatbox;
