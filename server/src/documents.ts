export type DocumentUri = string
type DocumentBody = string

type TextDocumentIdentifier = {
    uri: string;
}

export interface VersionedTextDocumentIdentifier extends TextDocumentIdentifier  {
    version: number
}

export type TextDocumentContentChangeEvent = {
    text: string;
}

export const documents = new Map<DocumentUri, DocumentBody>()