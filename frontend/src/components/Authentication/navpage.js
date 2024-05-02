/**
 * Navigation page component for Rev's American Grill. This component handles user navigation and language selection.
 * It initializes the Google API client and displays different navigation buttons based on user roles,
 * along with a language selection dropdown. It also includes hidden login functionality.
 *
 * @component
 * @param {Object} props - The props passed to the component.
 * @param {Object} props.languages - Available languages for the user to select.
 * @param {Function} props.setCurrLanguage - Function to set the current language.
 * @param {string} props.currLanguage - Currently selected language.
 * @example
 * const languages = { English: 'en', Spanish: 'es' };
 * const [currLanguage, setCurrLanguage] = useState('en');
 * return (
 *   <Nav languages={languages} setCurrLanguage={setCurrLanguage} currLanguage={currLanguage} />
 * )
 */

import { Button } from "@mui/material";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logout } from "./logout";
import { gapi } from "gapi-script";
import { Login } from "./login";
import { ReactComponent as ReveilleLogo } from "../../img/reveille_logo.svg";
import "./navpage.css";

const clientID =
    "476374173797-vghpjr5o250bgv0mtuukj5b9bosvelfr.apps.googleusercontent.com";

function Nav({ languages, setCurrLanguage, currLanguage }) {
    sessionStorage.setItem("user_email", "");

    useEffect(() => {
        /**
         * Initializes Google API client.
         */
        function start() {
            gapi.client.init({
                clientID: clientID,
                scope: "",
            });
        }

        gapi.load("client:auth2", start);
    }, []);

    /**
     * Handles the change event for language selection.
     * Updates the current language state.
     *
     * @param {Object} event - The event object from the select input.
     */

    const handleChange = (event) => {
        setCurrLanguage(event.target.value);
    };

    return (
        <div className="navigation-page">
            <div className="page-header">
                <ReveilleLogo className="logo" />
                <h1>Welcome To Rev's American Grill</h1>
            </div>

            <div className="control-panel">
                <FormControl variant="outlined" className="custom-select">
                    <InputLabel>Language</InputLabel>
                    <Select
                        value={currLanguage}
                        label="Language"
                        onChange={handleChange}
                    >
                        {Object.keys(languages).map((lang) => (
                            <MenuItem key={lang} value={lang}>
                                {lang}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Logout />
            </div>

            <div className="nav-container" style={{ margin: 10 }}>
                <Link to="/manager">
                    <Button variant="outlined">Manager</Button>
                </Link>
                <Link to="/cashier">
                    <Button variant="outlined">Cashier</Button>
                </Link>
                <Link to="/customer">
                    <Button variant="outlined">Kiosk</Button>{" "}
                    {/* New button for Kiosk */}
                </Link>
                <Link to="/menu">
                    <Button variant="outlined">Menu</Button>
                </Link>
                <Link to="/kitchen">
                    <Button variant="outlined">Kitchen</Button>
                </Link>
            </div>

            <div style={{ display: "none" }}>
                <Login />
            </div>
        </div>
    );
}

export { Nav };
