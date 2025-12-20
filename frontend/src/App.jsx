import React from 'react'
import ReplyBox from "./components/ReplyBox"
import Prompt from "./components/Prompt"
import Menu from './components/Menu'
import GithubIcon from './assets/github-brands-solid-full.svg'
import LinkedInIcon from './assets/linkedin-brands-solid-full.svg'


const App = () => {
  const header = (
    <header className='flex flex-row justify-between my-2 items-center'>    
      <a href="/" className='font-ma text-white text-2xl font-extralight'>Try More Model</a>
      <nav className='flex flex-row gap-2'>
          <a target="_blank" href="https://github.com/runlingli" className="header-link">
            <img src={GithubIcon} alt="Github" className='w-10 h-10 hidden md:block'/>
          </a>
          <a target="_blank" href="https://www.linkedin.com/in/runling-li-093321322/" className="header-link" >
            <img src={LinkedInIcon} alt="LinkedIn" className='w-10 h-10 hidden md:block' />
          </a>
      </nav>
    </header>
  )
  const footer = (
    <div className='text-white font-ma my-2'>
      By runling
    </div>
  )
  
  return (
    <div className='min-h-screen flex overflow-x-hidden'>
      <Menu />
      <div className='flex flex-col  max-w-250 w-[90%] mx-auto px-10'>
        {header}
        <main className='flex-1 max-sm:mx-0 p-3 flex flex-col gap-3'>
        <Prompt />
        <ReplyBox /> 
        </main> 
        {footer}
      </div>
    </div>
  )
}

export default App
