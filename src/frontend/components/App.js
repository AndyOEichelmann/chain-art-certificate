import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';

import { Alchemy, Network } from 'alchemy-sdk';


// pages
import Artists, { artistCoALoader } from './Pages/artists/Artists';
import ArtistsError from './Pages/artists/ArtistsError';
import CoA, { coaLoader } from './Pages/coa/CoA';
import CoAError from './Pages/coa/CoAError';
import CreateCertificate, { certificateAction } from './Pages/CreateCertificate';
import Contact, { contactAction } from './Pages/help/Contact';
import Faq from './Pages/help/Faq';
import Home, { galleryLoader } from './Pages/Home.js';
import HomeError from './Pages/HomeError';
import NotFound from './Pages/NotFound';

// layouts
import HelpLayout from './layouts/HelpLayout';
import RooLayout from './layouts/RooLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RooLayout />}>
      <Route 
        index 
        element={<Home />} 
        loader={galleryLoader}
        errorElement={<HomeError />}  
      />
      <Route 
        path='createcertificate' 
        element={<CreateCertificate />} 
        action={certificateAction} 
      />

      <Route path='help' element={<HelpLayout />}>
        <Route path='faq' element={<Faq />} />
        <Route path='contact' element={<Contact />} action={contactAction} />
      </Route>

      <Route 
          path='/artist-:id' 
          element={<Artists />}
          loader={artistCoALoader}
          errorElement={<ArtistsError />}
      />
      
      <Route 
        path='/certificates-:id' 
        element={<CoA />}
        loader={coaLoader}
        errorElement={<CoAError />}
      />

      {/* custume page if nothing matches */}
      <Route path='*' element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;

// npm run start
// npx json-server --watch data/db.json  --port 8000
