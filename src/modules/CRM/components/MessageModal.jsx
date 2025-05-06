"use client";

import { useState, useEffect, useRef } from "react";

import { useAlert } from "../../Sales/components/Context/AlertContext.jsx";
import emailjs from "@emailjs/browser";
import Button from "../../Sales/components/Button.jsx";
import InputField from "../../Sales/components/InputField.jsx";
import TextField from "./TextField.jsx";

const MessageModal = ({ isOpen, onClose, campaign = {}, contacts }) => {
  const { showAlert } = useAlert();

  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isValidationVisible, setIsValidationVisible] = useState(false);

  const handleConfirm = () => {
    const validators = [validateMessage, validateSubject];

    const errorCount = validators.reduce(
      (count, validate) => count + (validate() ? 1 : 0),
      0
    );
    setIsValidationVisible(true);
    if (errorCount === 0) {
      // Send message here
      if (campaign && Object.keys(campaign).length > 0) {
        console.log("Campaign: " + campaign.campaign_name);
        console.log("Sending message type: " + campaign.type);
        console.log("Subject: " + subject);
        console.log("Message: " + message);

        console.log(contacts);
        contacts.forEach((contact) => {
          console.log("Sending message to: " + contact.email_address || "");
          console.log("Subject: " + subject);
          console.log("Message: " + message);

          try {
            emailjs.init("tJ0nVArt2LV_fm1Vv");
            emailjs.send("service_4tsfjrp", "template_c7ez4jz", {
              subject: `CAMPAIGN: ${campaign.campaign_name} - ${subject}`,
              name: contact.contact_person,
              content: message,
              email: contact.email_address,
            });
            showAlert({
              type: "success",
              title: "Message sent.",
            });
          } catch (error) {
            showAlert({
              type: "error",
              title: "Error sending message.",
            });
          }
        });
      } else {
        console.log("Sending message to: " + contacts[0]?.email_address || "");
        console.log("Subject: " + subject);
        console.log("Message: " + message);
        try {
          emailjs.init("tJ0nVArt2LV_fm1Vv");
          emailjs.send("service_4tsfjrp", "template_c7ez4jz", {
            subject,
            name: contacts[0]?.contact_person,
            content: message,
            email: contacts[0]?.email_address,
          });
          showAlert({
            type: "success",
            title: "Message sent.",
          });
        } catch (error) {
          showAlert({
            type: "error",
            title: "Error sending message.",
          });
        }
      }

      // Reset form fields
      setSubject("");
      setMessage("");
      setIsValidationVisible(false);
      onClose();
    } else {
      showAlert({
        type: "error",
        title: "Please complete the form correctly.",
      });
    }
  };

  const validateSubject = () => {
    if (!subject.trim()) {
      return "Subject is required.";
    }
    return "";
  };

  const validateMessage = () => {
    if (!message.trim()) {
      return "Message is required.";
    }
    return "";
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    // Focus the close button when modal opens
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    // Prevent scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-1000"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white pb-6 my-6 overflow-auto rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* HEADER */}
        <div className="w-full bg-[#EFF8F9] py-[20px] px-[30px] border-b border-[#cbcbcb]">
          <h2 id="modal-title" className="text-xl font-semibold">
            Message Contacts
          </h2>
        </div>

        {/* Close button */}
        <button
          ref={closeButtonRef}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 rounded-full p-1 text-3xl cursor-pointer transition-all duration-200"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* BODY */}
        <div className="px-6 mt-4">
          <form action="" className="space-y-4 mb-6">
            <InputField
              label={"Subject"}
              value={subject}
              setValue={setSubject}
              validation={validateSubject}
              isValidationVisible={isValidationVisible}
            />
            <TextField
              label={"Message"}
              value={message}
              setValue={setMessage}
              validation={validateMessage}
              isValidationVisible={isValidationVisible}
            />
          </form>

          <div className="mt-4 flex justify-between">
            <div>
              <Button
                type="primary"
                className={"mr-2"}
                onClick={handleConfirm}
                submit={true}
              >
                Send
              </Button>
            </div>
            <div>
              <Button type="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
