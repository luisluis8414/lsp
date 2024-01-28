import { RequestMessage } from "../../server";

interface CompletionItem {
    label: string;
}

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

export const completion = (message: RequestMessage): CompletionList => {
    return {
        isIncomplete: false,
        items: [{
            label: "Typescript"
        },
        { label: "Lua" },
        { label: "Python" }]
    }
}