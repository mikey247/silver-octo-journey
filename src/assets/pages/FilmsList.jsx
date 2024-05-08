import axios from 'axios';
import { useEffect, useState } from 'react';
import xml2js from 'xml-js'; // Import xml-js for parsing XML

import EditFilmModal from './components/EditFilmModal';

function FilmsList() {
        const [films, setFilms] = useState([]);
        const [format, setFormat] = useState('application/json');

        const [editFilmModal, setEditFilmModal] = useState(false);
        const [editingFilm, setEditingFilm] = useState(null);
        
        // Function to create XML body
        const createXmlBody = (id) => {
            return `<?xml version="1.0" encoding="UTF-8"?>
                    <film>
                    <id>${id}</id>
                    </film>`;
        };

        useEffect(() => {
            console.log("Format: ", format);
            const fetchData = async () => {
                try {
                    const response = await axios.get(import.meta.env.VITE_API_URL, {
                        headers: {
                            'Accept': format
                        }
                    });
                    console.log(response.data);
                    if (format === 'application/xml') {
                        // Convert XML to JSON
                        let result = xml2js.xml2json(response.data, {compact: true, spaces: 4});
                        let parsedResult = JSON.parse(result);
                        console.log(parsedResult.films.film);
                        setFilms(parsedResult.films.film);
                    } else {
                        console.log("Set film to JSON");
                        console.log(response.data)
                        setFilms(response.data);
                        // For JSON format
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }, [format]);

        const deleteFilm = (id) => {
            console.log(id);
            let bodyContent;

            switch (format) {
            case 'application/json':
                bodyContent = JSON.stringify({ id });
                break;
            case 'application/xml':
                bodyContent = createXmlBody(id);
                break;
            case 'text/plain':
                bodyContent = id;
                break;
            default:
                bodyContent = '';
                break;
            }

            fetch(import.meta.env.VITE_API_URL, {
                method: 'DELETE',
                headers: {
                    'Accept': format
                },
                body: bodyContent
            })
            .then(response => {
                console.log(response);
                setFilms(films.filter(film => film.id !== id));
            })
            .catch(error => {
                console.error(error);
            });
        };

        return (
            <div>
                <h1 className="text-center p-3">Films</h1>

                <div className="flex justify-center items-center gap-4 p-3">
                    <h2 className=" p-3">Format:</h2>
                    <select className="border rounded p-1" value={format} onChange={(e)=>{
                        setFormat(e.target.value);
                        setTimeout(()=>{},3000)
                    }}>
                        <option value="application/json">JSON</option>
                        <option value="application/xml">XML</option>
                        <option value="text/plain">Text/Plain</option>
                    </select>
                </div>

                <table className="bg-grey backdrop-blur-md mx-auto shadow-lg shadow-[#262626a4] p-4 rounded-lg">
                    <thead>
                        <tr className="p-6 gap-4 border-b w-full text-left">
                            <th className="px-4 py-2 border border-cyan-50">ID</th>
                            <th className="px-4 py-2 border border-cyan-50">Title</th>
                            <th className="px-4 py-2 border border-cyan-50">Director</th>
                            <th className="px-4 py-2 border border-cyan-50">Year</th>
                            <th className="px-4 py-2 border border-cyan-50">Stars</th>
                            <th className="px-4 py-2 border border-cyan-50">Review</th>
                            {/* <th className="px-4 py-2 border border-cyan-50">Actions</th> */}
                        </tr>
                    </thead>

                    {format==="application/json" && films!=null && Array.isArray(films) && <tbody>
                        {films.map(film => (
                            <tr key={film.id} className='p-6 gap-4 border-b text-sm text-left'>
                                <td className='p-2'>{film.id}</td>
                                <td className='p-2'>{film.title}</td>
                                <td className='p-2'>{film.director}</td>
                                <td className='p-2'>{film.year}</td>
                                <td className='p-2'>{film.stars}</td>
                                <td className='p-2'>{film.review}</td>
                                <td> <button onClick={()=>{ setEditingFilm(film); setEditFilmModal(true);  }}>Edit</button>  </td>
                                <td> <button onClick={()=>{deleteFilm(film.id)}}>Delete</button> </td>
                            </tr>
                        ))}
                        
                    </tbody>}
                    
                    {format==="application/xml" && films!=null && Array.isArray(films) && <tbody>
                        {films.map(film => (
                            <tr key={film.id._text} className='p-6 gap-4 border-b text-sm text-left'>
                                <td className='p-2'>{film.id}</td>
                                <td className='p-2'>{film.title}</td>
                                <td className='p-2'>{film.director}</td>
                                <td className='p-2'>{film.year}</td>
                                <td className='p-2'>{film.stars}</td>
                                <td className='p-2'>{film.review}</td>
                                <td> <button onClick={()=>{ setEditingFilm(film); setEditFilmModal(true);  }}>Edit</button>  </td>
                                <td> <button onClick={()=>{deleteFilm(film.id)}}>Delete</button> </td>
                            </tr>
                        ))}
                        
                    </tbody>}
                </table>


                {editFilmModal && <EditFilmModal film={editingFilm} onClose={() => setEditFilmModal(false)} />}
            </div>

            

        );
}

export default FilmsList;
