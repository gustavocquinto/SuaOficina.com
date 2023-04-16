// Libs
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import Modal from '../../../components/Modal';
import swal from 'sweetalert'



// Styles
import './DashAllUsers.css'
// Components
import SidebarAdmin from '../../../components/SidebarAdmin';

// Images
import close from '../../../assets/images/modals/modal-close-icon.svg';


class DashAllUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            example: '',
            UserList: [],
            isModalOpen: false
        }
    }

    getAllUsers = () => {
        axios('https://54.147.100.207/api/Users', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }

        })
            .then(resposta => {
                if (resposta.status === 200) {
                    this.setState({ UserList: resposta.data })
                    console.log(this.state.UserList)
                }
            })
            .catch(erro => console.log(erro));
    };

    delUser = (User) => {
        this.setState({
            idUser : User.id
        })
        axios.delete('https://54.147.100.207/api/Users?id=' + User.id )
        .then(resposta => {
            if (resposta.status === 204) {
              swal("Sucesso!", "O Usuário foi deletado com Sucesso!", "success");
            }
        })
        .catch((erro) => swal("Ocorreu um erro :(", `${erro}`, "error"))
        .then(this.getAllUsers)
    }

    

    

    componentDidMount() {
        this.getAllUsers();
        document.title = "Usuários"
    };

    cancelaModal = () => {
        this.setState({ isModalOpen: false })
    }

    render() {
        return (
            <>
                <SidebarAdmin>
                <div className="dash-title">
                        <h1>Usuários</h1>
                    </div>
                    <div className="dash-card-background">
                        {
                            this.state.UserList.map(user => {
                                return (
                                    <Link className="dash-content-background">
                                        <div className="dash-content-text" >
                                            <h1>Usuário: {user.username}</h1>
                                            <p>Email: {user.email}</p>
                                            <p>Telefone: {user.phoneNumber}</p>
                                        </div>
                                    </Link>
                                );
                            })
                        }
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

                            <div className="modal-vehicle-card-form-background">
                                <div className="modal-vehicle-card-form">
                                    <div className="modal-vehicle-card-form-text">
                                        <h1>Editar Usuário</h1>
                                    </div>

                                    <div className="modal-vehicle-card-form-input-background">
                                        <div className="modal-vehicle-card-form-input">
                                            <input type="text" placeholder="Nome" />
                                        </div>

                                        <div className="modal-vehicle-card-form-input">
                                            <input type="text" placeholder="Telefone" />
                                        </div>

                                        <div className="modal-vehicle-card-form-input">
                                            <input type="year" placeholder="Senha" />
                                        </div>

                                        <div className="modal-vehicle-card-form-input">
                                            <input type="text" placeholder="Email" />
                                        </div>
                                        <div className="btn-modal">
                                        <button>Editar Usuário</button>
                                        </div>
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

export default DashAllUsers;