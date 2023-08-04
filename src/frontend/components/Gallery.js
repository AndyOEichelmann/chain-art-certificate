import { Link } from "react-router-dom";
import background from "../../images/artworks/stock-img.png";

const Gallery = ({ acoa }) => {
    // const acoa = props.acoa;
    
    return (
        <div className="gallery">
            {/* must update dif image as backgrund for the div */}
            {acoa.map((coa) => (
                <Link to={'/certificates-' + coa.id.toString()} 
                    className="coa-preview" 
                    key={`${coa.contract}/${coa.token.tokenId}`}
                    style={{backgroundImage: `url(${background})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover'
                }}
                >
                    <h2>{ coa.metadata.properties.title }</h2>
                    <p>by {coa.metadata.properties.artist}</p>
                </Link>
            ))}
        </div>
    );
}

export default Gallery;