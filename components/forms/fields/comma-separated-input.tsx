import React, { useState, KeyboardEvent } from 'react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface CommaSeparatedInputProps {
    value: string[]
    onChange: (value: string[]) => void
    placeholder: string
    required?: boolean
    editing: boolean
}

export function CommaSeparatedInput({ value, onChange, placeholder, required, editing }: CommaSeparatedInputProps) {
    const [inputValue, setInputValue] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            if (inputValue.trim()) {
                onChange([...value, inputValue.trim()])
                setInputValue("")
            }
        }
    }

    const removeValue = (index: number) => {
        onChange(value.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
                {value.map((item, index) => (
                    <Badge key={index} variant="secondary">
                        {item}
                        {editing &&
                            (<button
                                type="button"
                                onClick={() => removeValue(index)}
                                className="ml-1 hover:text-destructive"
                            >
                                <X size={14} />
                            </button>)}
                    </Badge>
                ))}
            </div>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                placeholder={placeholder}
                required={required && value.length === 0}
                disabled={!editing}
            />
        </div>
    )
}

