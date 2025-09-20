import { Resource } from 'sst';
import { Handler } from 'aws-lambda';
import { Example } from '@proshootai/core/example';
import { Generation } from '@proshootai/core/generation';
import { generateImage } from './utils/generateImage';

export const handler: Handler = async (event) => {
  console.log({ event: event.style });
  try {
    // Generate image
    const { generationId, image, mask, prompt, style, project, userId } = event;

    const generatedImage = await generateImage({
      image,
      mask,
      prompt,
      style,
    });

    if (!generatedImage) {
      throw new Error('Image generation failed');
    }

    // Upload to S3
    const key = await Generation.uploadToS3({
      id: generationId,
      user: userId,
      project,
      generatedImage: Buffer.from(generatedImage),
    });

    console.log({ key });

    // Update with success
    const update = await Generation.update({
      id: generationId,
      status: 'COMPLETE',
      image: key,
      user: userId,
    });

    console.log({ update });
  } catch (error) {
    // Log the error for debugging
    console.error('Generation failed:', error);

    // Update with failure status and error message
    await Generation.update({
      id: event.generationId,
      status: 'FAILED',
      user: event.userId,
    });
  }

  return {
    statusCode: 200,
    body: `${Example.hello()} Linked to ${Resource.Uploads.name}.`,
  };
};
