import { Link } from "react-router-dom";

export default function CreateNewButton(props) {
    const { buttonColor, buttonURL } = props;

    return (
        <Link className={`btn ${buttonColor} btn-sm rounded-pill`} to={buttonURL}>
            Connect
        </Link>
    )
}