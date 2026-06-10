import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRobot } from 'react-icons/fa'; // Icon for chatbot
import { Tooltip } from 'react-tooltip';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <ChatBotContainer>
      <ChatIcon onClick={toggleChat} data-tip="Chat with us">
        <FaRobot />
      </ChatIcon>
      {isOpen && (
        <iframe 
          title="VedaBot Chat" 
          height="430" 
          width="350" 
          src="https://bot.dialogflow.com/2bf9b6c0-92e2-40e2-89ca-f73ef31f9dbf" 
          style={{ border: 'none', borderRadius: '8px' }}
        />
      )}
      <Tooltip place="left" type="dark" effect="float" />
    </ChatBotContainer>
  );
};

export default ChatBot;

// Styled components remain the same
const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
`;

const ChatIcon = styled.div`
  font-size: 3rem;
  color: #007bff;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

const ChatIframe = styled.iframe`
  position: fixed;
  bottom: 80px; /* Adjust based on your needs */
  right: 20px;
  border: none;
  z-index: 999;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;