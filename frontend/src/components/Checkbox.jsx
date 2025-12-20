import useAIStore from "../stores/useAIStore";

function CheckboxGroup() {
  const checkedAI = useAIStore(state => state.checkedAI);
  const updateAI = useAIStore(state => state.updateAI);

  const options = Object.keys(checkedAI)

  const handleCheck = (key) => {
    updateAI({
      ...checkedAI,
      [key]: !checkedAI[key]
    })
  };

  return (
    <div className="flex flex-wrap gap-5">
      {options.map((option) => (
        <label key={option} className="relative flex items-center cursor-pointer gap-2">
          <input
            type="checkbox"
            checked={checkedAI[option]}
            onChange={() => handleCheck(option)}
            className="appearance-none cursor-pointer w-6 h-6 rounded-full border-2 relative border-[rgba(75,85,99,0.5)]"
          />
          <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-gray-600 pointer-events-none transition-all duration-200 
            ${checkedAI[option] ? 'scale-100 opacity-60' : 'scale-0 opacity-0'}`}></span>
            {/* $: calculate this expression first */}
          <span className="text-white font-ma">{option}</span>
        </label>
      ))}
    </div>
  );
}

export default CheckboxGroup;
