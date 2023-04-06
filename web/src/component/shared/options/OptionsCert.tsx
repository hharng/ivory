import {useMemo} from "react";
import {useMutation, useQuery} from "@tanstack/react-query";
import {certApi, clusterApi} from "../../../app/api";
import {AutocompleteUuid, Option} from "../../view/AutocompleteUuid";
import {CertOptions, shortUuid} from "../../../app/utils";
import {useMutationOptions} from "../../../hook/QueryCustom";
import {CertType} from "../../../type/cert";
import {Certs, Cluster} from "../../../type/cluster";

const keys = {
    [CertType.CLIENT_CA]: "clientCAId",
    [CertType.CLIENT_CERT]: "clientCertId",
    [CertType.CLIENT_KEY]: "clientKeyId",
}

type Props = {
    type: CertType,
    cluster: Cluster,
}

export function OptionsCert(props: Props) {
    const { type, cluster } = props
    const certKey = keys[type]
    const certId = cluster.certs[certKey as keyof Certs] ?? ""
    const { label } = CertOptions[type]

    const query = useQuery(["certs", type], () => certApi.list(type))
    const options = useMemo(handleMemoOptions, [query.data])

    const updateMutationOptions = useMutationOptions([["cluster/list"]])
    const updateCluster = useMutation(clusterApi.update, updateMutationOptions)

    return (
        <AutocompleteUuid
            label={label}
            selected={{key: certId, short: shortUuid(certId)}}
            options={options}
            loading={query.isLoading || updateCluster.isLoading}
            onUpdate={handleUpdate}
        />
    )

    function handleUpdate(option: Option | null) {
        updateCluster.mutate({...cluster, certs: {...cluster.certs, [certKey]: option?.key}})
    }

    function handleMemoOptions(): Option[] {
        return Object.entries(query.data ?? {}).map(([key, value]) => ({ key, short: shortUuid(key), name: value.fileName }))
    }
}