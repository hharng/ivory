import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {useIsFetching} from "@tanstack/react-query";
import {TableCellLoader} from "../../view/table/TableCellLoader";
import {TabProps} from "./Overview";
import {SxPropsMap} from "../../../type/common";
import {OverviewInstancesRow} from "./OverviewInstancesRow";

const SX: SxPropsMap = {
    table: {"tr:last-child td": {border: 0}},
    row: {cursor: "pointer"},
    cell: {padding: "5px 10px", height: "50px"},
    cellSmall: {padding: "5px 0", height: "50px"},
    actionCell: {width: "1%"},
    warningCell: {width: "1%"},
    roleCell: {width: "110px"},
    buttonCell: {width: "160px"},
    warning: {display: "flex", justifyContent: "center"},
}

export function OverviewInstances({info}: TabProps) {
    const {cluster, combinedInstanceMap} = info
    const instanceMapFetching = useIsFetching(["instance/overview", cluster.name])

    return (
        <Table size={"small"} sx={SX.table}>
            <TableHead>
                <TableRow>
                    <TableCell sx={SX.actionCell}/>
                    <TableCell sx={SX.warningCell}/>
                    <TableCell sx={SX.roleCell}>Role</TableCell>
                    <TableCell align={"center"}>Patroni</TableCell>
                    <TableCell align={"center"}>Postgres</TableCell>
                    <TableCell align={"center"}>State</TableCell>
                    <TableCell align={"center"}>Lag</TableCell>
                    <TableCellLoader sx={SX.buttonCell} isFetching={instanceMapFetching > 0}/>
                </TableRow>
            </TableHead>
            <TableBody>
                {Object.entries(combinedInstanceMap).map(([key, element]) => (
                    <OverviewInstancesRow key={key} domain={key} instance={element} cluster={cluster}/>
                ))}
            </TableBody>
        </Table>
    )
}
