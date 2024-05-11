import { PropTypes } from "prop-types";
import { useState } from "react";
import "./Modal.css";
import utils from "../utils";

const AddFilmModal = ({ onClose, format }) => {
    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [stars, setStars] = useState("");
    const [year, setYear] = useState("");
    const [review, setReview] = useState("");
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleAddFilm = (e) => {
        e.preventDefault();
        let bodyContent;
        const newFilm = {
            title,
            director,
            stars,
            year,
            review,
        };
        switch (format) {
            case "application/json":
                bodyContent = JSON.stringify(newFilm);
                break;
            case "application/xml":
                bodyContent = utils.filmToXML(newFilm);
                break;
            case "text/plain":
                bodyContent = utils.filmToText(newFilm);
                break;
            default:
                bodyContent = "";
                break;
        }
        console.log(bodyContent);

        fetch(`${import.meta.env.VITE_API_URL}`, {
            method: "POST",
            headers: {
                "Accept": format,
            },
            body: bodyContent,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to add film");
            }
            return { message: "Film added successfully" };
        })
        .then((data) => {
            // Handle the response from the API
            console.log("Film added successfully:", data);
            setSuccessMessage("Film added successfully");
            setTimeout(() => {
                onClose();
            }, 1000);
        })
        .catch((error) => {
            console.error("Error adding film:", error);
            setErrorMessage(error.message);
        });
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content w-1/2" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">Add Film</h4>
                </div>
                <div className="modal-body">
                    <form action="">
                        <label htmlFor="title">Title</label>
                        <input
                            required={true}
                            type="text"
                            name=""
                            id=""
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <label htmlFor="director">Director</label>
                        <input
                            required={true}
                            type="text"
                            name=""
                            id=""
                            value={director}
                            onChange={(e) => setDirector(e.target.value)}
                        />

                        <label htmlFor="director">Stars</label>
                        <input
                            required={true}
                            type="text"
                            name=""
                            id=""
                            value={stars}
                            onChange={(e) => setStars(e.target.value)}
                        />

                        <label htmlFor="year">Year</label>
                        <input
                            required={true}
                            type="number"
                            name=""
                            id=""
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />

                        <label htmlFor="review">Review</label><br />
                        <textarea
                            required={true}
                            className="p-2 border border-gray-300 rounded-md" 
                            name=""
                            id=""
                            rows="10"
                            cols={65}
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                        ></textarea>

                        <p>{successMessage && successMessage}</p>
                        <p>{errorMessage && errorMessage}</p>
                        <button
                            type="submit"
                            value="Submit"
                            onClick={(e) => {
                                handleAddFilm(e);
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

AddFilmModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    format: PropTypes.string.isRequired,
};

export default AddFilmModal;
