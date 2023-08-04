import { NavLink, useLoaderData } from "react-router-dom";
import Gallery from "../Gallery";
import ArtistNav from "../elements/ArtistNav";
// import useFetch from "../useFetch";

const Home = () => {
        // costum hook
    // const { data: acoa, isLoading, error } = useFetch('http://localhost:8000/certificates');

    const { acoa, unique } = useLoaderData(); 
    // console.log(unique);

    return (
        <div className="home">
            {unique && <ArtistNav unique={unique}/>}
            <h2>Art Gallery</h2>
            { acoa && <Gallery acoa={acoa} /> }
        </div>
    );
}

export default Home;

export const galleryLoader = async () => {
    
    const res = await fetch('http://localhost:8000/certificates');

    if (!res.ok) {
      throw Error('Culd not fetch certificates data');
    }

    const acoa = await res.json();

    let unique = [];
    acoa.forEach(element => {
        if (!unique.includes(element.metadata.properties.artist)) {
            unique.push(element.metadata.properties.artist);
        }
    });

    return { acoa: acoa, unique: await unique }
}