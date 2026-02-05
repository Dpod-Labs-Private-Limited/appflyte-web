const createImage = url =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180
}

/**
 *
 * @param {File} image - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */
export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0, finalHeight, finalWidth, callbackFnc) {

  // new logic below ...
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.globalCompositeOperation = 'destination-over'

  canvas.width = finalWidth
  canvas.height = finalHeight

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (pixelCrop != null) {
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      finalWidth,
      finalHeight
    )
  }
  else {
    ctx.drawImage(
      image,
      0,
      0,
      finalWidth,
      finalHeight
    )
  }
  // As a blob
  return new Promise(resolve => {
    canvas.toBlob(callbackFnc, 'image/jpeg')
  })
}
