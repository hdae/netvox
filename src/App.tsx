import { Paper, Stack, Typography } from "@mui/material"
import type { RealTimeVADOptions } from "@ricky0123/vad-web"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import useWebSocket from "react-use-websocket"
import { useSnapshot } from "valtio"
import { speakersSpeakersGet } from "./api/voicevox/query"
import { Character } from "./components/Character"
import { useVAD } from "./hooks/useVAD"
import { store } from "./store"
import { generateVoice } from "./utils/generateVoice"
import { playBlob } from "./utils/playBlob"

export const App = () => {
    const { speaker_id, tune } = useSnapshot(store)

    const { data, isLoading, isError } = useQuery(["speakers"], () => speakersSpeakersGet())
    const [sentence, setSentence] = useState<string>()
    const { sendMessage, lastMessage } = useWebSocket("ws://localhost:8000/socket", { shouldReconnect: () => true })

    const playVoice = useCallback((text: string) => {
        setSentence(text)
        generateVoice(text, speaker_id, tune)
            .then(blob => playBlob(blob))
    }, [speaker_id, tune])

    useEffect(() => {
        const text = lastMessage?.data
        if (typeof text !== "string") return
        playVoice(text)
    }, [lastMessage, playVoice])

    const onSpeechEnd = useCallback((audio: Float32Array) => {
        console.log(audio.reduce((prev, cur) => prev + Math.abs(cur), 0) / audio.length)

        sendMessage(audio)
    }, [sendMessage])

    useVAD(
        useMemo<Partial<RealTimeVADOptions>>(
            () => ({ onSpeechEnd }),
            [onSpeechEnd],
        )
    )

    return (
        <Stack
            minWidth={600}
            direction="column"
            alignItems="stretch"
            justifyContent="stretch"
            gap={2}
        >
            <Paper
                variant="outlined"
                sx={{
                    p: 2,
                    height: 60,
                }}
            >
                <Typography>
                    {sentence}
                </Typography>
            </Paper>
            <Stack
                direction="row"
                alignItems="stretch"
                justifyContent="stretch"
                gap={2}
            >
                {
                    isLoading
                        ? (
                            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                                <Typography>
                                    VOICEVOXに接続を試みています...
                                </Typography>
                            </Paper>
                        )
                        : isError
                            ? (
                                <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                                    <Typography>
                                        VOICEVOXが見つかりません
                                    </Typography>
                                </Paper>
                            )
                            : data?.data === undefined
                                ? (
                                    <Character speakers={[]} />
                                )
                                : (
                                    <Character speakers={data.data} />
                                )
                }
            </Stack>
        </Stack>
    )
}
