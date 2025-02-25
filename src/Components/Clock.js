import React, { useState, useEffect } from "react";
import "./Clock.css"

const Clock = () => {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
  
    useEffect(() => {
      const updateClock = () => {
        const options = { timeZone: "America/Chicago", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" };
        const optionsDate = { timeZone: "America/Chicago", year: "numeric", month: "long", day: "numeric" };
        setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
        setDate(new Intl.DateTimeFormat("en-US", optionsDate).format(new Date()));
      };
      
      updateClock();
      const interval = setInterval(updateClock, 1000);
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className="clock-footer">
        <p>{date}</p>
        <p>{time} (Alabama, US)</p>
      </div>
    );
  };

  export default Clock;