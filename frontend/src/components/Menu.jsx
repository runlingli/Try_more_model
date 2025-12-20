import React, { useState } from 'react';
import BarsIcon from '../assets/bars-solid-full.svg';
import useSessionStore from "../stores/useSessionStore";
import Modal from './Modal';
import MdReader from '../utils/MdReader';
import ChevronIcon from '../assets/chevron-button.svg'

const Menu = () => {
  const [expand, setExpand] = useState(false);
  const [showMessages, setShowMessages] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const sessions = useSessionStore(state => state.sessions);

  const openModal = (session) => {
    setCurrentSession(session);
    setIsModalOpen(true);
  };

  const toggleMessages = (name) => {
    setShowMessages((prev)=>({
        ...prev,
        [name]: !showMessages[name]
    }))
  }

  const closeModal = ()=> {
    setIsModalOpen(false)
    setShowMessages({})
  }

  return (
    <>
    <aside className={`fixed min-h-screen scrollbar-none md:bg-white/2 transition-all duration-500 ease-[cubic-bezier(0.5, 0, 0.75, 0)] z-1 w-11 
        ${expand ? ' w-60 shrink-0 bg-white/10 backdrop-blur-md' : ' md:w-14'}`}>
      
      <div className='w-full'>
        <button
          className='w-5 h-5 ml-3 my-3 md:w-6 md:h-6 md:ml-4 md:my-4 transition-all duration-300'
          onClick={() => setExpand(!expand)}
        >
          <img src={BarsIcon} alt="Menu" className='opacity-25'/>
        </button>
      </div>

      <div className='mt-20 px-2 w-full'>
        {Object.values(sessions).map((session, index) => (
          <button
            key={index}
            onClick={() => openModal(session)}
            className={`text-white font-ma h-10 whitespace-nowrap text-left overflow-hidden truncate mb-2 rounded-xl transition-all duration-300 ease-in-out  ${expand ? "w-full hover:bg-white/20 px-2": "w-0"}`}
          >
            {session.user_prompt}
          </button>
        ))}
      </div>
    </aside>
    <div className={`min-h-screen scrollbar-none transition-all duration-500 ease-[cubic-bezier(0.5, 0, 0.75, 0)] w-11
      ${expand ? ' md:w-60 shrink-0 backdrop-blur-md' : ' md:w-14'}`}>
        {/* just an overlay that pushes main part */}
    </div>
    <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className='flex flex-col md:flex-row gap-2'>
            <div className='flex flex-col w-full'>
                <h3 className='text-2xl font-medium'>User Prompt</h3>
                <p className='min-h-20 border border-white/40 rounded-xl p-1'>{currentSession?.user_prompt || ""}</p>
            </div>
            <div className='flex flex-col w-full'>
                <h3 className='text-2xl font-medium'>System Prompt</h3>
                <p className='min-h-20 border border-white/40 rounded-xl p-1'>{currentSession?.sys_prompt || ""}</p>
            </div>
        </div>
        <div className='text-white mt-2 gap-2 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))]'>
            {currentSession?.AIcontent && Object.entries(currentSession?.AIcontent).map(([name, response]) =>(
                <div key={name} className='flex flex-col'>
                    <div className='flex justify-between'>
                        <button onClick={() => toggleMessages(name)} className='font-medium text-xl flex items-center gap-1'>
                            <img src={ChevronIcon} alt="chevron" className={`w-5 h-5 transition-all duration-500 ease-in-out ${showMessages[name] ? "rotate-90" : "rotate-0"}`}
                            />
                            {name}
                        </button>
                        <h5 className='bg-white/30 rounded-xl px-1 flex items-center'>{response.cost.toFixed(4)}</h5>
                    </div>

                    <div
                        className={`overflow-hidden transition-all duration-500 linear ${
                            showMessages[name] ? "max-h-10000" : "max-h-0"
                        }`}
                        >
                        <MdReader text={response.content} />
                    </div>
                </div>
            ))}
        </div>    
    </Modal>
    </>
  );
};

export default Menu;
