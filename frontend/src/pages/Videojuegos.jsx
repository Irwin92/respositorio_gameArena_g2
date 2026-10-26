/**Componente que consulta la API */
import { useEffect, useState } from "react";
import VideojuegoCard from "../components/VideojuegoCard";

const API_URL = "http://127.0.0.1:8000/api/videojuegos/";
const TOKEN_URL = "http://127.0.0.1:8000/api/token/";

export default function Videojuegos() {
    const [videojuegos, setVideojuegos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [credenciales, setCredenciales] = useState({
        username:"",
        password:"",
    });
    const [token, setToken] = useState("");
    const [autenticando, setAutenticando] = useState(false);


    useEffect(() => {
        async function cargarVideojuegos() {
            try {
                setCargando(true);
                setError("");

                const respuesta = await fetch(API_URL);
                if (!respuesta.ok) {
                    throw new Error(`Error HTTP: ${respuesta.status}`);
                }
                const datos = await respuesta.json();
                setVideojuegos(datos);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }
        cargarVideojuegos();
    }, []);

    if (cargando) return <p>Cargando Videojuegos...</p>
    if (error) return <p>Error:{error}</p>
/**----------------------Funcion para actualizar credenciales-------------------------------------------------------------- */
function manejarCambioCredenciales(e){
    setCredenciales({
        ...credenciales,
        [e.target.name]:e.target.value,
    });
}
/**------------------------------------------------------------------------------------ */



/**------------------------------------------------------------------------------------ */
    return (
        <section>
            <h2>Videojuegos Disponibles</h2>
            {videojuegos.length === 0 ? (
                <p>No hay videojuegos disponibles.</p>
            ) : (
                videojuegos.map((videojuego) => (
                    <VideojuegoCard
                        key={videojuego.id}
                        videojuego={videojuego}
                    />
                ))
            )}
        </section>
    );
}

