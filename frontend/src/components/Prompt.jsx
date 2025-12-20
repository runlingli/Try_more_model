import React from 'react'
import axios from "axios";
import { useState, useEffect } from "react";
import useAIStore from "../stores/useAIStore";
import CheckBox from "./Checkbox";
import useSessionStore from "../stores/useSessionStore";


const Prompt = () => {
  const [sprompt, setSysPrompt] = useState("You are a helpful assistant.");
  const [uprompt, setUsrPrompt] = useState("");
  const updateRepl = useAIStore((state) => state.updateRepl);
  const AIcontent = useAIStore((state) => state.AIcontent);
  const checkedAI = useAIStore((state) => state.checkedAI);
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(0)
  const [contentGenerated, setContentGenerated] = useState(false)
  const createSession = useSessionStore(state => state.createSession);

  const saveLocal = () => {
    createSession(uprompt, sprompt, AIcontent);
    setContentGenerated(false);
  };

  useEffect(() => {
    if (!loading) return;
    const intervalId = setInterval(() => {
      setTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(intervalId);
  }, [loading]);

  const handleSend = async () => {

    if (!uprompt) return;
      // if no prompt passing
    setLoading(true);
    console.log(uprompt)
    console.log(checkedAI)
    try {
      const { data } = await axios.post("http://127.0.0.1:8000/chat", {
        "sys_prompt": sprompt,
        "user_prompt": uprompt,
        "enable": checkedAI  
      });
      console.log("Sent to the backend")
      Object.keys(data).forEach((key) => {
        console.log(key, data[key])
        updateRepl(key, data[key])
      });
    } catch (err) {
      updateRepl("Fetch error: " + err.message);
    } finally {
      console.log(AIcontent)
      setLoading(false);
      setContentGenerated(true)
    }
  };

  return (
    <>
      <h1 className="text-3xl font-ma text-white">Chat with AI</h1>
      <div className='flex flex-col gap-2 w-full md:flex-row'>
        <div className='flex flex-col w-full gap-1'>
          <h2 className='text-xl font-ma text-white max-sm:self-center'>User prompt</h2>
          <textarea
            className="border border-gray-600 min-h-50 rounded-2xl scrollbar-none p-2 text-white font-ma focus:outline-1 focus:outline-white"
            value={uprompt}
            onChange={(e) => setUsrPrompt(e.target.value)}
            placeholder="Type your message here..."    
          />
        </div>
        <div className='flex flex-col w-full gap-1'>
          <h2 className='text-xl font-ma text-white max-sm:self-center'>System prompt</h2>
          <textarea
            className="border border-gray-600 min-h-50 rounded-2xl scrollbar-none p-2 text-white font-ma focus:outline-1 focus:outline-white"
            value={sprompt}
            onChange={(e) => setSysPrompt(e.target.value)} 
          />
        </div>
      </div>      

      <CheckBox />

      {contentGenerated ?
        <div className='flex justify-center gap-2 w-full'>
          <button 
            className="bg-white text-indigo-950 text-lg px-2 cursor-pointer rounded-3xl w-25 font-ma disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={saveLocal}>
            Save
          </button>
          <button 
            className="bg-white text-indigo-950 text-lg opacity-70 px-2 cursor-pointer rounded-3xl w-25 font-ma"
            onClick={()=>setContentGenerated(false)}>
            Discard
          </button>
        </div>
        :
        <button 
          className="bg-white text-indigo-950 text-lg px-2 rounded-3xl w-25 self-center font-ma cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend} disabled={loading 
            || !sprompt.trim() 
            || !uprompt.trim() 
            || Object.values(checkedAI).every(value => value === false)
          }>
          {loading ? time.toFixed(1) + "s" : "Send"/* toFixed keep one decimal */}
        </button>
      }

    </>
  )
}

export default Prompt

