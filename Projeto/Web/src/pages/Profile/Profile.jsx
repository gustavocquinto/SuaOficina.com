// Libs
import React, { Component } from 'react';
import axios from "axios";
import { parseJwt } from '../../services/Auth';
import swal from 'sweetalert'
import InputMask from "react-input-mask";
 

// Styles
import '../../assets/styles/reset.css';
import '../../assets/styles/pages/profile.css';
import '../../assets/styles/modals/edit-profile.css';

// Components
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';

// Images
import close from '../../assets/images/modals/modal-close-icon.svg';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            example: '',
            getUserInfo: [],
            editUser: {
                _method: "PATCH",
                username: '',
                email: '',
                phoneNumber: '',
            },
            isModalOpen: false
        }
    }

    getUserInfo = (user) => {
        axios('http://localhost:5000/api/Users/' + parseJwt().jti, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }

        })
            .then(resposta => {
                if (resposta.status === 200) {
                    this.setState({ getUserInfo: resposta.data })
                    console.log(this.state.getUserInfo)
                }
            })
            .catch(erro => console.log(erro));
    };


    editUser = (event) => {
        event.preventDefault();

        let editUser = {
            userId: parseJwt().jti,
            username: this.state.editUser.username,
            email: this.state.editUser.email,
            phoneNumber: this.state.editUser.phoneNumber,
        };

        axios.patch('http://localhost:5000/api/Users/', editUser)
            .then((resposta) => {
                if (resposta.status === 204) {
                    swal("Sucesso!", `O Usuário " foi editada com sucesso!`, "success").then(function () {
                        window.location = "/Home";
                        console.log(resposta);
                    });;
                }
            })
            .catch((erro) => swal("Ocorreu um erro :(", `${erro}`, "error"));
    };


    updateState = (campo) => {
        this.setState((prevState) => ({
            editUser: {
                ...prevState.editUser,
                [campo.target.name]: campo.target.value,
            },
        }));
    };



    componentDidMount() {
        this.getUserInfo();
        document.title = "Meu Perfil"
    };

    atualizaStateCampo = (campo) => {
        this.setState({ [campo.target.name]: campo.target.value })
    };


    cancelaModal = () => {
        this.setState({ isModalOpen: false })
    }

    render() {
        return (
            <>
                <Sidebar>

                    <div className="profile-header">
                        <div className="profile-title">
                            <h1>{this.state.getUserInfo.username}</h1>
                        </div>
                        <div className="profile-texts">
                            <p>Meu Perfil</p>
                        </div>
                    </div>

                    <div className="profile-info-background">
                        <div className="profile-info-list">
                            <h2>Informações Pessoais:</h2>
                            <p>Nome: {this.state.getUserInfo.username}</p>
                            <p>Email: {this.state.getUserInfo.email}</p>
                            <p>Telefone: {this.state.getUserInfo.phoneNumber}</p>
                        </div>

                        <div className="profile-info-edit">
                            <h2>Editar Informações:</h2>
                            <button onClick={() => this.setState({ isModalOpen: true })}>Editar Informações Pessoais</button>
                        </div>
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

                            <div className="modal-profile-card-form-background">
                                <div className="modal-profile-card-form">
                                    <div className="modal-profile-card-form-text">
                                        <h1>Editar Perfil</h1>
                                        <p>Edite as informações pessoais do seu Perfil</p>
                                    </div>
                                    <form onSubmit={this.editUser}>
                                        <div className="modal-profile-card-form-input-background">
                                            <div className="modal-profile-card-form-input">
                                                <input type="text" name="username" placeholder={this.state.getUserInfo.username} value={this.state.username} onChange={this.updateState} />
                                            </div>

                                            <div className="modal-profile-card-form-input">
                                                <input type="email" name="email" placeholder={this.state.getUserInfo.email} value={this.state.email} onChange={this.updateState} />
                                            </div>

                                            <div className="modal-profile-card-form-input">
                                                <InputMask mask="(99) 99999-9999" type="text" name="phoneNumber" placeholder={this.state.getUserInfo.phoneNumber} value={this.state.phoneNumber} onChange={this.updateState} />
                                            </div>
                                            <button type="submit">Salvar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        )
    }
}

export default Profile;