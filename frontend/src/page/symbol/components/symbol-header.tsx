import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { RefreshCwIcon, Search } from "lucide-react";
import type { ChangeEvent } from "react";

interface SymbolHeaderProps {
    onSyncData: () => void
    handleSearch: (event: ChangeEvent<HTMLInputElement>) => void
}

export default function SymbolHeader({ onSyncData, handleSearch }: SymbolHeaderProps){
    return (
        <div>
            <h1>
                Symbol
            </h1>
            <div className="flex justify-items-center gap-6 mt-4">
                <InputGroupButton size="sm" className="ml-auto" variant="default" onClick={onSyncData}>
                    Sync Data <RefreshCwIcon />
                </InputGroupButton>
                <InputGroup>
                    <InputGroupInput placeholder="Search..." onChange={handleSearch}/>
                    <InputGroupAddon>
                    <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}