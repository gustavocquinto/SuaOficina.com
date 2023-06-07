// Libs
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Styles
import '../assets/styles/reset.css';
import '../assets/styles/components/sidebar.css';
import mainLogo from './logo.png';

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
                            <img width="200px"src={mainLogo}></img>
                            
                            </div>

                            <div className="sidebar-content-btns">
                                <div className="sidebar-content-btns-main">
                                    <Link to="/dashallusers" id="control-panel" className="sidebar-content">
                                        <h2>Painel de Controle</h2>
                                        <hr></hr>
                                    </Link>
                                    <br></br>
                                    <Link to="/dashallbudget" id="vehicles" className="sidebar-content-btn">
                                        <p>Lista de Orçamentos</p>
                                    </Link>

                                    <Link to="/dashallusers" id="profile" className="sidebar-content-btn">
                                        <p>Usuarios</p>
                                    </Link>

                                    <Link to="/createService" id="servicetype" className="sidebar-content-btn">
                                        <p>Serviços</p>
                                    </Link>

                                    <Link to="/createBudget" id="budget" className="sidebar-content-btn">
                                        <p>Orçamentos</p>
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