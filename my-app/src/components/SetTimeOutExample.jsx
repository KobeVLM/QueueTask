import { useState, useEffect } from "react";


export default function SetTimeOutExample({ onComplete })
{
    const [width,setWidth] = useState(100)
    useEffect(()=>{
            setTimeout(
                ()=>{
                setWidth((width-2) % 100);
                if (width <= 0) {
                    setWidth(100);
                    if (onComplete) {
                        onComplete();
                    }
                }
                console.log(width)
            },100);
        },[width, onComplete])
    return <>
        <div style={{width:width + "%", backgroundColor:"#f00"}}>&nbsp;</div>
    </>
}