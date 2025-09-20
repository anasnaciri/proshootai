import { Sparkles } from 'lucide-react';
import { colors } from '@/config/constants';
import { useRef, useEffect } from 'react';
import { useCanvasContext } from '../context/CanvasContext';

const AdvancedPromptInput = () => {
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setIsInputFocused, prompt, setPrompt } = useCanvasContext();

  useEffect(() => {
    if (measureRef.current && inputRef.current) {
      // Add 8px padding to prevent text from touching the edges
      const width = measureRef.current.offsetWidth + 8;
      inputRef.current.style.width = `${width}px`;
    }
  }, [prompt]);

  return (
    <div className="absolute bottom-10 w-full flex items-center justify-center text-white ">
      <div className=" flex flex-col gap-1 items-center min-w-[50%] ">
        <div className="p-3 flex justify-between gap-2 bg-black/45 hover:bg-black/65 w-full transition-all duration-700 hover:shadow-inner  rounded-full backdrop-blur-sm max-w-full">
          <span
            ref={measureRef}
            className="absolute invisible whitespace-pre px-2 max-w-[90%]"
            aria-hidden="true"
          >
            {prompt || 'Type something...'}
          </span>
          <input
            ref={inputRef}
            className="bg-transparent ml-4 focus:border-none focus:outline-none active:border-none active:outline-none min-w-fit max-w-full "
            type="text"
            name=""
            placeholder="Enter your prompt..."
            id="propmtAdvancedInput"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocusCapture={() => {
              setIsInputFocused(true);
            }}
            onBlurCapture={() => {
              setIsInputFocused(false);
            }}
          />
          <button className="rounded-full p-4 bg-primary-500 hover:bg-primary-600 active:bg-primary-700">
            <Sparkles color={colors.primary[100]} size={24} />
          </button>
        </div>
        <div className="flex items-center text-sm">
          <button className="text-white/60 cursor-pointer hover:text-white px-4">
            remove background
          </button>
          <span className="h-4 w-px bg-white/20" />
          <button className="text-white/60 cursor-pointer hover:text-white px-4">
            upscale
          </button>
          <span className="h-4 w-px bg-white/20" />
          <button className="text-white/60 cursor-pointer hover:text-white px-4">
            erase object
          </button>
          <span className="h-4 w-px bg-white/20" />
          <button className="text-white/60 cursor-pointer hover:text-white px-4">
            download
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPromptInput;
