import log from './log'
import { initialize } from './methods/initialize';
import { completion } from './methods/textDocument/completion';
interface Message {
    jsonrpc: string;
}

export interface RequestMessage extends Message {
    id: number | string;
    method: string;
    params?: unknown[] | object;
}

type RequestMethod=(message: RequestMessage) => object

const methodLookup: Record<string, RequestMethod>  = {
    initialize,
    "textDocument/completion": completion
}

const respond = (id: RequestMessage['id'], result: unknown)=> {
    const message = JSON.stringify({id, result})
    const messageLength = Buffer.byteLength(message, "utf-8")
    const header = `Content-Length: ${messageLength}\r\n\r\n`

    log.write(header + message)

    process.stdout.write(header+ message)
}

let buffer = '';
process.stdin.on("data", (chunk) => {
    buffer += chunk.toString()

    while (true) {
        // Try to match the 'Content-Length' header in the buffer
        const lengthMatch = buffer.match(/Content-Length: (\d+)\r\n/);
        // If no 'Content-Length' header is found, exit the loop
        // as it means there's not enough data to form a complete message
        if (!lengthMatch) break;
    
        // Parse the content length from the matched header. lengthMatch[1] = (\d+)
        const contentLength = parseInt(lengthMatch[1], 10);
        // Find the start of the actual message content, which is after the header
        // The header ends at "\r\n\r\n" + 4 (because 4 characters)
        const messageStart = buffer.indexOf("\r\n\r\n") + 4;
    
        // Check if the entire message based on content length has been received
        // If not, break the loop to wait for more data
        if (buffer.length < messageStart + contentLength) break;
    
        // Extract the raw message content from the buffer
        // using the start index and content length
        const rawMessage = buffer.slice(messageStart, messageStart + contentLength);
        // Parse the extracted content as JSON
        const message = JSON.parse(rawMessage);
    
        log.write({id: message.id, method: message.method});
    
        // Look up a method based on the message's method
        // and call it if it exists
        const method = methodLookup[message.method];
        if (method) {
            respond(message.id, method(message));
        }
    
        // Update the buffer by removing the processed message
        // This prepares the buffer for processing the next message
        buffer = buffer.slice(messageStart + contentLength);
    }
    
});