// Libs
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Styles
import '../assets/styles/reset.css';
import '../assets/styles/components/sidebar.css';

function toggleClickBtn(){
    const URL = window.location.pathname;
    console.log(URL);

    if(URL === '/home' || URL === '/budgets' || URL === '/services') {
        var element = document.getElementById("vehicles");
        element.classList.add("active");
    }

    if (URL === '/profile') {
        var element = document.getElementById("profile");
        element.classList.add("active");
    }
}

class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
            example : ''
        }
    }

    funcaoLogout = () => {
        localStorage.removeItem('user-token')
    }

    componentDidMount() {
        toggleClickBtn();
    }

    render() {
        const URL = window.location.pathname;
        console.log(URL);
        return(
            <>
                <div className="screen-background">
                    <div className="sidebar-background">
                        <div className="sidebar-content">
                            <div className="sidebar-content-logo">
                                <p>Funilaria<br />Dois Irmãos</p>
                            </div>

                            <div className="sidebar-content-btns">
                                <div className="sidebar-content-btns-main">
                                    <Link to="/dashallbudget" id="vehicles" className="sidebar-content-btn">
                                        <p>Orçamentos</p>
                                    </Link>

                                    <Link to="/dashallusers" id="profile" className="sidebar-content-btn">
                                        <p>Usuarios</p>
                                    </Link>

                                    <Link to="/servicesType" id="servicetype" className="sidebar-content-btn">
                                        <p>Tipos de Serviço</p>
                                    </Link>
                                </div>
                                
                                <Link to="/" className="sidebar-content-btn">
                                <p onClick={() => this.funcaoLogout()}>Deslogar</p>
                                </Link>
                            </div>
                            
                        </div>
                    </div>

                    <div className="page-content-background">
                        <div className="page-content">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default Sidebar;