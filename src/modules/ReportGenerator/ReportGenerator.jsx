import React, { useState } from "react";
import "./styles/ReportGenerator.css";

const BodyContent = () => {
    const [messages, setMessages] = useState([]); 
    const [inputText, setInputText] = useState("");

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("Copied to clipboard!"))
            .catch(err => console.error("Failed to copy:", err));
    };

    const handleSendMessage = async () => {
        if (inputText.trim() !== "") {
            // Add user message to the conversation
            setMessages(prevMessages => [...prevMessages, { 
                sender: "user", 
                text: inputText, 
                type: "text" 
            }]);
            setInputText(""); 
    
            try {
                // Make GET request to Django backend
                const url = `http://127.0.0.1:8000/solution_customizing_chatbot/chatbot/?message=${encodeURIComponent(inputText)}`; // kapag full url, tsaka lang gumagana TT
                const response = await fetch(url); // Await the fetch call directly
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json(); // Parse the JSON response
    
                // Add bot's response to the conversation
                setMessages(prevMessages => [...prevMessages, { 
                    sender: "bot", 
                    text: data.response || "Sorry, I couldn't process that request.", 
                    type: "text" 
                }]);
            } catch (error) {
                console.error("Error sending message to chatbot:", error);
                setMessages(prevMessages => [...prevMessages, { 
                    sender: "bot", 
                    text: "An error occurred while processing your request.", 
                    type: "text" 
                }]);
            }
        }
    };

    return (
        <div className="repgen">
            <div className="body-content-container">
                <div className="main-content-container">
                    <div className="chat-history">
                        {messages.length === 0 ? (
                            <div className="welres-container">
                                <h1 className="welc-text">Hello, username.</h1>
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
                                                <div className="copy-icon-wrapper" onClick={() => copyToClipboard(`${msg.title}\n${msg.text2}`)}>
                                                    <img src="../../icons/repgen/copy.png" alt="Copy" className="copy-icon"/>
                                                    <span className={`tooltip ${index === messages.length - 1 ? 'right-aligned' : ''}`}>Copy Summary</span>
                                                </div>
                                                <div className="dl-icon-wrapper">
                                                    <img src="../../icons/repgen/download.png" alt="Download" className="download-icon"/>
                                                    <span className={`tooltip ${index === messages.length - 1 ? 'right-aligned' : ''}`}>Download Excel</span>
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
                            placeholder="Ask anything"
                            className="text-input"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={ (e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(); 
                                }
                            }}
                        />
                        <img
                            src="../../icons/repgen/sendmsg.png"
                            className="sendmsg-icon"
                            onClick={handleSendMessage}
                            alt="Send"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyContent;