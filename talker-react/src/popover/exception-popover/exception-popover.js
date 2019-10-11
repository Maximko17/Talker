import React from 'react'
import "./exception-popover.css"

export default function exceptionPopover(message) {
    return (
        <div className="exception-popup">
            {message}
        </div>
    )
}
