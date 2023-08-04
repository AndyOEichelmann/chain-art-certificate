import { useLoaderData } from 'react-router-dom';
import background from "../../../../images/artworks/stock-img.png";
import signature from "../../../../images/signatures/stock-signature-2.png";

export default function CoA() {
    const coa = useLoaderData();

  return (
    <div className='coa'>
      <h2>Certificate of Authenticity</h2>
      <div className='coa-page'>
        <div className='coa-img' style={{ backgroundImage:`url(${background})` }}>
          <p>{coa.token.tokenURI}</p>
        </div>

        <div className='coa-issuers'>
          <div className='coa-issuer-signature' style={{ backgroundImage:`url(${signature})` }}>
            <p>signature: {coa.metadata.issuer.signature}</p>
          </div>
          <div className='coa-issuer-info'>
            <h4>issuer</h4> 
            <h4>{coa.metadata.issuer.name}</h4>
          </div>
          <div className='coa-issuer-info'>
            <p>type</p> 
            <p>{coa.metadata.issuer.type}</p>
          </div>
          <div className='coa-issuer-info'>
            <p>address</p> 
            <p>{coa.metadata.issuer.address}</p>
          </div>
        </div>

        <div className='coa-data'>
          <div>
            <h4>Work Title</h4>
            <p>{coa.metadata.properties.title}</p>
          </div>
          <div>
            <h4>Artist</h4>
            <p>{coa.metadata.properties.artist}</p>
          </div>
          <div>
            <h4>Date</h4>
            <p>{coa.metadata.properties.date}</p>
          </div>
          <div>
            <h4>Dimentions</h4>
            <p>
              {coa.metadata.properties.dimentions.length}
              x
              {coa.metadata.properties.dimentions.height}
              {coa.metadata.properties.dimentions.unit}
            </p>
          </div>
          <div>
            <h4>Medium</h4>
            <p>{coa.metadata.properties.medium}</p>
          </div>
          <div>
            <h4>Edition</h4>
            <p>{coa.metadata.properties.edition.type}</p>
          </div>
          <div>
            <h4>Contract</h4>
            <p>{coa.contract}</p>
          </div>
          <div>
            <h4>TokenId</h4>
            <p>{coa.token.tokenId}</p>
          </div>
        </div>

        <div className='coa-statement'>
          <h4>Statement</h4>
          <p>{coa.metadata.properties.statement}</p>
        </div>
      </div>
    </div>
  )
}

// loader function
export const coaLoader = async ({ params }) => {
    const { id } = params;

    const res = await fetch('http://localhost:8000/certificates/' + id);

    if (!res.ok) {
      throw Error('Culd not find certificate');
    }

    return res.json();
}