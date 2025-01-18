import React, { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext();

const initialState = {
    isTyping: false,
    contextualData: null,
    suggestions: [],
    attachments: [],
    preferences: {
        notifications: true,
        saveHistory: true,
        autoSuggestions: true
    }
};

const chatReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TYPING':
            return { ...state, isTyping: action.payload };
        case 'SET_CONTEXTUAL_DATA':
            return { ...state, contextualData: action.payload };
        case 'UPDATE_SUGGESTIONS':
            return { ...state, suggestions: action.payload };
        case 'ADD_ATTACHMENT':
            return { 
                ...state, 
                attachments: [...state.attachments, action.payload]
            };
        case 'REMOVE_ATTACHMENT':
            return {
                ...state,
                attachments: state.attachments.filter(
                    (_, index) => index !== action.payload
                )
            };
        case 'UPDATE_PREFERENCES':
            return {
                ...state,
                preferences: { ...state.preferences, ...action.payload }
            };
        default:
            return state;
    }
};

export const ChatProvider = ({ children }) => {
    const [state, dispatch] = useReducer(chatReducer, initialState);

    const setTyping = (isTyping) => {
        dispatch({ type: 'SET_TYPING', payload: isTyping });
    };

    const setContextualData = (data) => {
        dispatch({ type: 'SET_CONTEXTUAL_DATA', payload: data });
    };

    const updateSuggestions = (suggestions) => {
        dispatch({ type: 'UPDATE_SUGGESTIONS', payload: suggestions });
    };

    const addAttachment = (file) => {
        dispatch({ type: 'ADD_ATTACHMENT', payload: file });
    };

    const removeAttachment = (index) => {
        dispatch({ type: 'REMOVE_ATTACHMENT', payload: index });
    };

    const updatePreferences = (preferences) => {
        dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    };

    return (
        <ChatContext.Provider
            value={{
                ...state,
                setTyping,
                setContextualData,
                updateSuggestions,
                addAttachment,
                removeAttachment,
                updatePreferences
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
