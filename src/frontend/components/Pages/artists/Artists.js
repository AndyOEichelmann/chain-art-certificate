import { act } from "react-dom/test-utils";
import { useLoaderData, useParams } from "react-router-dom";
import Gallery from "../../Gallery";
import ArtistNav from "../../elements/ArtistNav";

export default function Artists() {
    const { id } = useParams();
    const { acoa, unique } = useLoaderData(); 

    return (
        <div className="artist-gallery">
            {unique && <ArtistNav unique={unique}/>}
            <h2>{ id.replace(/\-/g, ' ') }</h2>
            { acoa && <Gallery acoa={acoa} /> }
        </div>
    )
}

export const artistCoALoader = async ({ params }) => {
  const { id } = params;

  const res = await fetch('http://localhost:8000/certificates');

  if (!res.ok) {
    throw Error('Culd not fetch certificates data');
  }
  const coa = await res.json();
  
  let acoa = coa.filter(element => element.metadata.properties.artist === id.replace(/\-/g, ' '));
  
  if(acoa.length <= 0) {
    throw Error('Culd not find artist');
  }

  let unique = [];
  coa.forEach(element => {
    if (!unique.includes(element.metadata.properties.artist)) {
        unique.push(element.metadata.properties.artist);
    }
  });
  
  return { acoa: acoa, unique: await unique };
}
