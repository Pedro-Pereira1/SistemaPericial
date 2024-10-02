import React, { useState } from "react";
import AlertService from "./../services/AlertService";

const AlertPage3 = () => {
    // State for whether the creator is known (true for yes, false for no, null for no choice yet)
    const [creatorKnown, setCreatorKnown] = useState(null);

    // State for whether the creator responded (true for yes, false for no, null for no choice yet)
    const [creatorResponded, setCreatorResponded] = useState(null);

    // State to track the action result from the backend
    const [action, setAction] = useState("");

    // Handle form submission
    const handleSubmit = async () => {
        const alertContext = {
            creatorKnown: creatorKnown,
            creatorResponded: creatorResponded,
        };
        console.log("Submitting alert context:", alertContext);

        try {
            const result = await AlertService.processAlert(alertContext);
            setAction(result.action);
            alert(result)
        } catch (error) {
            console.error("Error processing alert:", error);
        }
    };

    // Handlers for selecting yes/no for creator known
    const handleCreatorKnownYes = () => {
        setCreatorKnown(true);
    };

    const handleCreatorKnownNo = () => {
        setCreatorKnown(false);
        setCreatorResponded(null);
    };

    // Handlers for selecting yes/no for creator response
    const handleCreatorRespondedYes = () => {
        setCreatorResponded(true);
    };

    const handleCreatorRespondedNo = () => {
        setCreatorResponded(false);
    };

    return (
        <div>
            <h1>Expert System</h1>

            {/* Yes/No checkboxes for Creator Known */}
            <label>Is the Creator Known?</label>
            <div>
                <label>
                    Yes
                    <input
                        type="checkbox"
                        checked={creatorKnown === true}
                        onChange={handleCreatorKnownYes}
                    />
                </label>
                <label>
                    No
                    <input
                        type="checkbox"
                        checked={creatorKnown === false}
                        onChange={handleCreatorKnownNo}
                    />
                </label>
            </div>

            {/* Yes/No checkboxes for whether the creator responded, only shows if the creator is known */}
            {creatorKnown == true && (
                <div>
                    <label>An email was sent to the creator!<br></br></label>
                    <label>Did the creator respond?</label>
                    <div>
                        <label>
                            Yes
                            <input
                                type="checkbox"
                                checked={creatorResponded === true}
                                onChange={handleCreatorRespondedYes}
                            />
                        </label>
                        <label>
                            No
                            <input
                                type="checkbox"
                                checked={creatorResponded === false}
                                onChange={handleCreatorRespondedNo}
                            />
                        </label>
                    </div>
                </div>
            )}

            {/* Submit button */}
            <button onClick={handleSubmit}>Submit</button>

            {/* Display the action result */}
            {action && (
                <div>
                    <h2>Action:</h2>
                    <p>{action}</p>
                </div>
            )}
        </div>
    );
};

export default AlertPage3;
