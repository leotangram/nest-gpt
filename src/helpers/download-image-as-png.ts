import * as path from 'path';
import * as fs from 'fs';
import { InternalServerErrorException } from '@nestjs/common';
import * as sharp from 'sharp';

export const downloadImageAsPng = async (
  url: string,
  fullPath: boolean = false,
) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new InternalServerErrorException('Error downloading image');
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePNG = `${new Date().getTime()}.png`;
  const buffer = Buffer.from(await response.arrayBuffer());

  // fs.writeFileSync(`${folderPath}/${imageNamePNG}`, buffer);

  const completePath = path.join(folderPath, imageNamePNG);

  await sharp(buffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageNamePNG;
};

export const downloadBase64ImageAsPng = async (
  base64Image: string,
  fullPath: boolean = false,
) => {
  // Remover encabezado
  base64Image = base64Image.split(';base64,').pop();
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const imageNamePNG = `${new Date().getTime()}-64.png`;

  const completePath = path.join(folderPath, imageNamePNG);

  // Transformar a RGBA, png // Así lo espera OpenAI
  await sharp(imageBuffer).png().ensureAlpha().toFile(completePath);

  return fullPath ? completePath : imageNamePNG;
};
