const sharp = require("sharp")
const fs = require("fs")

/**
 * Обрабатывает изображение с заданными параметрами
 * @param {Buffer} imageBuffer - Буфер входного изображения
 * @returns {Promise<Buffer>} Обработанное изображение в виде буфера
 */

const addNoise = (image, blockSize = 10) => {
  return image
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      for (let y = 0; y < info.height; y += blockSize) {
        for (let x = 0; x < info.width; x += blockSize) {
          const noise = Math.floor(Math.random() * 100) - 50 // Случайный шум от -50 до 50
          for (let dy = 0; dy < blockSize && y + dy < info.height; dy++) {
            for (let dx = 0; dx < blockSize && x + dx < info.width; dx++) {
              const idx = ((y + dy) * info.width + (x + dx)) * info.channels
              data[idx] = Math.min(255, Math.max(0, data[idx] + noise)) // Красный канал
              data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise)) // Зеленый канал
              data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise)) // Синий канал
            }
          }
        }
      }
      //   return sharp(data, { raw: info })
      return sharp(data, { raw: info }) // Применение размытия для сглаживания шума
    })
}

const processImage = async (imageBuffer, settings) => {
  const { brightness, noisePixel, blur } = settings

  try {
    let image = sharp(imageBuffer)

    // Шаг 1: Преобразование в градации серого
    // image = image.greyscale()
    // image = image.grayscale({ bayer: true }) // 50%
    // image = image.destroy()

    // Шаг 2: Настройка контрастности

    // Шаг 3: Добавление шума
    image = await addNoise(image, noisePixel)

    // Шаг 4: Настройка яркости
    image = image.linear(brightness, 0)

    // image = image.negate()

    // Шаг 5: Преобразование в JPEG
    image = image.toFormat("jpeg")

    // Шаг 6: Размытие
    image = image.blur(blur)

    // Шаг 6: Преобразование в буфер
    const modifiedImageBuffer = await image.toBuffer()

    return modifiedImageBuffer
  } catch (error) {
    throw new Error(`Ошибка при обработке изображения: ${error.message}`)
  }
}

module.exports = {
  processImage,
}
