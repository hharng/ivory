import {Autocomplete, AutocompleteRenderInputParams, TextField} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {useDebounce} from "../../../hook/Debounce";

type Props = {
    keys: any[],
    onUpdate: (option: string | null) => void,
    onFetch: (value: string) => Promise<string[]>,
    disabled?: boolean,
    label?: string,
    placeholder?: string,
    variant?: "standard" | "filled" | "outlined";
    margin?: 'dense' | 'normal' | 'none';
    padding?: string,
    // NOTE: if you provide value it should be `null` for empty field
    value?: string | null,
}

export function AutocompleteFetch(props: Props) {
    const {label, placeholder, variant, margin} = props
    const {keys, onUpdate, onFetch, disabled = false, padding, value} = props

    const [inputValue, setInputValue] = useState("")
    const debInputValue = useDebounce(inputValue)

    const query = useQuery({
        queryKey: [...keys, debInputValue],
        queryFn: () => onFetch(debInputValue),
        enabled: !disabled
    })
    const options = query.data ?? []

    return (
        <Autocomplete
            fullWidth
            renderInput={renderInput}
            value={value}
            inputValue={inputValue}
            disabled={disabled}
            onInputChange={(_, v) => setInputValue(v)}
            options={options}
            loading={query.isPending}
            onChange={(_, v) => onUpdate(v)}
        />
    )

    function renderInput(params: AutocompleteRenderInputParams) {
        const inputProps = padding ? {...params.InputProps, style: {padding}} : params.InputProps
        return (
            <TextField
                {...params}
                InputProps={inputProps}
                size={"small"}
                label={label}
                variant={variant}
                margin={margin}
                placeholder={placeholder}
            />
        )
    }
}
