import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';



function Message({ text, delay }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      
      delay > 60
      ? navigate("/loadingpage/t10")
      : navigate("/device/all")

    }, delay * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [delay]);

  useEffect(() => {
    if (visible) {
        message.loading({
            content: (
                <>
                <span>{text}</span>
                </>
            ),
            duration: delay - 1,
        });
    }
  }, [visible, text, delay]);

  return null;
}

export default Message;
