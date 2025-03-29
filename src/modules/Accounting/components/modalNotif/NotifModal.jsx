import React, { useEffect, useState } from 'react';

const NotifModal = ({ isOpen, onClose, type = "success", title, message }) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setShowModal(true);
            const timer = setTimeout(() => {
                setShowModal(false);
                if (onClose) onClose();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!showModal) return null;

    const iconSrc = {
        success: "./accounting/success.svg",
        warning: "./accounting/warning.svg",
        error: "./accounting/error.svg",
    }[type] || "./accounting/success.svg";
    
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">


            <div className="bg-white p-20 rounded-lg shadow-lg relative z-[10000] transition-opacity duration-300">


                <div className="flex flex-col items-center">

                    
                    <img className='my-5' width={80} height={80} src={iconSrc} alt={type} />


                    <div className='space-y-5 text-center'>
                        <h1 className='text-2xl font-bold'>{title}</h1>
                        <p className='text-gray-500'>{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotifModal;
