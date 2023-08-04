import { NavLink, Outlet, useLoaderData } from "react-router-dom";

export default function ExploreLayour() {

  const artists = useLoaderData();

  return (
    <div className="nav-layout">
        <h2>Explore Certificates</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <nav className="links">
          {artists && artists.map(artist => (
            <NavLink to={artist.replace(/\s/g, '-')} key={artist}>{artist}</NavLink>
          ))}
        </nav>
        <Outlet />
    </div>
  )
}

// loader function
export const artistsLoader = async () => {
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

  return unique;
}