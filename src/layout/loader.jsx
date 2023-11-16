import LoadingBar from "react-top-loading-bar";


export function UiverseLoader({progress, progressfn, color}){
    return (
        <>
            <LoadingBar style={{zIndex: "99999999 !important"}} color={color} progress={progress} onLoaderFinished={() => progressfn(0)} />
            {/* <div
                style={{
                    '--size': '64px',
                    '--dot-size': '6px',
                    '--dot-count': '6',
                    '--color': '#fff',
                    '--speed': '1s',
                    '--spread': '60deg',
                }}
                className="dots"
                >
                <div style={{ '--i': 0 }} className="dot"></div>
                <div style={{ '--i': 1 }} className="dot"></div>
                <div style={{ '--i': 2 }} className="dot"></div>
                <div style={{ '--i': 3 }} className="dot"></div>
                <div style={{ '--i': 4 }} className="dot"></div>
                <div style={{ '--i': 5 }} className="dot"></div>
            </div> */}
            {/* <div className="slider">
                <div className="line"></div>
                <div className="subline inc"></div>
                <div className="subline dec"></div>
            </div>

            <div className="slider2">
                <div className="line"></div>
                <div className="subline inc"></div>
                <div className="subline dec"></div>
            </div> */}
        </>
    )
}