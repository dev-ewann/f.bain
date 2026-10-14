import { ForeignFile } from "../lib/crypto.ts";
import { useState } from "react";
import { useRevocationToken } from "../hooks/useRevocationToken.ts";
import { useFileDownload } from "../hooks/useFileDownload.ts";
import { useLocation, useParams } from "react-router-dom";
import Button from "./Button.tsx";

const Download = () => {
    const { uuid } = useParams<{ uuid: string }>()
    const location = useLocation()
    const hash = decodeURI( location.hash.substring( 1 ) )

    const { progress, filename, fileSize, previewUrl, handleDownload } = useFileDownload( uuid, hash )
    const { revocationToken, hasToken } = useRevocationToken( uuid, location.search, location.hash )

    const [ errorText, setErrorText ] = useState( "" )

    const [ copied, setCopied ] = useState( false )

    const handleShare = async () => {
        const link = `${ window.location.origin }${ location.pathname }${ location.hash }`

        try {
            await navigator.clipboard.writeText( link )
        } catch {
            const textarea = document.createElement( "textarea" )
            textarea.value = link
            textarea.style.position = "fixed"
            textarea.style.opacity = "0"
            document.body.appendChild( textarea )
            textarea.select()
            const ok = document.execCommand( "copy" )
            document.body.removeChild( textarea )

            if ( !ok ) {
                setErrorText( "Could not copy link" )
                return
            }
        }

        setErrorText( "" )
        setCopied( true )
        setTimeout( () => setCopied( false ), 2000 )
    }

    const handleDelete = async () => {
        if ( !uuid ) return
        if ( !window.confirm( "Are you sure ?" ) ) return

        const ok = await ForeignFile.delete( uuid, revocationToken )
        if ( ok ) {
            localStorage.removeItem( `revocation-${ uuid }` )
            window.location.href = "/"
        } else {
            setErrorText( "File deletion failed" )
        }
    }

    return (
        <div className="flex flex-col gap-1.5 items-center justify-center w-full min-h-screen">
            { previewUrl && <img src={ previewUrl } alt="preview" className="max-w-[90vw] max-h-[60vh] mb-4"/> }

            <p className="text-(--white) font-semibold text-xl break-all">{ filename }</p>
            <p className="text-sm text-(--primary) mb-2.5">{ fileSize }</p>

            <Button onPress={ handleShare } label={ copied ? "Copied!" : "Share" }/>
            <Button onPress={ handleDownload } label={ progress.text }/>
            <Button onPress={ handleDelete } label="Delete" dangerous={ true } disabled={ !hasToken }/>

            { errorText && <p className="text-red-500 text-sm">{ errorText }</p> }
        </div>
    )
}

export default Download