import React, { createContext, useContext, useState } from 'react';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackImageURL, setFeedbackImageURL] = useState("");

  const openFeedback = () => {
    setFeedbackOpen(true);
  };

  const closeFeedback = () => setFeedbackOpen(false);

  return (
    <FeedbackContext.Provider value={{ feedbackOpen, feedbackImageURL, openFeedback, closeFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedbackState = () => useContext(FeedbackContext);
