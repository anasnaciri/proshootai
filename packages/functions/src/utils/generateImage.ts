export const generateImage = async ({
  prompt,
  image,
  mask,
  style,
}: {
  prompt: string;
  image: string;
  mask: string;
  style: string;
}) => {
  try {
    const response = await fetch(
      'https://aymanbnn--main-comfy-python-api-serve-workflow.modal.run',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          image: image,
          style: style,
          mask: mask,
          client_id: 'unique_client_1204' + Math.random() + Date.now(),
          generationId: Date.now().toString(),
        }),
      },
    );

    console.log({ response });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    //await writeFile('response_image_2.png', Buffer.from(buffer));
    //console.log('Image saved as response_image_2.png')
    return buffer;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
