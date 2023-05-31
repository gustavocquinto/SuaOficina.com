// Libs
import { Link } from 'react-router-dom';

// Styles
import '../../assets/styles/pages/404.css'


function NotFound() {
  return (
    <div id="oopss">
      <div id="error-text">
        <img src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg" alt={404} />
        <span>ERRO 404</span>
        <p className="p-a">
          A Página que você procura não existe</p>
        <a href="#" className="back">Voltar para Página Inicial</a>
      </div>
    </div>
  );
}

export default NotFound;