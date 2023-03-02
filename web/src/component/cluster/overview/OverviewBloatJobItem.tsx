import {Box, CircularProgress, Collapse, Divider, Grid, IconButton, Tooltip} from "@mui/material";
import {cloneElement, ReactElement, useState} from "react";
import {OpenIcon} from "../../view/OpenIcon";
import {CompactTable, SxPropsMap} from "../../../app/types";
import {Clear, Stop} from "@mui/icons-material";
import {useMutation} from "@tanstack/react-query";
import {bloatApi} from "../../../app/api";
import {shortUuid} from "../../../app/utils";
import {LinearProgressStateful} from "../../view/LinearProgressStateful";
import scroll from "../../../style/scroll.module.css"
import {DynamicRowVirtualizer} from "../../view/DynamicRowVirtualizer";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {useEventJob} from "../../../hook/EventJob";
import {ConsoleBlock} from "../../view/ConsoleBlock";

const SX: SxPropsMap = {
    console: {fontSize: "13px", width: "100%", background: "#000", padding: "10px 20px", borderRadius: "5px", color: "#e0e0e0"},
    row: {"&:hover": {color: "#7ec4ee"}},
    emptyLine: {textAlign: "center"},
    header: {fontWeight: "bold", cursor: "pointer"},
    loader: {margin: "10px 0 5px"},
    divider: {margin: "5px 0"},
    logs: {colorScheme: "dark"},
    button: {padding: "1px", color: '#f6f6f6'},
    tooltipBox: {marginLeft: "4px", width: "25px", display: "flex", alignItems: "center", justifyContent: "center"},
    separator: {marginLeft: "10px"},
    credential: {color: "rgba(192,192,192,0.7)", fontWeight: 500}
}

type Props = { compactTable: CompactTable }

export function OverviewBloatJobItem({compactTable}: Props) {
    const {uuid, status: initStatus, command, credentialId} = compactTable
    const [open, setOpen] = useState(false)
    const {isFetching, logs, status} = useEventJob(uuid, initStatus, open)

    const deleteOptions = useMutationOptions([["instance/bloat/list"]])
    const deleteJob = useMutation(bloatApi.delete, deleteOptions)
    const stopOptions = useMutationOptions()
    const stopJob = useMutation(bloatApi.stop, stopOptions)

    return (
        <ConsoleBlock>
            <Grid container sx={SX.header} onClick={() => setOpen(!open)}>
                <Grid item container justifyContent={"space-between"} flexWrap={"nowrap"}>
                    <Grid item container gap={1}>
                        <Box>Command</Box>
                        <Tooltip title={"Postgres Password ID"} placement={"right"}>
                            <Box sx={SX.credential}>{shortUuid(credentialId)}</Box>
                        </Tooltip>
                    </Grid>
                    <Grid item container xs={"auto"} sx={SX.separator}>
                        <Box sx={{color: status.color}}>{status.name}</Box>
                        {status.active ?
                            renderJobButton("Stop", <Stop/>, () => stopJob.mutate(uuid), stopJob.isLoading) :
                            renderJobButton("Delete", <Clear/>, () => deleteJob.mutate(uuid), deleteJob.isLoading)
                        }
                    </Grid>
                </Grid>
                <Grid item container justifyContent={"space-between"} flexWrap={"nowrap"}>
                    <Grid item>{command}</Grid>
                    <Grid item container xs={"auto"} sx={SX.separator}>
                        <Tooltip title={uuid}><Box>{shortUuid(uuid)}</Box></Tooltip>
                        <Tooltip title={"Open"}>
                            <Box sx={SX.tooltipBox}>
                                <IconButton sx={SX.button} size={"small"}>
                                    <OpenIcon open={open} size={18}/>
                                </IconButton>
                            </Box>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Collapse in={open}>
                <Divider sx={SX.divider} textAlign={"left"} light>LOGS</Divider>
                {logs.length === 0 ? isFetching ? (
                    <Box sx={SX.emptyLine}>{"< WAITING FOR LOGS >"}</Box>
                ) : (
                    <Box sx={SX.emptyLine}>{"< NO LOGS >"}</Box>
                ) : (
                    <DynamicRowVirtualizer
                        sx={SX.logs}
                        auto={status.active && open}
                        className={scroll.tiny}
                        sxVirtualRow={SX.row}
                        height={350}
                        rows={logs}
                    />
                )}
                <LinearProgressStateful sx={SX.loader} isFetching={isFetching} color={"inherit"} line />
            </Collapse>
        </ConsoleBlock>
    )

    function renderJobButton(title: string, icon: ReactElement, onClick: () => void, isLoading: boolean) {
        const fontSize = 18
        return (
            <Tooltip title={title} placement={"top"}>
                <Box sx={SX.tooltipBox}>
                    {isLoading ? <CircularProgress size={fontSize - 3}/> : (
                        <IconButton
                            sx={SX.button}
                            size={"small"}
                            onClick={(e) => {e.stopPropagation(); onClick()}}
                        >
                            {cloneElement(icon, {sx: { fontSize }})}
                        </IconButton>
                    )}
                </Box>
            </Tooltip>
        )
    }
}
