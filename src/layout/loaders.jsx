const ShadcnFastFrog4Loader = () => {
    return (
        <div>
            <div className="loader"></div>
        </div>
    )
}


const ShadcnCleverEarwig74Loader = ({stroke = "#fff", width = "40px", height = "40px", classess, strokewidth = "3"}) => {
    return (
        <div className={`spinner ${classess}`} style={{stroke, width, height}}>
            <svg viewBox="25 25 50 50" stroke-width={strokewidth} className="circular">
                <circle strokeMiterlimit="10" strokeWidth="3" fill="none" r="20" cy="50" cx="50" className="path"></circle>
            </svg>
        </div>
    )
}


export { ShadcnFastFrog4Loader, ShadcnCleverEarwig74Loader }