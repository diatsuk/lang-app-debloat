const express = require("express");
const router = express.Router();
 router.post('/', async (req,res) => 
    {

   try

   {const  messages = [
      {
        "role": "user",
        "content": "Generate text from public domain english book for 500 symbols, answer only with generated text"
      }]

       const groqOutputRaw = await fetch("https://api.groq.com/openai/v1/chat/completions", 
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages
       
      }),
    })
    const groqOutputText = await groqOutputRaw.json()
      if(!groqOutputRaw.ok)
      {
         console.error("groq request failed: ", groqOutputRaw)
      }
      const finalOutput = groqOutputText.choices[0].message.content;

      return res.json({
        text: finalOutput,
      });
   }

   catch(error)
   {
      console.error("text generation failed: ", error)
   }
  
    }
   );

module.exports = router; 
