// frontend/web/src/components/Chatbot/Chatbot.tsx
import React, { useState } from 'react';
import './Chatbot.css';

interface Message {
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Agricultor. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const messageToSend = inputText;
    
    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text: messageToSend, isUser: true }]);
    setInputText('');
    setIsLoading(true);

    try {
      // 🔥 LLAMADA A TU BACKEND FLASK
      const response = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToSend })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Agregar respuesta del bot
      setMessages(prev => [...prev, { text: data.reply, isUser: false }]);

    } catch (error) {
      console.error('Error en el chatbot:', error);
      setMessages(prev => [...prev, { 
        text: "Lo siento, estoy teniendo problemas para conectarme. ¿Puedes intentarlo de nuevo?", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Asistente Virtual</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isUser ? 'user' : 'bot'}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="message bot loading">
                Escribiendo...
              </div>
            )}
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
            />
            <button onClick={handleSend} disabled={isLoading}>
              {isLoading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      ) : (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          💬 Chat
        </button>
      )}
    </div>
  );
};

export default Chatbot;