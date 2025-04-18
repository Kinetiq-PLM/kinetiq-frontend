import React, { useState, useEffect, useRef } from "react";
import "./styles/ReportGenerator.css";

const BodyContent = ({user_id}) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [messages, setMessages] = useState([]); 
    const [inputText, setInputText] = useState("");
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isBotResponding, setIsBotResponding] = useState(false);
    const [userName, setUserName] = useState(user_id || '');
    const textareaRef = useRef(null);

    // API base URL - would typically come from environment variables
    // const API_BASE_URL = "https://c8epgmsavb.execute-api.ap-southeast-1.amazonaws.com/dev/";
    const API_BASE_URL = "http://127.0.0.1:8000/";

    useEffect(() => {
        if (user_id) { // Only fetch if user_id is available
            fetchUserName();
            fetchConversations();
        }
    }, [user_id]); 
    
    const fetchUserName = async () => {
        if (!user_id) return; // Guard clause
        try {
            // Use the new backend endpoint
            const response = await fetch(`${API_BASE_URL}chatbot/load_user_details/${user_id}/`);
            if (!response.ok) {
                // Handle potential errors like 404 Not Found
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'User details not found'}`);
            }
            const userData = await response.json();
            // Set the user name, fallback to employee_id or 'User' if first_name is missing
            setUserName(userData.first_name || user_id || 'User');
        } catch (err) {
            console.error("Failed to fetch user name:", err);
            // Fallback to employee_id if fetching fails
            setUserName(user_id || 'User');
            // Optionally set an error state specific to user name fetching if needed
            // setError(prev => ({ ...prev, userNameError: `Could not load user name: ${err.message}` }));
        }
    };

    const fetchConversations = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construct the API URL using the base URL and the user ID
            // Assuming your Django URL pattern is something like 'api/conversations/user/<int:user_id>/'
            const response = await fetch(`${API_BASE_URL}chatbot/load_conversations/${user_id}/`, {
                method: 'GET', // Explicitly set method, though GET is default
                headers: {
                    // Include authentication headers if required by your backend
                    // 'Authorization': `Bearer ${authToken}`, 
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Map the backend response fields to the frontend state structure
            const formattedConversations = data.map(conv => ({
                convo_id: conv.conversation_id, // Map conversation_id to id
                user_id: conv.user_id,
                created_at: conv.started_at, // Map started_at to created_at
                updated_at: conv.updated_at,
                // Generate a title if not provided by the backend
                title: `Conversation ${conv.conversation_id.substring(0, 15)}` 
            }));

            setConversations(formattedConversations);

        } catch (err) {
            console.error('Error fetching conversations:', err);
            setError(`Failed to load conversations: ${err.message}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        setIsLoadingMessages(true);
        setError(null); // Clear previous errors
        setMessages([]); // Clear previous messages immediately
        setActiveConversationId(conversationId); // Set active conversation right away
        console.log("Fetching messages for conversation ID:", conversationId);
        try {
            // Construct the API URL for fetching messages
            // Ensure this matches your Django urls.py pattern for load_messages
            const response = await fetch(`${API_BASE_URL}chatbot/load_messages/${conversationId}/`, {
                method: 'GET',
                headers: {
                    // Include authentication headers if required by your backend
                    // 'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                // Handle HTTP errors (e.g., 404 Not Found, 500 Internal Server Error)
                const errorData = await response.json().catch(() => ({})); // Try to get error details
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Failed to fetch'}`);
            }

            const data = await response.json();

            // Map the backend message format to the frontend format
            const formattedMessages = data.map(msg => ({
                // Assuming your frontend expects 'text' and 'sender'
                // You might need more complex mapping if your frontend
                // needs to handle different message types (like tables)
                // based on backend fields (e.g., msg.intent, msg.sql_query)
                id: msg.message_id, // Keep track of message ID if needed
                sender: msg.sender, // 'user' or 'bot'
                text: msg.message, // The actual message content
                type: "text", // Default to 'text'. Add logic here to determine type if needed.
                // Add other fields if your frontend components use them
                // e.g., created_at: msg.created_at
            }));

            setMessages(formattedMessages);

        } catch (err) {
            console.error('Error fetching messages:', err);
            // Display a user-friendly error message
            setError(`Failed to load conversation: ${err.message}. Please select another or try again.`);
            // Optionally clear messages if the fetch failed completely
            // setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const createNewConversation = async () => {
        setError(null); // Clear previous errors
        // Optionally set a loading state specific to creating a conversation
        // setLoading(true); // Or a more specific state like setIsCreatingConversation(true);
        console.log("Creating new conversation for user ID:", user_id);
        try {
            // API call to create a new conversation
            const response = await fetch(`${API_BASE_URL}chatbot/create_conversation/`, {
              method: 'POST',
              headers: { 
                // Include authentication headers if required by your backend
                // 'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              },
              // Send the required user_id in the body
              body: JSON.stringify({ 
                  user_id: user_id
                  // Add role_id here if needed: role_id: someRoleId 
              }) 
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 400 Bad Request, 500 Internal Server Error)
                const errorData = await response.json().catch(() => ({})); // Try to get error details
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Failed to create conversation'}`);
            }
            
            // Parse the response which contains the new conversation object
            const newConversationData = await response.json();

            // Format the new conversation data to match the frontend state structure
            const formattedNewConversation = {
                convo_id: newConversationData.conversation_id,
                user_id: newConversationData.user_id,
                created_at: newConversationData.started_at,
                updated_at: newConversationData.updated_at,
                title: `Conversation ${newConversationData.conversation_id.substring(0, 15)}` // Generate title
            };

            // Update frontend state:
            // 1. Add the new conversation to the beginning of the list
            setConversations(prev => [formattedNewConversation, ...prev]);
            // 2. Clear messages for the new conversation
            setMessages([]);
            // 3. Set the new conversation as active
            setActiveConversationId(formattedNewConversation.convo_id);

            // Return the formatted conversation data, especially the ID,
            // so handleSendMessage can use it immediately if needed.
            return formattedNewConversation; 

        } catch (err) {
            console.error('Error creating conversation:', err);
            setError(`Failed to create new conversation: ${err.message}. Please try again.`);
            // Re-throw the error if the calling function needs to know about the failure
            throw err; 
        } finally {
             // Reset loading state if you set one
             // setLoading(false); // Or setIsCreatingConversation(false);
        }
    };

    const saveMessage = async (conversationId, messageData) => {
        // messageData should be an object like { sender: 'user'/'bot', message: 'text content' }
        if (!conversationId) {
            console.error("Cannot save message without an active conversation ID.");
            throw new Error("No active conversation selected.");
        }
        
        try {
            // Construct the API URL for creating a message
            // Ensure this matches your Django urls.py pattern for create_message
            const response = await fetch(`${API_BASE_URL}chatbot/create_message/${conversationId}/`, {
              method: 'POST',
              headers: { 
                // Include authentication headers if required by your backend
                // 'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json' 
              },
              // Send the message data in the request body
              body: JSON.stringify({
                  sender: messageData.sender, // 'user' or 'bot'
                  message: messageData.text // The actual text content
                  // Add other fields like intent, sql_query if needed for the backend
              }) 
            });

            if (!response.ok) {
                // Handle HTTP errors (e.g., 400 Bad Request, 404 Not Found, 500)
                const errorData = await response.json().catch(() => ({})); // Try to get error details
                console.error("API Error Response:", errorData);
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Failed to save message'}`);
            }

            // Parse the response which should contain the newly created message object from the backend
            const savedMessage = await response.json();
            
            // Map the backend response to the frontend format if necessary
            // (Assuming backend returns fields compatible with frontend state for now)
            return {
                id: savedMessage.message_id,
                sender: savedMessage.sender,
                text: savedMessage.message,
                type: "text", // Adjust if backend provides type info
                // created_at: savedMessage.created_at // Include if needed
            };

        } catch (err) {
            console.error('Error saving message via API:', err);
            // Re-throw the error so handleSendMessage can catch it
            throw err; 
        }
    };

    const formatChatHistory = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        
        const history = {
            today: [],
            previous7Days: [],
            previous30Days: []
        };
        
        conversations.forEach(conversation => {
            // Use updated_at for grouping instead of created_at
            const convDate = new Date(conversation.updated_at); 
            
            if (convDate >= today) {
                history.today.push({
                    convo_id: conversation.convo_id,
                    title: conversation.title,
                    active: activeConversationId === conversation.convo_id
                });
            } else if (convDate >= sevenDaysAgo) {
                history.previous7Days.push({
                    convo_id: conversation.convo_id,
                    title: conversation.title,
                    active: activeConversationId === conversation.convo_id
                });
            } else if (convDate >= thirtyDaysAgo) {
                history.previous30Days.push({
                    convo_id: conversation.convo_id,
                    title: conversation.title,
                    active: activeConversationId === conversation.convo_id
                });
            }
            // Optionally add an 'older' category for conversations older than 30 days
        });
        
        return history;
    };
    
    const chatHistory = formatChatHistory();

    const filterChatHistory = (history) => {
        if (!searchInput.trim()) return history;

        const searchTerm = searchInput.toLowerCase();
        return Object.keys(history).reduce((filtered, period) => {
            const filteredItems = history[period].filter(item => 
                item.title.toLowerCase().includes(searchTerm))
            if (filteredItems.length > 0) {
                filtered[period] = filteredItems;
            }
            return filtered;
        }, {});
    };

    const filteredChatHistory = filterChatHistory(chatHistory);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    // Function to call the chatbot backend API
    const getBotResponse = async (userMessageText) => {
        try {
            // Encode the user message to be safely included in the URL
            const encodedMessage = encodeURIComponent(userMessageText);
            const response = await fetch(`${API_BASE_URL}chatbot/chatbot/?message=${encodedMessage}`, {
                method: 'GET',
                headers: {
                    // Include authentication headers if required by your backend
                    // 'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json', 
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Chatbot API error! status: ${response.status} - ${errorData.error || 'Failed to get response'}`);
            }

            const botData = await response.json();
            // The backend returns { response: "text", data: {...}, sql_error: "..." }
            return botData; 

        } catch (err) {
            console.error('Error fetching bot response:', err);
            // Re-throw the error to be handled in handleSendMessage
            throw err; 
        }
    };

    const handleSendMessage = async () => {
        const trimmedInput = inputText.trim();
        if (trimmedInput === "" || isBotResponding) return; // Don't send empty messages

        let currentConversationId = activeConversationId;

        // If no active conversation, create one first
        if (!currentConversationId) {
            try {
                // Call createNewConversation and get the new conversation data
                const newConvData = await createNewConversation(); 
                currentConversationId = newConvData.convo_id; // Use the ID directly from the response
                // No need to set activeConversationId here, createNewConversation already did
                 if (!currentConversationId) { // Should not happen if createNewConversation succeeded
                     throw new Error("Failed to retrieve conversation ID after creation.");
                 }
            } catch (err) {
                 // Error is already logged/set by createNewConversation
                 console.error('Error creating new conversation within send:', err);
                 // setError is already set, just stop execution
                 return; 
            }
        }

        // Optimistically add user message to UI
        const userMessage = { 
            id: `temp-${Date.now()}`, // Temporary ID for React key
            sender: "user", 
            text: trimmedInput, 
            type: "text" 
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText(""); // Clear input field
        if (textareaRef.current) { // Reset textarea height
            textareaRef.current.style.height = '40px'; 
        }

        // Save user message to backend
        try {
            // Prepare data for the API call
            const messageToSend = { sender: "user", text: trimmedInput };
            // Call the updated saveMessage function
            const savedUserMessage = await saveMessage(currentConversationId, messageToSend);
            
            // Optional: Update the temporary message with the real ID from the backend
            setMessages(prev => prev.map(msg => 
                msg.id === userMessage.id ? { ...savedUserMessage, type: "text" } : msg // Ensure type is set
            ));

            // // --- Bot Response Logic (Keep existing or adapt as needed) ---
            // // Generate and save bot response (still using mock generateResponse for now)
            // setTimeout(async () => {
            //     const botResponse = generateResponse(trimmedInput); // Mock generation
            //     try {
            //         // Save bot response to backend
            //         const savedBotMessage = await saveMessage(currentConversationId, botResponse);
            //         // Add bot response to UI
            //         setMessages(prev => [...prev, { ...savedBotMessage, type: botResponse.type || "text" }]); // Use type from generateResponse if available
            //     } catch (botSaveErr) {
            //          console.error('Error saving bot message:', botSaveErr);
            //          // Handle bot message saving error (e.g., show an error message in chat)
            //          const errorBotMessage = {
            //              id: `error-${Date.now()}`,
            //              sender: 'bot',
            //              text: `Error: Could not save bot response. ${botSaveErr.message}`,
            //              type: 'text'
            //          };
            //          setMessages(prev => [...prev, errorBotMessage]);
            //     }
            // }, 500); // Short delay for bot "thinking"

        } catch (userSaveErr) {
            console.error('Error sending user message:', userSaveErr);
            setError(`Failed to send message: ${userSaveErr.message}. Please try again.`);
            // Optional: Remove the optimistically added message or mark it as failed
            setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
        } 

        
        // --- Handle Bot Response ---
        setIsBotResponding(true);
        try {
            // 1. Get response from chatbot API
            // Add a visual indicator that the bot is "thinking"
            const thinkingMessage = {
                id: `temp-bot-thinking-${Date.now()}`,
                sender: 'bot',
                text: '...', // Or use a spinner component
                type: 'text', 
                isLoading: true // Custom flag for styling
            };
            setMessages(prev => [...prev, thinkingMessage]);

            const botApiResponse = await getBotResponse(trimmedInput);

            // Remove the "thinking" message
            setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));

            // 2. Prepare bot message data for saving and UI
            let botText = botApiResponse.response || "Sorry, I couldn't generate a response.";
            let botMessageType = "text"; // Default type
            let botTableData = null; // To store table data if present

            if (botApiResponse.sql_error) {
                botText += `\n\n[Error executing SQL: ${botApiResponse.sql_error}]`;
            }
            
            // --- Handle Table Data (Example) ---
            // Adjust this logic based on the actual structure of botApiResponse.data
            if (botApiResponse.data && botApiResponse.data.headers && botApiResponse.data.rows) {
                 botMessageType = "table"; // Change type if data looks like a table
                 botTableData = botApiResponse.data; 
                 // You might want to keep the text response as a title or intro for the table
                 // botText = botApiResponse.response; // Keep the original text response as well
            }
            // --- End Table Data Handling ---


            const botMessageDataForSaving = { 
                sender: "bot", 
                text: botText // Save the primary text response
                // Optionally include intent, sql_query from botApiResponse if needed by backend
                // intent: botApiResponse.intent, 
                // sql_query: botApiResponse.sql_query 
            };

            // 3. Save bot response to backend
            const savedBotMessage = await saveMessage(currentConversationId, botMessageDataForSaving);

            // 4. Add final bot message to UI (using saved data + UI-specific fields like type/data)
            const finalBotMessageForUI = {
                ...savedBotMessage, // Includes id, sender, text from backend
                type: botMessageType, // Set the correct type for rendering
                // Add the table data if it exists for the Table component
                ...(botTableData && { 
                    // Structure this according to your Table component's props
                    tables: [{ 
                        title: "Generated Report", // Example title
                        headers: botTableData.headers, 
                        rows: botTableData.rows 
                    }],
                    // You might need additional text fields your table component uses
                    title2: "Analysis", 
                    text2: "Here is the data based on your request." 
                })
            };

            setMessages(prev => [...prev, finalBotMessageForUI]);

        } catch (botProcessingErr) {
            console.error('Error processing bot response:', botProcessingErr);
             // Remove thinking message if it's still there on error
             setMessages(prev => prev.filter(msg => !msg.isLoading)); 
            // Display an error message in the chat
            const errorBotMessage = {
                id: `error-bot-${Date.now()}`,
                sender: 'bot',
                text: `Sorry, I encountered an error: ${botProcessingErr.message}`,
                type: 'text'
            };
            // Optionally save this error message to the backend as well
            // await saveMessage(currentConversationId, { sender: 'bot', text: errorBotMessage.text });
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsBotResponding(false); // <-- Set bot responding state to false in finally block
        }
    };

    const archiveConversation = async (conversationIdToArchive) => {
        // Prevent archiving if the bot is currently responding
        if (isBotResponding) {
            console.warn("Cannot archive conversation while bot is responding.");
            // Optionally show a user notification here
            // setError("Please wait for the bot to finish responding before archiving.");
            return; 
        }

        setError(null); // Clear previous errors
        // Optionally set a specific loading state like setIsArchiving(true)

        try {
            // Construct the API URL for archiving
            const response = await fetch(`${API_BASE_URL}chatbot/archive_conversation/${conversationIdToArchive}/`, {
                method: 'PATCH', // Use PATCH method
                headers: {
                    // Include authentication headers if required
                    // 'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json' // Often needed even without a body for PATCH
                },
                // No body needed for this specific PATCH request
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Failed to archive conversation'}`);
            }

            // Success! Now update the frontend state:
            console.log(`Conversation ${conversationIdToArchive} archived successfully.`);

            // 1. Remove the conversation from the local state list
            setConversations(prev => prev.filter(conv => conv.convo_id !== conversationIdToArchive));

            // 2. If the archived conversation was the active one, clear the chat view
            if (activeConversationId === conversationIdToArchive) {
                setMessages([]);
                setActiveConversationId(null);
            }

            // 3. Optionally, re-fetch the conversation list to ensure consistency 
            //    (though filtering the state might be sufficient for UI)
            // await fetchConversations(); // Uncomment if direct state manipulation isn't reliable enough

        } catch (err) {
            console.error('Error archiving conversation:', err);
            setError(`Failed to archive conversation: ${err.message}. Please try again.`);
        } finally {
            // Reset specific loading state if set: setIsArchiving(false);
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                100
            )}px`;
        }
    };

    const startNewChat = async () => {
        try {
            await createNewConversation(); // Call the updated function
            // No need to manually set active ID here, createNewConversation does it
            setIsSidebarVisible(false); // Close sidebar after creating
        } catch (err) {
            // Error is already logged and set in createNewConversation
            // You could potentially show a more specific UI notification here if needed
            console.log("Failed to start new chat from button click.");
        }
    };

    const generateResponse = () => {
        return
    };

    const downloadCSV = (data, filename = 'report-data.csv') => {
        if (!data || !data.headers || !data.rows || data.rows.length === 0) {
            return;
        }
        
        const header = data.headers.join(',');
        const rows = data.rows.map(row => row.join(','));
        const csvContent = [header, ...rows].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="repgen">
            <div className="body-content-container">
                <div className={`sidebar-container ${isSidebarVisible ? "visible" : ""}`}>
                    {isSidebarVisible && (
                        <div className="sidebar-content-wrapper">
                            {isSearchVisible ? (
                                <div className={`search-bar-container ${isSearchVisible ? "visible" : ""}`}
                                    onTransitionEnd={() => !isSearchVisible && setSearchInput("")}>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="search-input"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                    />
                                    <div className="ham-menu-icon active" onClick={() => setIsSearchVisible(false)}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            ) : (
                                <div className='sidebar-header'>
                                    <div className="sidebar-icons-ham-icon-wrapper">
                                        <div 
                                            // Add 'disabled' class and prevent click if bot is responding
                                            className={`ham-menu-icon active ${isBotResponding ? 'disabled' : ''}`} 
                                            onClick={!isBotResponding ? toggleSidebar : undefined}
                                            style={{ cursor: isBotResponding ? 'not-allowed' : 'pointer', opacity: isBotResponding ? 0.6 : 1 }} 
                                        >
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div className="srch-new-icon">
                                            <img 
                                                src="../../icons/repgen-icons/newchat.png" 
                                                alt="New" 
                                                // Add 'disabled' class and prevent click if bot is responding
                                                className={`newchat-icon ${isBotResponding ? 'disabled' : ''}`}
                                                onClick={!isBotResponding ? startNewChat : undefined}
                                                // Optional: Add style for disabled state in CSS for .newchat-icon.disabled
                                                style={{ cursor: isBotResponding ? 'not-allowed' : 'pointer', opacity: isBotResponding ? 0.6 : 1 }} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="sidebar-content">
                                {loading ? (
                                    <div className="loading-message">Loading conversations...</div>
                                ) : error ? (
                                    <div className="error-message">{error}</div>
                                ) : Object.keys(filteredChatHistory).length > 0 ? (
                                    <>
                                        {filteredChatHistory.today && (
                                            <div className="history-section">
                                                <h3 className="history-period">Today</h3>
                                                <ul className="history-list">
                                                    {filteredChatHistory.today.map(chat => (
                                                        <li 
                                                            key={chat.convo_id} 
                                                            // Apply base class and active class. Make li a flex container.
                                                            className={`history-item ${chat.active ? 'active' : ''}`}
                                                            // Add flex styles to position title and icon
                                                            style={{ 
                                                                display: 'flex', 
                                                                justifyContent: 'space-between', 
                                                                alignItems: 'center',
                                                                // Apply opacity based on bot state for the whole item
                                                                opacity: isBotResponding ? 0.6 : 1 
                                                            }} 
                                                        >
                                                            {/* Wrap title in a span and attach fetchMessages click here */}
                                                            <span 
                                                                onClick={!isBotResponding ? () => fetchMessages(chat.convo_id) : undefined}
                                                                // Make the title span take up available space and allow clicking
                                                                style={{ 
                                                                    flexGrow: 1, 
                                                                    cursor: isBotResponding ? 'not-allowed' : 'pointer', 
                                                                    paddingRight: '10px', // Add space between title and icon
                                                                    overflow: 'hidden', // Prevent long titles from overlapping icon
                                                                    textOverflow: 'ellipsis', // Add ellipsis for long titles
                                                                    whiteSpace: 'nowrap' // Keep title on one line
                                                                }}
                                                            >
                                                                {chat.title}
                                                            </span>
                                                            
                                                            {/* Add the archive icon */}
                                                            <img
                                                                src="../../icons/repgen-icons/archive-icon.png" // Verify path
                                                                alt="Archive"
                                                                // Add disabled class based on bot state
                                                                className={`archive-icon ${isBotResponding ? 'disabled' : ''}`} 
                                                                // Attach archiveConversation click here, prevent if bot is responding
                                                                onClick={!isBotResponding ? (e) => {
                                                                    e.stopPropagation(); // Prevent triggering fetchMessages if li had a handler
                                                                    archiveConversation(chat.convo_id); 
                                                                } : undefined}
                                                                style={{
                                                                    cursor: isBotResponding ? 'not-allowed' : 'pointer',
                                                                    width: '24px',  // Adjust size as needed
                                                                    height: '24px', 
                                                                    flexShrink: 0 // Prevent icon from shrinking
                                                                }}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {filteredChatHistory.previous7Days && (
                                            <div className="history-section">
                                                <h3 className="history-period">Previous 7 Days</h3>
                                                <ul className="history-list">
                                                    {filteredChatHistory.previous7Days.map(chat => (
                                                        <li 
                                                            key={chat.convo_id} 
                                                            className={`history-item ${chat.active ? 'active' : ''}`}
                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isBotResponding ? 0.6 : 1 }} 
                                                        >
                                                            <span 
                                                                onClick={!isBotResponding ? () => fetchMessages(chat.convo_id) : undefined}
                                                                style={{ flexGrow: 1, cursor: isBotResponding ? 'not-allowed' : 'pointer', paddingRight: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                            >
                                                                {chat.title}
                                                            </span>
                                                            <img
                                                                src="../../icons/repgen-icons/archive-icon.png" 
                                                                alt="Archive"
                                                                className={`archive-icon ${isBotResponding ? 'disabled' : ''}`} 
                                                                onClick={!isBotResponding ? (e) => { e.stopPropagation(); archiveConversation(chat.convo_id); } : undefined}
                                                                style={{ cursor: isBotResponding ? 'not-allowed' : 'pointer', width: '24px', height: '24px', flexShrink: 0 }}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {filteredChatHistory.previous30Days && (
                                            <div className="history-section">
                                                <h3 className="history-period">Previous 30 Days</h3>
                                                <ul className="history-list">
                                                    {filteredChatHistory.previous30Days.map(chat => (
                                                        <li 
                                                            key={chat.convo_id} 
                                                            className={`history-item ${chat.active ? 'active' : ''}`}
                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isBotResponding ? 0.6 : 1 }} 
                                                        >
                                                            <span 
                                                                onClick={!isBotResponding ? () => fetchMessages(chat.convo_id) : undefined}
                                                                style={{ flexGrow: 1, cursor: isBotResponding ? 'not-allowed' : 'pointer', paddingRight: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                            >
                                                                {chat.title}
                                                            </span>
                                                            <img
                                                                src="../../icons/repgen-icons/archive-icon.png" 
                                                                alt="Archive"
                                                                className={`archive-icon ${isBotResponding ? 'disabled' : ''}`} 
                                                                onClick={!isBotResponding ? (e) => { e.stopPropagation(); archiveConversation(chat.convo_id); } : undefined}
                                                                style={{ cursor: isBotResponding ? 'not-allowed' : 'pointer', width: '24px', height: '24px', flexShrink: 0 }}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="no-results">No matching reports found</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="sidebar-main-separator">
                    <div className="navbar-main-separator">
                        <div className='navbar-container'>
                            {!isSidebarVisible && (
                                <div 
                                    // Add 'disabled' class and prevent click if bot is responding
                                    className={`sidebar-icons-ham-icon-wrapper ${isBotResponding ? 'disabled' : ''}`} 
                                    onClick={!isBotResponding ? toggleSidebar : undefined}
                                    style={{ cursor: isBotResponding ? 'not-allowed' : 'pointer', opacity: isBotResponding ? 0.6 : 1 }} 
                                >
                                    <div className="ham-menu-icon">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="main-content-container">
                        {isLoadingMessages ? (
                            <div className="loading-message">Loading conversation...</div>
                        ) : (
                            <>
                                <div className="chat-history">
                                    {messages.length === 0 ? (
                                        <div className="welres-container">
                                            <h1 className="welc-text">Hello {userName}</h1>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => (
                                            <div key={index} className={`chat-message ${msg.sender}`}>
                                                {msg.type === "text" ? (
                                                    <div className="message-text">
                                                        {msg.text.split("\n").map((line, i) => (
                                                            <React.Fragment key={i}>
                                                                {line}
                                                                <br />
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="chat-table-response">
                                                        <p className="res-head">{msg.text}</p>
                                                        <h3>{msg.title}</h3>
                                                        {msg.tables.map((table, i) => (
                                                            <div key={i}>
                                                                <h4>{table.title}</h4>
                                                                <table className="chat-table">
                                                                    <thead>
                                                                        <tr>
                                                                            {table.headers.map((header, j) => (
                                                                                <th key={j}>{header}</th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {table.rows.map((row, k) => (
                                                                            <tr key={k}>
                                                                                {row.map((cell, l) => (
                                                                                    <td key={l}>{cell}</td>
                                                                                ))}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ))}
                                                        <p className="res-foot">{msg.title2}</p>
                                                        <p className="foot-cont">{msg.text2}</p>
                                                        <div className="action-buttons">
                                                            <div className="dl-icon-wrapper" onClick={() => downloadCSV(msg.tables[0], 'financial-report.csv')}>
                                                                <img src="../../icons/repgen-icons/download.png" alt="Download" className="download-icon"/>
                                                                <span className={`tooltip ${index === messages.length - 1 ? 'right-aligned' : ''}`}>Download CSV</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="textbar-container">
                                    <textarea
                                        ref={textareaRef}
                                        // Update placeholder and add disabled attribute based on isBotResponding
                                        placeholder={isBotResponding ? "Waiting for response..." : "Ask anything"}
                                        className="text-input"
                                        value={inputText}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            // Prevent Enter key if bot is responding
                                            if (e.key === "Enter" && !e.shiftKey && !isBotResponding) {
                                                e.preventDefault();
                                                handleSendMessage(); 
                                            }
                                        }}
                                        rows="1"
                                        style={{ height: '40px' }}
                                        disabled={isBotResponding} // <-- Disable textarea
                                    />
                                    <img
                                        src="../../icons/repgen-icons/sendmsg.png"
                                        // Add a class to visually disable the icon if needed
                                        className={`sendmsg-icon ${isBotResponding ? 'disabled' : ''}`} 
                                        // Prevent click if bot is responding
                                        onClick={!isBotResponding ? handleSendMessage : undefined} 
                                        alt="Send"
                                        // Optional: style changes for disabled state in CSS
                                        style={{ opacity: isBotResponding ? 0.5 : 1, cursor: isBotResponding ? 'not-allowed' : 'pointer' }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;