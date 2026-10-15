import { downloadZip } from "client-zip";
import { LocalFile } from "../lib/crypto";

self.onmessage = async (e: MessageEvent) => {
    const { files, keyLength } = e.data as { files: File[], keyLength: number };

    try {
        let file = files[0];

        if ( files.length > 1 ) {
            self.postMessage( { type: "progress", payload: { statusText: `Zipping ${ files.length } files` } } );
            const blob = await downloadZip( files ).blob();
            file = new File( [ blob ], "files.zip", { type: "application/zip" } );
        }

        const result = await new LocalFile( file ).upload( keyLength, (p) => {
            self.postMessage( { type: "progress", payload: p } );
        } );

        self.postMessage( { type: "done", payload: result } );
    } catch ( err ) {
        self.postMessage( { type: "error", payload: String( err ) } );
    }
};