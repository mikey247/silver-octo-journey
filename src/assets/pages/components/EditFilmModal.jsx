import { PropTypes } from "prop-types";
import { useState } from "react";
import "./Modal.css";
import utils from "../utils";

const EditFilmModal = ({ film, onClose, format }) => {
    const [editedTitle, setEditedTitle] = useState(film.title);
    const [editedDirector, setEditedDirector] = useState(film.director);
    const [editedStars, setEditedStars] = useState(film.stars);
    const [editedYear, setEditedYear] = useState(film.year);
    const [editedReview, setEditedReview] = useState(film.review);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleEditFilm = (e) => {
        e.preventDefault();
        let bodyContent;
        const updatedFilm = {
            id: film.id,
            title: editedTitle,
            director: editedDirector,
            stars: editedStars,
            year: editedYear,
            review: editedReview,
        };
        switch (format) {
            case "application/json":
                bodyContent = JSON.stringify(updatedFilm);
                break;
            case "application/xml":
                bodyContent = utils.filmToXMLWithID(updatedFilm);
                break;
            case "text/plain":
                bodyContent = utils.filmToTextWithID(updatedFilm);
                break;
            default:
                bodyContent = "";
                break;
        }
        console.log(bodyContent);

        fetch(`${import.meta.env.VITE_API_URL}`, {
            method: "PUT",
            headers: {
                "Accept": format,
            },
            body: bodyContent,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update film");
            }
            return {message: "Film updated successfully"};
        })
        .then((data) => {
            // Handle the response from the API
            console.log("Film updated successfully:", data);
            setSuccessMessage("Film updated successfully");
            setTimeout(() => {
                onClose();
            }, 1000);
        })
        .catch((error) => {
            console.error("Error updating film:", error);
            setErrorMessage(error.message);
        });
    };

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content w-1/2" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h4 className="modal-title">Edit Film</h4>
                </div>
                <div className="modal-body">
                    <form action="">
                        <label htmlFor="title">Title</label>
                        <input
                            required={true}
                            type="text"
                            name=""
                            id=""
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                        />

                        <label htmlFor="director">Director</label>
                        <input
                            required={true}
                            type="text"
                            name=""
                            id=""
                            value={editedDirector}
                            onChange={(e) => setEditedDirector(e.target.value)}
                        />

                        <label htmlFor="director">Stars</label>
                        <input
                            required={true}
                            type="text"
                            name=""
                            id=""
                            value={editedStars}
                            onChange={(e) => setEditedStars(e.target.value)}
                        />

                        <label htmlFor="year">Year</label>
                        <input
                            required={true}
                            type="number"
                            name=""
                            id=""
                            value={editedYear}
                            onChange={(e) => setEditedYear(e.target.value)}
                        />

                        <label htmlFor="review">Review</label><br />
                        <textarea
                            required={true}
                            className="p-2 border border-gray-300 rounded-md" 
                            name=""
                            id=""
                            rows="10"
                            cols={65}
                            value={editedReview}
                            onChange={(e) => setEditedReview(e.target.value)}
                        ></textarea>

                        <p>{successMessage && successMessage}</p>
                        <p>{errorMessage && errorMessage}</p>
                        <button
                            type="submit"
                            value="Submit"
                            onClick={(e) => {
                                handleEditFilm(e);
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

EditFilmModal.propTypes = {
    film: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        director: PropTypes.string.isRequired,
        stars: PropTypes.string.isRequired,
        year: PropTypes.number.isRequired,
        review: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    format: PropTypes.string.isRequired,
};

export default EditFilmModal;