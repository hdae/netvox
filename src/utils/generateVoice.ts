import { AudioQuery, audioQueryAudioQueryPost, synthesisSynthesisPost } from "../api/voicevox/api"
import { Tune } from "../store"

export const generateVoice = async (text: string, speaker: number, tune: Tune) => {
    const query = await audioQueryAudioQueryPost({ text, speaker })
    const payload: AudioQuery = { ...query.data, ...tune }
    const synthesis = await synthesisSynthesisPost(payload, { speaker })
    return synthesis.data
}
