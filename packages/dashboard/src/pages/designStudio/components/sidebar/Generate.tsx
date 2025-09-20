import { api } from '@/lib/api';
import { useCanvasContext } from '../../context/CanvasContext';
import splitId from '../../../../utils/formatting/splitId';
import { addImage, exportImage } from '../../lib/canvas';
import FormField from '@/components/common/forms/FormField';
import { X } from 'lucide-react';
import { useParams } from 'react-router';

const Generate = () => {
  const { prompt, setPrompt, fabricRef, rectRef } = useCanvasContext();
  const { id } = useParams();
  const BUCKET = import.meta.env.VITE_BUCKET;
  const REGION = import.meta.env.VITE_AWS_REGION;

  const generate = async () => {
    try {
      // Step 1: Get the image URLs
      const { url, maskUrl } = (await exportImage({ fabricRef, rectRef })) as {
        url: string;
        maskUrl: string;
      };

      // Step 2: Initiate the generation
      const response = await api.post({
        url: '/generations',
        data: {
          image: url,
          mask: maskUrl,
          prompt,
          style:
            'https://miro.medium.com/v2/resize:fit:1024/1*rnsrSpcyKn90fM_Mjtx3dA.png',
          project: id,
        },
      });

      console.log({ response });

      if (response.id) {
        const { id } = response;

        // Step 3: Return a promise that resolves when polling is complete
        return new Promise((resolve, reject) => {
          // Initial wait before starting to poll
          setTimeout(async () => {
            const pollInterval = setInterval(async () => {
              try {
                const generation = await api.get({
                  url: `/generations/${splitId(id)}`,
                });

                console.log({ generation });

                if (generation.result.status === 'COMPLETE') {
                  console.log(
                    `https://${BUCKET}.s3.${REGION}.amazonaws.com/${generation.result.image}`,
                  );
                  clearInterval(pollInterval);
                  await addImage({
                    canvas: fabricRef,
                    url: `https://${BUCKET}.s3.${REGION}.amazonaws.com/${generation.result.image}`,
                    keepDetails: true,
                  });
                  resolve(generation.result);
                } else if (generation.result.status === 'FAILED') {
                  clearInterval(pollInterval);
                  reject(new Error('Generation FAILED'));
                }
                // If status is 'processing', continue polling
              } catch (error) {
                clearInterval(pollInterval);
                reject(error);
              }
            }, 10000); // Poll every 5 seconds
          }, 40000); // Initial 10 second wait
        });
      }
    } catch (error) {
      console.error('Error during generation:', error);
      throw error;
    }
  };

  // return (
  //   <div className="flex flex-col w-full">
  //     <input
  //       className="bg-transparent ml-4 focus:border-none focus:outline-none active:border-none active:outline-none min-w-fit max-w-full "
  //       type="text"
  //       name=""
  //       placeholder="Enter your prompt..."
  //       id="propmtAdvancedInput"
  //       value={prompt}
  //       onChange={(e) => setPrompt(e.target.value)}
  //     />
  //     <button
  //       onClick={generate}
  //       className="bg-primary-600 text-white px-2 py-2 rounded-lg w-full hover:bg-primary-500 active:bg-primary-700"
  //     >
  //       Generate
  //     </button>
  //   </div>
  // );
  return (
    <div className=" text-white p-5 rounded-lg space-y-6 w-full">
      <h1 className="text-2xl font-semibold mb-4">Generate Photoshoot</h1>

      <div className="border border-zinc-500 p-4 rounded-lg">
        <textarea
          className="w-full bg-transparent text-gray-300 resize-none focus:outline-none"
          rows={3}
          placeholder="Enter your prompt..."
          id="propmtAdvancedInput"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <button
        onClick={generate}
        className="bg-primary-600 text-white px-2 py-2 rounded-lg w-full hover:bg-primary-500 active:bg-primary-700"
      >
        Generate
      </button>
    </div>
  );
};

export default Generate;

const _formFields = () => {
  return (
    <div className="space-y-4">
      <FormField label="Product">
        <input
          type="text"
          className="w-full border border-zinc-500 bg-transparent text-gray-300 p-3 rounded-lg focus:outline-none"
          defaultValue="sofa"
        />
      </FormField>

      <FormField label="Placement">
        <div className="flex gap-2">
          <select className="border border-zinc-500 bg-transparent text-gray-300 p-3 rounded-lg w-32 focus:outline-none">
            <option>on</option>
          </select>
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full border border-zinc-500 bg-transparent text-gray-300 p-3 rounded-lg pr-10 focus:outline-none"
              defaultValue="a blue-tinted platform surrounc"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </FormField>

      {/* Reference Image */}
      <FormField label="Reference Image">
        <div className="flex gap-2">
          <div className="flex items-center gap-2 border border-zinc-500 bg-transparent px-3 py-2 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
            <span className="text-gray-300">Replace</span>
          </div>
          <button className="p-2 border border-zinc-500 bg-transparent rounded-lg">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </FormField>

      {/* Strength Controls */}
      <FormField label="Render strength">
        <select className="w-full border border-zinc-500 bg-transparent text-gray-300 p-3 rounded-lg focus:outline-none">
          <option>Default</option>
        </select>
      </FormField>

      <FormField label="Color strength">
        <select className="w-full border border-zinc-500 bg-transparent text-gray-300 p-3 rounded-lg focus:outline-none">
          <option>Default</option>
        </select>
      </FormField>

      <FormField label="Outline strength">
        <select className="w-full border border-zinc-500 bg-transparent text-gray-300 p-3 rounded-lg focus:outline-none">
          <option>Default</option>
        </select>
      </FormField>
    </div>
  );
};
