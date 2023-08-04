import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
        <h2>Page not fpund</h2>
        
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, non. Recusandae corporis reiciendis fugit at aspernatur sapiente autem id. A quod ratione similique omnis expedita totam pariatur voluptatum sapiente incidunt!</p>

        <p>Go to the <Link to='/'>Homepage</Link>.</p>
    </div>
  )
}
