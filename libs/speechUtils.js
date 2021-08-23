export function voiceURL(lessonID, voiceID, key) {
  return `${process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET_URL}/voice/${lessonID}/${voiceID}_${key}.mp3`
}