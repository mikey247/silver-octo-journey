const fromXml = (data) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "application/xml");
    const films = xmlDoc.querySelectorAll("film");
    const filmsArray = [];

    films.forEach((film) => {
      const id = film.querySelector("id").textContent;
      const title = film.querySelector("title").textContent;
      const year = film.querySelector("year").textContent;
      const stars = film.querySelector("stars").textContent;
      const director = film.querySelector("director").textContent;
      const review = film.querySelector("review").textContent;

      const filmJson = {
        id,
        title,
        year: parseInt(year), // Convert year to number
        stars,
        director,
        review,
      };

      filmsArray.push(filmJson);
    });

    return filmsArray;
};

const fromText = (data) => {
    // console.log("Data: "+data);
    const filmsArray = [];

    // Split the data into individual film entries
    // console.log("Film entries: "+data.split("||"));
    const filmEntries = data.split("||");

    // Process each film entry
    filmEntries.forEach((filmEntry) => {

    if (filmEntry.trim() === "") {
     return;
    }

    //   // Split the entry into properties
      const [id, title, director, year, stars, review] = filmEntry.split(";;;");

    //   // Create a movie object
      const film = {
        id: parseInt(id),
        title: title,
        year: parseInt(year),
        director: director,
        stars: stars.split(",").map((star) => star.trim()),
        review: review,
      };

    //   // Push the movie object into the filmsArray
      filmsArray.push(film);
    });

    return filmsArray;
};

const filmToText = (film) => {
  return `${film.title};;;${film.director};;;${film.year};;;${film.stars};;;${film.review};;;`;
};

const filmToTextWithID = (film) => {
  return `${film.id};;;${film.title};;;${film.director};;;${film.year};;;${film.stars};;;${film.review};;;`;
};

const filmToXML = (film) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
      <film>
      <title>${film.title}</title>
      <director>${film.director}</director>
      <year>${film.year}</year>
      <stars>${film.stars}</stars>
      <review>${film.review}</review>
      </film>`;
};

const filmToXMLWithID = (film) => { 
  return `<?xml version="1.0" encoding="UTF-8"?>
      <film>
      <id>${film.id}</id>
      <title>${film.title}</title>
      <director>${film.director}</director>
      <year>${film.year}</year>
      <stars>${film.stars}</stars>
      <review>${film.review}</review>
      </film>`;
};

export default {
    fromXml,
    fromText,
    filmToText,
    filmToTextWithID,
    filmToXML,
    filmToXMLWithID,
}