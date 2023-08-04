import { Link, useRouteError } from "react-router-dom";

export default function HomeError() {
    const error = useRouteError();
    
    return (
        <div className="coa-error">
            <h2>Errot</h2>
            <p>{error.message}</p>
            {/* <Link to="/">Back to homepage</Link> */}
        </div>
    )
}
