import { NavLink } from "react-router-dom";


export default function ArtistNav({ unique }) {
  return (
    <div className="nav-layout">
        <nav className="links">
            {unique && unique.map(artist => (
                <NavLink to={'/artist-'+artist.replace(/\s/g, '-')} key={artist}>{artist}</NavLink>
                ))}
        </nav>
    </div>
  )
}
