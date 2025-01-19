import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const startNewChat = createAsyncThunk(
    'chat/startNew',
    async (_, { rejectWithValue, getState }) => {
        const state = getState();
        if (!state.auth.isAuthenticated) {
            return rejectWithValue('User not authenticated');
        }
        try {
            const response = await api.post('/chat/start');
            console.log('New chat started:', response.data); // Log the response
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to start new chat');
        }
    }
);

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ content, chatId }, { rejectWithValue }) => {
        try {
            console.log('Sending message:', { content, chatId });
            const response = await api.post(`/chat/${chatId}/message`, { content });
            console.log('Message response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in sendMessage:', error.response?.data || error.message);
            return rejectWithValue(error.response?.data?.message || 'Failed to send message');
        }
    }
);

export const loadChatHistory = createAsyncThunk(
    'chat/loadHistory',
    async (chatId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/chat/${chatId}/history`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load chat history');
        }
    }
);

export const getChatSessions = createAsyncThunk(
    'chat/getSessions',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/chat/sessions');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to get chat sessions');
        }
    }
);

// Slice
const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        currentChat: null,
        messages: [],
        sessions: [],
        loading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentChat: (state) => {
            state.currentChat = null;
            state.messages = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Start New Chat
            .addCase(startNewChat.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(startNewChat.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChat = action.payload;
                state.messages = [];
                state.error = null;
            })
            .addCase(startNewChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Send Message
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = [...state.messages, action.payload.userMessage, action.payload.aiResponse];
                state.error = null;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Load Chat History
            .addCase(loadChatHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadChatHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.currentChat = action.payload.chat;
                state.messages = action.payload.messages;
                state.error = null;
            })
            .addCase(loadChatHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Chat Sessions
            .addCase(getChatSessions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getChatSessions.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload;
                state.error = null;
            })
            .addCase(getChatSessions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearCurrentChat } = chatSlice.actions;

export default chatSlice.reducer;
