import axios from 'axios';
import { useEffect, useState } from 'react';

import EditFilmModal from './components/EditFilmModal';
import utils from './utils';
import AddFilmModal from './components/AddFIlmModal';

function FilmsList() {
        const [films, setFilms] = useState([]);
        const [format, setFormat] = useState('application/json');

        const [editFilmModal, setEditFilmModal] = useState(false);
        const [editingFilm, setEditingFilm] = useState(null);

        const [addFilmModal, setAddFilmModal] = useState(false);
        
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
                    if (format === 'application/xml') {
                        // For XML format
                        const data = utils.fromXml(response.data);
                        setFilms(data);
                    } else if(format === 'application/json') {
                        // For JSON format
                        setFilms(response.data);
                    } else {
                        // For text/plain format
                        const data = utils.fromText(response.data);
                        setFilms(data);
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }, [format, editFilmModal, addFilmModal]);

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

                <button onClick={()=>{setAddFilmModal(true)}}>Add New Film</button>

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
                            <th className="px-4 py-2 border border-cyan-50">Actions</th>
                        </tr>
                    </thead>

                    {(format==="application/json" || format==="application/xml"|| format==="text/plain") && films!=null && Array.isArray(films) && <tbody>
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
                    
                </table>


                {editFilmModal && <EditFilmModal film={editingFilm} onClose={() => setEditFilmModal(false)} format={format} />}
                {addFilmModal && <AddFilmModal onClose={() => setAddFilmModal(false)} format={format} />}
            </div>

            

        );
}

export default FilmsList;
