export const FRAME_COUNT = 120
export const FRAME_WIDTH = 630
export const FRAME_HEIGHT = 623

export const frameSrc = (i: number) => `/hero-frames/${String(i).padStart(3, "0")}.webp`

export function createFrameSequence(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")
  const images: HTMLImageElement[] = []
  let current = 0

  const draw = (i: number) => {
    const img = images[i]
    if (!ctx || !img?.complete || img.naturalWidth === 0) return false
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return true
  }

  const load = (i: number) => {
    const img = new Image()
    img.decoding = "async"
    img.onload = () => {
      if (i === current) draw(i)
    }
    img.src = frameSrc(i)
    images[i] = img
  }

  load(0)
  for (let i = 1; i < FRAME_COUNT; i++) load(i)

  return {
    render(frame: number) {
      current = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frame)))
      draw(current)
    },
    dispose() {
      images.forEach((img) => (img.onload = null))
    },
  }
}
