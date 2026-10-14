import * as React from "react";

interface ButtonProps {
    onPress?: () => void;
    dangerous?: boolean;
    secondary?: boolean;
    disabled?: boolean;
    label?: string;
}

const getStyle = ( dangerous?: boolean, secondary?: boolean ): React.CSSProperties => {
    if ( dangerous ) {
        return { background: "var(--error)", color: "var(--white)", border: "none" }
    }
    if ( secondary ) {
        return {
            background: "var(--secondary)",
            color: "var(--white)",
            border: "1px solid rgb(159 159 175 / 0.2)",
        }
    }
    return { background: "var(--accent)", color: "var(--white)", border: "none" }
}

const Button: React.FC<ButtonProps> = ({ onPress, dangerous, secondary, disabled, label }) => {
    return (
        <button
            onClick={ onPress }
            disabled={ disabled }
            className="relative flex items-center justify-center w-70 h-9 rounded-xl cursor-pointer select-none text-sm font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={ getStyle( dangerous, secondary ) }

            onMouseEnter={ e => !disabled && ( e.currentTarget.style.filter = "brightness(1.15)" ) }
            onMouseLeave={ e => ( e.currentTarget.style.filter = "" ) }
            onMouseDown={ e => !disabled && ( e.currentTarget.style.transform = "scale(0.97)" ) }
            onMouseUp={ e => ( e.currentTarget.style.transform = "" ) }
        >
            <p className="font-semibold text-sm">{ label }</p>
        </button>
    );
};

export default Button;