import { create } from 'zustand'
import { combine } from "zustand/middleware";

const useAIStore = create(
    combine({ AIcontent: {}, 
        checkedAI: {
            "OpenAI-4-mini": true, 
            "Deepseek-chat": true, 
            "Deepseek-reasoner": true
        }},
        (set) => {
            return {
                updateRepl: (aiName, aiReply) => set((state)=>({
                    ...state,
                    AIcontent: {
                        ...state.AIcontent,
                        [aiName]: {
                        content: aiReply.reply,
                        cost: aiReply.cost
                        }
                        // []calculating the name
                    }
                    
                })),
                updateAI: (AIlist) => set((state)=>({
                    ...state,
                    checkedAI: AIlist
                }))
            };
        }
    ) 
)

export default useAIStore