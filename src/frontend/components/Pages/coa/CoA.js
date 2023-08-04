import { useLoaderData } from 'react-router-dom';

export default function CoA() {
    const coa = useLoaderData();

  return (
    <div className='certificate'>
        <h2>Certificate of Authenticity</h2>
        <p>Work Title: {coa.metadata.properties.title}</p>
        <p>Artist: {coa.metadata.properties.artist}</p>
        <p>Image: {coa.metadata.properties.tokenURI}</p>
        <p>Contract: {coa.contract}</p>
        <p>TokenId: {coa.token.tokenId}</p>
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