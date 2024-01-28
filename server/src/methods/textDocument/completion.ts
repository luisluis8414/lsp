import { DocumentUri, documents } from "../../documents";
import { RequestMessage } from "../../server";
import * as fs from 'fs'
import log from '../../log'

const words = fs.readFileSync('/usr/share/dict/american-english').toString().split('\n')


interface CompletionItem {
    label: string;
}

interface CompletionList {
    isIncomplete: boolean;
    items: CompletionItem[];
}

interface TextDocumentPositionParams {
	textDocument: TextDocumentIdentifier;
	position: Position;
}

interface TextDocumentIdentifier {
	uri: DocumentUri;
}

interface Position {
	line: number;
	character: number;
}

export interface CompletionParams extends TextDocumentPositionParams{

}

export const completion = (message: RequestMessage): CompletionList | null => {
    const params = message.params as CompletionParams
    const content = documents.get(params.textDocument.uri)
    if(!content) {
        return null
    }

    const currentLine = content.split('\n')[params.position.line]
    const lineUntilCursor = currentLine.slice(0, params.position.character)
    const currentWord = lineUntilCursor.replace(/.*\W(.*?)/, '$1')


    const items = words.filter((word)=>{
        return word.startsWith(currentWord)
    }).slice(0, 1000).map((word) => {
        return {label: word}
    })
    
    return {
        isIncomplete: true,
        items
    }
}