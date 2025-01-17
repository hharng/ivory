import {useQuery} from "@tanstack/react-query";
import {QueryApi} from "../app/api";
import {QueryChartRequest, QueryRunRequest, QueryType} from "../type/query";
import {useMutationAdapter} from "../hook/QueryCustom";

export function useRouterQueryList(type: QueryType, enabled: boolean = true) {
    return useQuery({
        queryKey: QueryApi.list.key(type),
        queryFn: () => QueryApi.list.fn(type),
        enabled,
    })
}

export function useRouterQueryUpdate(type: QueryType, onSuccess?: () => void) {
    return useMutationAdapter({
        mutationFn: QueryApi.update.fn,
        mutationKey: QueryApi.update.key(),
        successKeys: [QueryApi.list.key(type)],
        onSuccess: onSuccess,
    })
}

export function useRouterQueryDelete(type: QueryType, onSuccess?: () => void) {
    return useMutationAdapter({
        mutationFn: QueryApi.delete.fn,
        mutationKey: QueryApi.delete.key(),
        successKeys: [QueryApi.list.key(type)],
        onSuccess: onSuccess,
    })
}

export function useRouterQueryCreate(type: QueryType, onSuccess?: () => void) {
    return useMutationAdapter({
        mutationFn: QueryApi.create.fn,
        mutationKey: QueryApi.create.key(),
        successKeys: [QueryApi.list.key(type)],
        onSuccess: onSuccess,
    })
}

export function useRouterQueryRun(request: QueryRunRequest) {
    return useQuery({
        queryKey: QueryApi.run.key(request.queryUuid),
        queryFn: () => QueryApi.run.fn(request.queryUuid ? {...request, query: undefined} : request),
        enabled: true, retry: false, refetchOnWindowFocus: false,
    })
}

export function useRouterQueryCancel(uuid?: string) {
    return useMutationAdapter({
        mutationFn: QueryApi.cancel.fn,
        mutationKey: QueryApi.cancel.key(),
        successKeys: [QueryApi.run.key(uuid)],
    })
}

export function useRouterQueryTerminate(uuid?: string) {
    return useMutationAdapter({
        mutationFn: QueryApi.terminate.fn,
        mutationKey: QueryApi.terminate.key(),
        successKeys: [QueryApi.run.key(uuid)],
    })
}

export function useRouterQueryLog(uuid: string) {
    return useQuery({
        queryKey: QueryApi.getLog.key(uuid),
        queryFn: () => QueryApi.getLog.fn(uuid),
        enabled: true, retry: false, refetchOnWindowFocus: false,
    })
}

export function useRouterQueryLogDelete(uuid: string) {
    return useMutationAdapter({
        mutationFn: QueryApi.deleteLog.fn,
        mutationKey: QueryApi.deleteLog.key(),
        successKeys: [QueryApi.getLog.key(uuid)],
    })
}

export function useRouterQueryChart(request: QueryChartRequest, enabled: boolean = true) {
    return useQuery({
        queryKey: QueryApi.chart.key(request),
        queryFn: () => QueryApi.chart.fn(request),
        retry: false, enabled,
    })
}
