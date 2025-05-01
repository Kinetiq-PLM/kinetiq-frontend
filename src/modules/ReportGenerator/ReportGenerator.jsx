import React, { useState, useEffect, useRef, memo } from "react";
import "./styles/ReportGenerator.css";

const ChatMessage = memo(({ msg, index, messagesLength, downloadCSV }) => {
    // Function to safely render cell content, handling potential objects/arrays
    const renderCellContent = (cell) => {
        if (typeof cell === 'object' && cell !== null) {
            return JSON.stringify(cell); // Or handle specific object types differently
        }
        return cell;
    };

    return (
        <div key={msg.id || index} className={`chat-message ${msg.sender}`}>
            {msg.type === "text" ? (
                <div className="message-text">
                    {/* Render loading indicator if applicable */}
                    {msg.isLoading ? (
                        <span className="loading-dots">...</span> // Or a spinner component
                    ) : (
                        msg.text.split("\n").map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))
                    )}
                </div>
            ) : (
                // When type is 'table'
                <div className="chat-table-response">
                    {/* Render the main text response (summary/intro) */}
                    <p className="res-head">{msg.text}</p>

                    {/* Map through the tables */}
                    {msg.tables && msg.tables.map((table, i) => (
                        // --- 3. Add a wrapper div for horizontal scrolling ---
                        <div key={i} className="table-scroll-wrapper">
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
                                            {/* Ensure row is an array before mapping */}
                                            {Array.isArray(row) ? row.map((cell, l) => (
                                                <td key={l}>{renderCellContent(cell)}</td>
                                            )) : (
                                                // Handle cases where row might not be an array (e.g., error)
                                                <td colSpan={table.headers.length}>Invalid row data</td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                    <div className="action-buttons">
                        {msg.tables && msg.tables.length > 0 && (
                            <div className="dl-icon-wrapper" onClick={() => downloadCSV(msg.tables[0], 'report-data.csv')}>
                                <img src="../../icons/repgen-icons/download.png" alt="Download" className="download-icon"/>
                                {/* Adjust tooltip alignment based on index */}
                                <span className={`tooltip ${index === messagesLength - 1 ? 'right-aligned' : ''}`}>Download CSV</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

const BodyContent = ({employee_id}) => {
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
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [isBotResponding, setIsBotResponding] = useState(false);
    const [userName, setUserName] = useState(employee_id || '');
    const textareaRef = useRef(null);

    const API_BASE_URL = "https://c8epgmsavb.execute-api.ap-southeast-1.amazonaws.com/dev/";
    // const API_BASE_URL = "http://127.0.0.1:8000/";

    useEffect(() => {
        if (employee_id) { // Only fetch if user_id is available
            fetchUserName();
            fetchConversations();
        }
    }, [employee_id]); 
    
    const fetchUserName = async () => {
        if (!employee_id) return; // Guard clause
        try {
            // Use the new backend endpoint
            const response = await fetch(`${API_BASE_URL}chatbot/load_user_details/${employee_id}/`);
            if (!response.ok) {
                // Handle potential errors like 404 Not Found
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'User details not found'}`);
            }
            const userData = await response.json();
            // Set the user name, fallback to employee_id or 'User' if first_name is missing
            setUserName(userData.first_name || employee_id || 'User');
        } catch (err) {
            console.error("Failed to fetch user name:", err);
            // Fallback to employee_id if fetching fails
            setUserName(employee_id || 'User');
            // Optionally set an error state specific to user name fetching if needed
            // setError(prev => ({ ...prev, userNameError: `Could not load user name: ${err.message}` }));
        }
    };

    const fetchConversations = async () => {
        if (!employee_id) return;
        setLoading(true);
        setError(null);
        try {
            // Construct the API URL using the base URL and the user ID
            // Assuming your Django URL pattern is something like 'api/conversations/user/<int:user_id>/'
            const response = await fetch(`${API_BASE_URL}chatbot/load_conversations/${employee_id}/`, {
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

            // Map the backend response fields
            const formattedConversations = data.map(conv => {
                // Use conversation_title from backend if available, otherwise generate
                let title = conv.conversation_title;
                if (!title) {
                    // Generate title based on ID (e.g., last parts)
                    const parts = conv.conversation_id.split('_'); // Assuming "convo_..." format
                    title = `Convo ${parts[1] ? parts[1].substring(0, 8) : conv.conversation_id.substring(0, 8)}`;
                }
                return {
                    convo_id: conv.conversation_id,
                    employee_id: conv.employee_id, // Store employee_id
                    created_at: conv.started_at,
                    updated_at: conv.updated_at,
                    title: title // Use the determined title
                };
            });

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
        setError(null);
        setMessages([]);
        setActiveConversationId(conversationId);
        console.log("Fetching messages for conversation ID:", conversationId);

        const TABLE_DATA_MARKER = "[TABLE_DATA]:"; // Use the same marker

        try {
            const response = await fetch(`${API_BASE_URL}chatbot/load_messages/${conversationId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Failed to fetch'}`);
            }

            const data = await response.json();

            // Map the backend message format to the frontend format
            const formattedMessages = data.map(msg => {
                let messageType = "text";
                let tablesData = null;
                let originalSqlQuery = msg.sql_query; // Store original query

                // *** Check if sql_query contains encoded table data ***
                if (msg.sql_query && msg.sql_query.startsWith(TABLE_DATA_MARKER)) {
                    try {
                        const tableJsonString = msg.sql_query.substring(TABLE_DATA_MARKER.length);
                        tablesData = JSON.parse(tableJsonString);
                        messageType = "table";
                        // Clear sql_query for frontend state as it held table data
                        originalSqlQuery = null;
                    } catch (parseError) {
                        console.error("Failed to parse table data from fetched sql_query:", parseError, "for message:", msg.message_id);
                        // Fallback to text if parsing fails
                        messageType = "text";
                        tablesData = null;
                        // Keep the original (malformed) sql_query string? Or set to null?
                        // Let's keep it for debugging, but maybe set to null in production
                        // originalSqlQuery = msg.sql_query;
                    }
                }
                // *** End of table decoding logic ***

                return {
                    id: msg.message_id,
                    sender: msg.sender,
                    text: msg.message,
                    type: messageType, // Determined type
                    tables: tablesData, // Decoded tables or null
                    sql_query: originalSqlQuery // Original SQL or null if used for tables
                    // created_at: msg.created_at
                };
            });

            setMessages(formattedMessages);

        } catch (err) {
            console.error('Error fetching messages:', err);
            setError(`Failed to load conversation: ${err.message}. Please select another or try again.`);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const createNewConversation = async () => {
        if (!employee_id) {
            setError("Employee ID is missing, cannot create conversation.");
            throw new Error("Employee ID is missing.");
        }
        setError(null); // Clear previous errors
        setIsCreatingConversation(true);
        // Optionally set a loading state specific to creating a conversation
        // setLoading(true); // Or a more specific state like setIsCreatingConversation(true);
        console.log("Creating new conversation for employee ID:", employee_id);
        try {
            // API call to create a new conversation
            const response = await fetch(`${API_BASE_URL}chatbot/create_conversation/`, {
                method: 'POST',
                headers: { 
                    // Include authentication headers if required by your backend
                    // 'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                // Send the required employee_id in the body
                body: JSON.stringify({ 
                    employee_id: employee_id
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
            // Use title from response if available
            let title = newConversationData.conversation_title;
            if (!title) {
                 const parts = newConversationData.conversation_id.split('_');
                 title = `Convo ${parts[1] ? parts[1].substring(0, 8) : newConversationData.conversation_id.substring(0, 8)}`;
            }
            // Format the new conversation data to match the frontend state structure
            const formattedNewConversation = {
                convo_id: newConversationData.conversation_id,
                employee_id: newConversationData.employee_id,
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
            setIsCreatingConversation(false);
        }
    };

    const saveMessage = async (conversationId, messageData) => {
        // messageData now includes: { sender, text, type, sql_query?, tables? }
        if (!conversationId) {
            console.error("Cannot save message without an active conversation ID.");
            throw new Error("No active conversation selected.");
        }

        const TABLE_DATA_MARKER = "[TABLE_DATA]:";

        try {
            // Construct the payload based on message type
            const payload = {
                sender: messageData.sender,
                message: messageData.text,
                // Default sql_query to null or the provided one
                sql_query: messageData.sql_query || null
            };

            // *** If type is 'table', encode tables into sql_query field ***
            if (messageData.type === 'table' && messageData.tables) {
                try {
                    const tableJsonString = JSON.stringify(messageData.tables);
                    // Store encoded table data in the sql_query field
                    payload.sql_query = TABLE_DATA_MARKER + tableJsonString;
                } catch (jsonError) {
                    console.error("Failed to stringify table data:", jsonError);
                    // Decide how to handle: save without table? throw error?
                    // For now, let's save with null sql_query
                    payload.sql_query = null;
                }
            }
            // *** End of table encoding logic ***

            const response = await fetch(`${API_BASE_URL}chatbot/create_message/${conversationId}/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload) // Send the modified payload
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("API Error Response:", errorData);
                throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Failed to save message'}`);
            }

            const savedMessage = await response.json();

            // Map the backend response back to the frontend format
            // We need to decode the table data if it was stored in sql_query
            let messageType = "text";
            let tablesData = null;
            let originalSqlQuery = savedMessage.sql_query; // Keep original for potential use

            if (savedMessage.sql_query && savedMessage.sql_query.startsWith(TABLE_DATA_MARKER)) {
                try {
                    const tableJsonString = savedMessage.sql_query.substring(TABLE_DATA_MARKER.length);
                    tablesData = JSON.parse(tableJsonString);
                    messageType = "table";
                    // Since sql_query was used for tables, clear it for the frontend state
                    originalSqlQuery = null;
                } catch (parseError) {
                    console.error("Failed to parse table data from sql_query:", parseError);
                    // Fallback to text type if parsing fails
                    messageType = "text";
                    tablesData = null;
                }
            }

            return {
                id: savedMessage.message_id,
                sender: savedMessage.sender,
                text: savedMessage.message,
                type: messageType, // Determined type
                tables: tablesData, // Decoded tables or null
                sql_query: originalSqlQuery, // Original SQL or null if used for tables
                conversation_title: savedMessage.conversation_title // Keep title update logic
            };

        } catch (err) {
            console.error('Error saving message via API:', err);
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
    const getBotResponse = async (userMessageText, currentConversationId) => { // Added currentConversationId
        // --- Ensure conversation ID is present ---
        if (!currentConversationId) {
            console.error("Cannot get bot response without a conversation ID.");
            throw new Error("Conversation ID is missing.");
        }

        try {
            const response = await fetch(`${API_BASE_URL}chatbot/respond/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Add other headers like Authorization if needed
                },
                body: JSON.stringify({ 
                    message: userMessageText,
                    conversation_id: currentConversationId
                 })
                
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Chatbot API error! status: ${response.status} - ${errorData.error || 'Failed to get response'}`);
            }

            const botData = await response.json();
            return botData;

        } catch (err) {
            console.error('Error fetching bot response:', err);
            throw err;
        }
    };

    const handleSendMessage = async () => {
        const trimmedInput = inputText.trim();
        if (trimmedInput === "" || isBotResponding || !activeConversationId) return; // Don't send empty messages

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

            const botApiResponse = await getBotResponse(trimmedInput, activeConversationId);

            // Remove the "thinking" message
            setMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));

            // 2. Prepare bot message data for saving and UI
            let botText = botApiResponse.response || "Sorry, I couldn't generate a response.";
            let botMessageType = "text"; // Default type
            let botTableData = null; // To store table data if present
            let botSqlQuery = botApiResponse.sql_query || null; // Get the query

            if (botApiResponse.sql_error) {
                botText += `\n\n[Error executing SQL: ${botApiResponse.sql_error}]`;
            }

            if (botApiResponse.data && botApiResponse.data.headers && botApiResponse.data.rows) {
                 botMessageType = "table";
                 botTableData = botApiResponse.data;
            }

            // --- Include sql_query when preparing data for saving ---
            const botMessageDataForSaving = {
                sender: "bot",
                text: botText,
                type: botMessageType, // 'text' or 'table'
                sql_query: botSqlQuery, // Pass the *actual* SQL query here (can be null)
                // Pass the actual table data if type is 'table'
                // saveMessage will handle encoding this into the sql_query field if type is 'table'
                tables: botMessageType === 'table' ? [{
                    headers: botTableData.headers,
                    rows: botTableData.rows
                }] : null
                // Optionally include intent if needed by backend:
                // intent: botApiResponse.intent
            };

            // 3. Save bot response to backend
            const savedBotMessageResult = await saveMessage(currentConversationId, botMessageDataForSaving);

            // --- *** ADD THIS BLOCK TO UPDATE THE CONVERSATION TITLE *** ---
            if (savedBotMessageResult.conversation_title) {
                setConversations(prevConvos =>
                    prevConvos.map(conv =>
                        conv.convo_id === currentConversationId
                            ? { ...conv, title: savedBotMessageResult.conversation_title } // Update title
                            : conv // Keep others unchanged
                    )
                );
            }
            // --- *** END OF TITLE UPDATE BLOCK *** ---

            // 4. Add final bot message to UI
            const finalBotMessageForUI = {
                id: savedBotMessageResult.id, // Use ID from saved result
                sender: savedBotMessageResult.sender,
                text: savedBotMessageResult.text, // Use text from saved result (can serve as title/intro)
                type: botMessageType, // Will be 'text' or 'table'
                ...(botMessageType === "table" && botTableData && {
                    tables: [{ // Structure expected by rendering: an array of table objects
                        title: savedBotMessageResult.text, // Use the main text as a title for the table
                        headers: botTableData.headers,
                        rows: botTableData.rows
                    }]
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
                                            className={`ham-menu-icon active ${isBotResponding || isCreatingConversation  ? 'disabled' : ''}`} 
                                            onClick={!(isBotResponding || isCreatingConversation) ? toggleSidebar : undefined}
                                            style={{ cursor: (isBotResponding || isCreatingConversation) ? 'not-allowed' : 'pointer', opacity: (isBotResponding || isCreatingConversation) ? 0.6 : 1 }} 
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
                                                className={`newchat-icon ${isBotResponding || isCreatingConversation ? 'disabled' : ''}`}
                                                onClick={!(isBotResponding || isCreatingConversation) ? startNewChat : undefined}
                                                // Optional: Add style for disabled state in CSS for .newchat-icon.disabled
                                                style={{ cursor: (isBotResponding || isCreatingConversation) ? 'not-allowed' : 'pointer', opacity: (isBotResponding || isCreatingConversation) ? 0.6 : 1 }} 
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
                                                                opacity: (isBotResponding || isCreatingConversation) ? 0.6 : 1 
                                                            }} 
                                                        >
                                                            {/* Wrap title in a span and attach fetchMessages click here */}
                                                            <span 
                                                                onClick={!(isBotResponding || isCreatingConversation)  ? () => fetchMessages(chat.convo_id) : undefined}
                                                                // Make the title span take up available space and allow clicking
                                                                style={{ 
                                                                    flexGrow: 1, 
                                                                    cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer', 
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
                                                                className={`archive-icon ${isBotResponding || isCreatingConversation  ? 'disabled' : ''}`} 
                                                                // Attach archiveConversation click here, prevent if bot is responding
                                                                onClick={!(isBotResponding || isCreatingConversation)  ? (e) => {
                                                                    e.stopPropagation(); // Prevent triggering fetchMessages if li had a handler
                                                                    archiveConversation(chat.convo_id); 
                                                                } : undefined}
                                                                style={{
                                                                    cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer',
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
                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: (isBotResponding || isCreatingConversation)  ? 0.6 : 1 }} 
                                                        >
                                                            <span 
                                                                onClick={!(isBotResponding || isCreatingConversation)  ? () => fetchMessages(chat.convo_id) : undefined}
                                                                style={{ flexGrow: 1, cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer', paddingRight: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                            >
                                                                {chat.title}
                                                            </span>
                                                            <img
                                                                src="../../icons/repgen-icons/archive-icon.png" 
                                                                alt="Archive"
                                                                className={`archive-icon ${isBotResponding || isCreatingConversation  ? 'disabled' : ''}`} 
                                                                onClick={!(isBotResponding || isCreatingConversation)  ? (e) => { e.stopPropagation(); archiveConversation(chat.convo_id); } : undefined}
                                                                style={{ cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer', width: '24px', height: '24px', flexShrink: 0 }}
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
                                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: (isBotResponding || isCreatingConversation)  ? 0.6 : 1 }} 
                                                        >
                                                            <span 
                                                                onClick={!(isBotResponding || isCreatingConversation)  ? () => fetchMessages(chat.convo_id) : undefined}
                                                                style={{ flexGrow: 1, cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer', paddingRight: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                                                            >
                                                                {chat.title}
                                                            </span>
                                                            <img
                                                                src="../../icons/repgen-icons/archive-icon.png" 
                                                                alt="Archive"
                                                                className={`archive-icon ${(isBotResponding || isCreatingConversation)  ? 'disabled' : ''}`} 
                                                                onClick={!(isBotResponding || isCreatingConversation)  ? (e) => { e.stopPropagation(); archiveConversation(chat.convo_id); } : undefined}
                                                                style={{ cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer', width: '24px', height: '24px', flexShrink: 0 }}
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
                                    className={`sidebar-icons-ham-icon-wrapper ${(isBotResponding || isCreatingConversation)  ? 'disabled' : ''}`} 
                                    onClick={!(isBotResponding || isCreatingConversation)  ? toggleSidebar : undefined}
                                    style={{ cursor: (isBotResponding || isCreatingConversation)  ? 'not-allowed' : 'pointer', opacity: (isBotResponding || isCreatingConversation)  ? 0.6 : 1 }} 
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
                                        // --- 2. Use the Memoized ChatMessage Component ---
                                        messages.map((msg, index) => (
                                            <ChatMessage
                                                key={msg.id || index} // Use stable ID if available
                                                msg={msg}
                                                index={index}
                                                messagesLength={messages.length}
                                                downloadCSV={downloadCSV}
                                            />
                                        ))
                                    )}
                                </div>

                                <div className="textbar-container">
                                    <textarea
                                        ref={textareaRef}
                                        // Update placeholder and add disabled attribute based on BOTH states
                                        placeholder={(isBotResponding || isCreatingConversation) ? "Processing..." : "Ask anything"}
                                        className="text-input"
                                        value={inputText}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            // Prevent Enter key if bot is responding OR creating conversation
                                            if (e.key === "Enter" && !e.shiftKey && !(isBotResponding || isCreatingConversation)) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        rows="1"
                                        style={{ height: '40px' }}
                                        // Disable textarea if bot is responding OR creating conversation
                                        disabled={isBotResponding || isCreatingConversation}
                                    />
                                    <img
                                        src="../../icons/repgen-icons/sendmsg.png"
                                        // Add a class to visually disable the icon if needed
                                        className={`sendmsg-icon ${(isBotResponding || isCreatingConversation) ? 'disabled' : ''}`} 
                                        // Prevent click if bot is responding
                                        onClick={!(isBotResponding || isCreatingConversation) ? handleSendMessage : undefined} 
                                        alt="Send"
                                        // Optional: style changes for disabled state in CSS
                                        style={{ opacity: (isBotResponding || isCreatingConversation) ? 0.5 : 1, cursor: (isBotResponding || isCreatingConversation) ? 'not-allowed' : 'pointer' }}
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