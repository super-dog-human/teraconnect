import { ZSTDDecoder } from 'zstddec'
const decoder = new ZSTDDecoder()

export async function decompressZstd(compressed) {
  await decoder.init()
  return decoder.decode(new Uint8Array((compressed)))
}