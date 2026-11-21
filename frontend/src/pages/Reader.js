import React, { useState, useEffect } from 'react';
import "../App.css";
import { API_URL } from "../api";
export default function Reader()
{
    const [output, setOutput] = useState("");
   
    async function GenerateText()
    {
        //try {
            const groqOutput = await fetch(`${API_URL}/api/Reader`, 
                {
                method: "POST",
              });
              const groqOutputText = await groqOutput.json();
              setOutput(groqOutputText.text);
        //}
    
    }
    useEffect(() => {
       /* fetch(`${API_URL}/api/Reader`, 
            {
            method: "POST",
          })
        .then(data => data.json())
        .then(data => setOutput(data))
        .catch(error => {console.error("generation falied: ", error)})*/
        GenerateText()
    }, [])

    return(
        <div className="main-reader-container">
            <button onClick={GenerateText}>Generate text</button>
            <br></br>
  <p>{output}</p>  
    </div>
    );
}
