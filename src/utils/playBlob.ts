import { Howl } from "howler"

export const playBlob = (data: Blob) => {
    const src = URL.createObjectURL(data)
    const howler = new Howl({
        src,
        autoplay: true,
        format: "wav",
        onend: () => {
            URL.revokeObjectURL(src)
            howler.unload()
        }
    })
}
