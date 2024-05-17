import { proxy } from "valtio"

export type Tune = {
    speedScale: number,
    pitchScale: number,
    intonationScale: number,
    volumeScale: number,
}

export const defaultStore = {
    speaker_uuid: "7ffcb7ce-00ec-4bdc-82cd-45a8889e43ff",
    speaker_id: 0,
    tune: {
        speedScale: 1.0,
        pitchScale: 0.0,
        intonationScale: 1.0,
        volumeScale: 1.0,
    }
} as const

export type Store = {
    speaker_uuid: string
    speaker_id: number
    tune: Tune
}

export const store = proxy<Store>(defaultStore)
