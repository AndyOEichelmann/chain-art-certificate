import { Link } from "react-router-dom";
import background from "../../images/artworks/stock-img.png";

const Gallery = ({ acoa }) => {
    // const acoa = props.acoa;
    
    //console.log(acoa[0].metadata.properties.image);
    
    return (
        <div className="gallery">
            {/* must update dif image as backgrund for the div */}
            {acoa.map((coa) => (
                <Link to={'/certificates-' + coa.id.toString()} 
                    className="coa-preview obj-img" 
                    key={`${coa.contract}/${coa.token.tokenId}`}
                    style={{ backgroundImage: `linear-gradient(0deg, #f2f2f2 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%), url(${background})`}}>
                    <h2>{ coa.metadata.properties.title }</h2>
                    <p>by {coa.metadata.properties.artist}</p>
                </Link>
            ))}
        </div>
    );
}

export default Gallery;