// Libs
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { parseJwt, userAuthentication } from '../../services/Auth';
import swal from 'sweetalert';
import jwtDecode from 'jwt-decode'

// Styles
import "../../assets/styles/reset.css";
import "../../assets/styles/pages/home.css";
import "../../assets/styles/modals/new-vehicle.css";

// Components
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';

// Images
import car from '../../assets/images/pages/home-red-car-example.svg';
import close from '../../assets/images/modals/modal-close-icon.svg';


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleList: [],
            isModalOpen: false,
            idUserLogged: '',
            modelName: '',
            brandName: '',
            licensePlate: '',
            year: '',
            color: ''
        };
    }

    getUserVehicle = (user) => {
        axios('http://localhost:5000/api/Vehicles/User/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }

        })
            .then(resposta => {
                if (resposta.status === 200) {
                    this.setState({ vehicleList: resposta.data })
                    console.log(this.state.vehicleList)
                }
            })
            .catch(erro => console.log(erro));
    };

    

   

    // Chama as funções assim que a tela é renderizada
    componentDidMount() {
        this.getUserVehicle();
        document.title = "Meus Veículos"
    };

    cancelaModal = () => {
        this.setState({ isModalOpen: false })
    }

    render() {
        return (
            <>
                <Sidebar>
                    <div className="home-title">
                        <h1>Meus Veículos</h1>
                    </div>
                    <div className="home-card-background">
                        {
                            this.state.vehicleList.map(vehicle => {
                                return (
                                    <Link className="home-content-background"  to={{
                                        pathname: "/budgets/" + vehicle.id,
                                      }}>
                                        <div className="home-content-car-image">
                                            <img src={car} alt="Imagem de um carro vermelho" draggable="false" />
                                        </div>
                                        
                                        <div className="home-content-text" >
                                            <h1>{vehicle.brandName} {vehicle.modelName}</h1>
                                            <p>Placa: {vehicle.licensePlate}</p>
                                            <p>Cor: {vehicle.color}</p>
                                        </div>

                                        <div className="home-content-btn">
                                            <p on>Visualizar Orçamentos</p>
                                        </div>
                                    </Link>
                                );
                            })
                        }
                    </div>
                </Sidebar>




            </>
        );
    }
}