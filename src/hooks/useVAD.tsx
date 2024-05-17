import { MicVAD, type RealTimeVADOptions } from "@ricky0123/vad-web"
import { useEffect, useRef } from "react"

export const useVAD = (options: Partial<RealTimeVADOptions>) => {
    const vadRef = useRef<MicVAD>()
    useEffect(() => {
        const promise = MicVAD.new(options)
        promise.then(vad => {
            vadRef.current = vad
            vadRef.current.start()
        })
        return () => {
            promise.then(vad => vad.destroy())
        }
    }, [options])
    return vadRef
}
