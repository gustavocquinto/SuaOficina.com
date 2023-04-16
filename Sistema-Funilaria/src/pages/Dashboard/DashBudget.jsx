// Libs
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { parseJwt } from '../../services/Auth';
import InputMask from "react-input-mask";


// Styles
import '../../assets/styles/reset.css';
import '../../assets/styles/pages/DashBudget.css';
import '../../assets/styles/modals/edit-profile.css';

// Components
import SidebarAdmin from '../../components/SidebarAdmin';
import Modal from '../../components/Modal';

// Images
import close from '../../assets/images/modals/modal-close-icon.svg';

class dash extends Component {
    constructor(props) {
        super(props);
        console.log("ID: " + this.props.match.params.id)
        this.state = {
            example: '',
            getBudgetInfo: [],
           
            isModalOpen: false
        }
    }

    getUserInfo = () => {
        axios('https://54.147.100.207/api/Services/Budget/' + this.props.match.params.id)
            .then(resposta => {
                if (resposta.status === 200) {
                    this.setState({ getUserInfo: resposta.data })
                    console.log(this.state.getUserInfo)
                    console.log(this.state.getUserInfo[0].serviceImages[0].imagePath)
                }
            })
            .catch(erro => console.log(erro));
    };

    componentDidMount() {
        this.getImageService();
        this.getBudgetInfo();
        document.title = "Meus Veículos"
    };

    cancelaModal = () => {
        this.setState({ isModalOpen: false })
    }

    render() {
        return (
            <>
                <SidebarAdmin>

                    <div className="dash-header">
                        <div className="dash-texts">
                            <h1>Orçamento</h1>
                        </div>
                    </div>

                    <div className="dash-info-background">
                        <div className="dash-info-list">
                            <p>Cliente: Leonardo Rodrigues</p>
                            <p>Veículo: Chevrolet Onix</p>
                            <p>Placa: ABC-1090</p>
                        </div>

                        <div className="main-header">
                            <p>Serviços</p>
                        </div>
                        <div className="main-services">
                        {
                                    this.state.getUserInfo.map(budget => {
                                        return (
                                          <p>{budget.serviceDescription}</p>
                                        );
                                    })
                                }
                        </div>

                        <div className="content">
                            <div className="dash-image-slider">
                                {
                                    this.state.getUserInfo.map(budget => {
                                        return (
                                            <img src={'https://54.147.100.207/Images/' + budget.serviceImages[0].imagePath} alt="Imagem de um carro vermelho" draggable="false" />
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="dash-info-edit">
                            <button onClick={() => this.setState({ isModalOpen: true })}>Aceitar Orçamento</button>
                            <button>Rejeitar Orçamento</button>
                        </div>


                    </div>
                </SidebarAdmin>



                {/* Modal */}
                <Modal isOpen={this.state.isModalOpen}>
                    <div className="modal-overlay">
                        <div className="modal" id="modal" onClick={() => document.getElementById('modal-card').click() ? '' : this.cancelaModal()}></div>
                        <div className="modal-card-background" id="modal-card">
                            <div className="modal-card-close">
                                <img src={close} alt="Ícone para fechar o modal" draggable="false" onClick={() => this.cancelaModal()} />
                            </div>

                            <div className="modal-profile-card-form-background">
                                <div className="modal-profile-card-form">
                                    <div className="modal-profile-card-form-text">
                                        <h1>Aceitar Orçamento</h1>
                                    </div>

                                    <div className="modal-profile-card-form-input-background">
                                        <div className="modal-profile-card-form-input">
                                            <InputMask mask="9999,99" placeholder="Preço" />
                                        </div>

                                        <div className="modal-profile-card-form-input">
                                            <input type="date" placeholder="Previsão para termino" />
                                        </div>

                                        <div className="modal-profile-card-form-input">
                                            <input type="Mecanico Responsável" placeholder="ID Do Mecanico" />
                                        </div>


                                        <button>Enviar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}

export default dash;