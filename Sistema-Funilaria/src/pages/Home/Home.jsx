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
        axios('https://54.147.100.207/api/Vehicles/User/' + parseJwt().jti, {
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

    cadastrarCarro = (event) => {
        event.preventDefault();
        let carro = {
            idUser: parseJwt().jti,
            modelName: this.state.carro.modelName,
            brandName: this.state.carro.brandName,
            year: this.state.carro.year,
            color: this.state.carro.color,
            licensePlate: this.state.carro.licensePlate
    
        };

        axios.post("https://54.147.100.207/api/Vehicles", carro)

            .then((resposta) => {
                if (resposta.status === 201) {
                    swal("Sucesso!", `O Veículo foi cadastrado com sucesso!`, "success").then(function () {
                        window.location = "/Home";
                    });;
                }
            })

            .catch((erro) => swal("Ocorreu um erro :(", `${erro}`, "error"));
    };

    updateState = (campo) => {
        this.setState((prevState) => ({
            carro: {
                ...prevState.carro,
                [campo.target.name]: campo.target.value,
            },
        }));
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
                    <div className="home-btn">
                        <button onClick={() => this.setState({ isModalOpen: true })}>Novo Veículo</button>
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



                {/* Modal */}
                <Modal isOpen={this.state.isModalOpen}>
                    <div className="modal-overlay">
                        <div className="modal" id="modal" onClick={() => document.getElementById('modal-card').click() ? '' : this.cancelaModal()}></div>
                        <div className="modal-card-background" id="modal-card">
                            <div className="modal-card-close">
                                <img src={close} alt="Ícone para fechar o modal" draggable="false" onClick={() => this.cancelaModal()} />
                            </div>

                            <div className="modal-vehicle-card-form-background">
                                <div className="modal-vehicle-card-form">
                                    <div className="modal-vehicle-card-form-text">
                                        <h1>Adicionar um novo veículo</h1>
                                        <p>Adicione as informações do seu Veículo</p>
                                    </div>
                                    <form onSubmit={this.cadastrarCarro} >
                                        <div className="modal-vehicle-card-form-input-background">
                                            <div className="modal-vehicle-card-form-input">
                                                <input type="text" placeholder="Insira o Modelo de seu Veículo" name="modelName" value={this.cadastrarCarro.modelName}
                                                    onChange={this.updateState} required/>
                                            </div>

                                            <div className="modal-vehicle-card-form-input">
                                                <input type="text" placeholder="Marca" name="brandName" value={this.cadastrarCarro.brandName}
                                                    onChange={this.updateState} required/>
                                            </div>

                                            <div className="modal-vehicle-card-form-input">
                                                <input type="year" placeholder="Ano"  name="year" value={this.cadastrarCarro.year}
                                                    onChange={this.updateState} required />
                                            </div>

                                            <div className="modal-vehicle-card-form-input">
                                                <input type="text" placeholder="Cor"  name="color" value={this.cadastrarCarro.color}
                                                    onChange={this.updateState} required/>
                                            </div>

                                            <div className="modal-vehicle-card-form-input">
                                                <input type="text" placeholder="Placa"  name="licensePlate" value={this.cadastrarCarro.licensePlate}
                                                    onChange={this.updateState}required />
                                            </div>

                                            <button type="submit">Adicionar Veículo</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}