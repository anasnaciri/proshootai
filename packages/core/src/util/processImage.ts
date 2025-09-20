import sharp from 'sharp';
type ImageProcessingOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
};

export const processImage = async (
  buffer: Buffer,
  options: ImageProcessingOptions = {},
): Promise<Buffer> => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 90, // Higher quality default
    format = 'webp', // WebP gives best quality/size ratio
  } = options;

  //const sharp = (await import('sharp')).default;
  let pipeline = sharp(buffer).resize(maxWidth, maxHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({
        quality,
        progressive: true,
        // Remove mozjpeg as it can reduce quality
      });
      break;
    case 'webp':
      pipeline = pipeline.webp({
        quality,
        effort: 4, // Lower effort = better quality
        nearLossless: true, // Better quality
      });
      break;
    case 'png':
      pipeline = pipeline.png({
        compressionLevel: 6, // Balanced compression
        palette: false, // Keep original colors
      });
      break;
  }

  return pipeline.toBuffer();
};
