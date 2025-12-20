import { create } from 'zustand'
import { persist} from 'zustand/middleware'

const useSessionStore = create()(
  persist(
    (set, get) => ({
      sessions: {},
      createSession: (user_prompt, sys_prompt, AIcontent) => {
        const id = Date.now().toString();
        const newSessions = {
          ...get().sessions,
          [id]:{
            user_prompt,
            sys_prompt,
            AIcontent,
            createdAt: Date.now(),
          }
        };
        set({sessions: newSessions})
      },
      deleteSession: (id) => {
        const {[id]:_, ...deletedSession} = get().sessions
        set({sessions: deletedSession})
      }
    }),
    {
      name: 'ai_sessions', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), 
      // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useSessionStore