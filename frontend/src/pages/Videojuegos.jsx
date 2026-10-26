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
        username: "",
        password: "",
    });
    const [token, setToken] = useState("");
    const [autenticando, setAutenticando] = useState(false);
    const [mensaje, setMensaje] = useState("");

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
    function manejarCambioCredenciales(e) {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value,
        });
    }
    /**------------------------------------------------------------------------------------ */
    async function iniciarSesion(e) {
        e.preventDefault();
        try {
            setAutenticando(true);
            setError("");
            setMensaje("");

            const datosLogin = new URLSearchParams();
            datosLogin.append("username", credenciales.username);
            datosLogin.append("password", credenciales.password);

            const respuesta = await fetch(TOKEN_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: datosLogin,
            });

            if (!respuesta.ok) {
                throw new Error("Usuario o contraseña incorrectos");
            }
            const datos = await respuesta.json();
            setToken(datos.token);
            setCredenciales((actuales) => ({
                ...actuales,
                password: "",
            }));
            setMensaje("Autenticacion correcta");
        } catch (err) {
            setError(err.message);
        } finally {
            setAutenticando(false);
        }
    }


    /**------------------------------------------------------------------------------------ */
    return (
        <section className="container py-4">
        {!token ? (
            <form onSubmit={iniciarSesion} className="card card-body mb-4">
                <h2 className="h4 mb-3">Autenticación</h2>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input className="form-control"
                        name="username"
                        value={credenciales.username}
                        onChange={manejarCambioCredenciales}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña </label>
                    <input type="password"
                        className="form-control"
                        name="password"
                        value={credenciales.password}
                        onChange={manejarCambioCredenciales}
                    />
                </div>
                <button className="btn btn-dark" disabled={autenticando}>
                    {autenticando ? "Autenticando..." : "Obtener token"}
                </button>
            </form>
            ) : (
            <div className="alert alert-info">
                Usuario autenticado.El token se enviará en POST, PATH y DELETE.
            </div>
            )
        }
    </section>
    )
}

