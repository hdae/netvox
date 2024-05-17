import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Slider, Stack, Typography } from "@mui/material"
import { useEffect, useMemo } from "react"
import { useSnapshot } from "valtio"
import { Speaker } from "../api/voicevox/api"
import { defaultStore, store } from "../store"

export const Character = ({ speakers }: { speakers: Speaker[] }) => {
    const { speaker_uuid, speaker_id, tune } = useSnapshot(store)
    const styles = useMemo(() => speakers.find(speaker => speaker.speaker_uuid === speaker_uuid)?.styles, [speaker_uuid, speakers])
    useEffect(() => {
        store.speaker_id = styles?.at(0)?.id ?? store.speaker_id
    }, [styles])

    return (
        <Stack
            width="100%"
            direction="row"
            alignItems="stretch"
            justifyContent="stretch"
            gap={2}
        >
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Stack
                    direction="column"
                    gap={2}
                >
                    <FormControl fullWidth>
                        <InputLabel id="speaker">話者</InputLabel>
                        <Select
                            labelId="speaker"
                            label="話者"
                            value={speaker_uuid}
                            onChange={(ev) => store.speaker_uuid = ev.target.value}
                        >
                            {speakers.map((speaker) => (
                                <MenuItem key={speaker.speaker_uuid} value={speaker.speaker_uuid}>
                                    {speaker.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="style">スタイル</InputLabel>
                        <Select
                            labelId="style"
                            value={speaker_id}
                            label="スタイル"
                            onChange={(ev) => store.speaker_id = Number(ev.target.value)}
                        >
                            {styles?.map((style) => (
                                <MenuItem key={style.id} value={style.id}>
                                    {style.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, flex: 1 }}>
                <Stack direction="column">
                    <Typography variant="subtitle1">話速</Typography>
                    <Slider
                        size="small"
                        defaultValue={defaultStore.tune.speedScale}
                        step={0.01}
                        min={0.5}
                        max={2.0}
                        value={tune.speedScale}
                        aria-label="話速"
                        valueLabelDisplay="auto"
                        onChange={(_ev, value) => store.tune.speedScale = Number(value)}
                    />
                    <Typography variant="subtitle1">音高</Typography>
                    <Slider
                        size="small"
                        defaultValue={defaultStore.tune.pitchScale}
                        step={0.01}
                        min={-0.15}
                        max={0.15}
                        value={tune.pitchScale}
                        aria-label="音高"
                        valueLabelDisplay="auto"
                        onChange={(_ev, value) => store.tune.pitchScale = Number(value)}
                    />
                    <Typography variant="subtitle1">抑揚</Typography>
                    <Slider
                        size="small"
                        defaultValue={defaultStore.tune.intonationScale}
                        step={0.01}
                        min={0.5}
                        max={2.0}
                        value={tune.intonationScale}
                        aria-label="抑揚"
                        valueLabelDisplay="auto"
                        onChange={(_ev, value) => store.tune.intonationScale = Number(value)}
                    />
                    <Typography variant="subtitle1">音量</Typography>
                    <Slider
                        size="small"
                        defaultValue={defaultStore.tune.volumeScale}
                        step={0.01}
                        min={0.5}
                        max={2.0}
                        value={tune.volumeScale}
                        aria-label="音量"
                        valueLabelDisplay="auto"
                        onChange={(_ev, value) => store.tune.volumeScale = Number(value)}
                    />
                    <Button onClick={() => {
                        store.tune = { ...defaultStore.tune }
                    }}>
                        リセット
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    )
}
