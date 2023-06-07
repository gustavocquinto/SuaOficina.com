import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from "axios";
import Modal from '../../../components/Modal';
import swal from 'sweetalert';
import { format } from 'date-fns';

import './DashAllUsers.css';
import close from '../../../assets/images/modals/modal-close-icon.svg';
import SidebarAdmin from '../../../components/SidebarAdmin';

class DashAllUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      example: '',
      UserList: [],
      isModalOpen: false,
      searchQuery: '',
      newUser: {
        username: '',
        email: '',
        password: '',
        userType: '',
        phoneNumber: '',
        creationDate: '',
      },
      redirectToVehicles: false,
      selectedUserId: null,
    };
  }

  getAllUsers = () => {
    axios('http://localhost:5000/api/Users', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('user-token')
      }
    })
      .then(resposta => {
        if (resposta.status === 200) {
          this.setState({ UserList: resposta.data });
          console.log(this.state.UserList);
        }
      })
      .catch(erro => console.log(erro));
  };

  delUser = (User) => {
    this.setState({
      idUser: User.id
    });
    axios.delete('http://localhost:5000/api/Users?id=' + User.id)
      .then(resposta => {
        if (resposta.status === 204) {
          swal("Sucesso!", "O Usuário foi deletado com Sucesso!", "success");
        }
      })
      .catch((erro) => swal("Ocorreu um erro :(", `${erro}`, "error"))
      .then(this.getAllUsers);
  }

  componentDidMount() {
    this.getAllUsers();
    document.title = "Usuários"
  };

  cancelaModal = () => {
    this.setState({ isModalOpen: false });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleNewUserChange = (event) => {
    const { name, value } = event.target;
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser,
        [name]: value
      }
    }));
  }

  handleNewUserSubmit = (event) => {
    event.preventDefault();
    const { newUser } = this.state;
    newUser.creationDate = format(new Date(), 'yyyy-MM-dd');
    axios.post('http://localhost:5000/api/Users', newUser)
      .then(resposta => {
        if (resposta.status === 201) {
          swal("Sucesso!", "Novo usuário adicionado com sucesso!", "success");
          this.cancelaModal();
          this.getAllUsers();
        }
      })
      .catch(erro => swal("Ocorreu um erro :(", `${erro}`, "error"));
  }

  selectUser = (userId) => {
    this.setState({
      selectedUserId: userId,
      redirectToVehicles: true,
    });
  };

  render() {
    const { searchQuery, UserList, isModalOpen, newUser, redirectToVehicles, selectedUserId } = this.state;
    const filteredUsers = UserList.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (redirectToVehicles && selectedUserId) {
      return <Redirect to={`/users/${selectedUserId}/vehicles`} />;
    }

    return (
      <>
        <SidebarAdmin>
          <div className="dash-title">
            <h1>Usuários</h1>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
            <button className='dash-content-user' onClick={() => this.setState({ isModalOpen: true })}>
              Criar um Usuário
            </button>
          </div>

          <div className="dash-card-background">
            {filteredUsers.length === 0 ? (
              <div className="no-users-message">Nenhum usuário encontrado.</div>
            ) : (
              filteredUsers.map(user => (
                <div className="dash-content-background" key={user.id} onClick={() => this.selectUser(user.id)}>
                  <div className="dash-content-text">
                    <h1>Usuário: {user.username}</h1>
                    <p>Email: {user.email}</p>
                    <p>Telefone: {user.phoneNumber}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modal */}
          <Modal isOpen={isModalOpen}>
            <div className="modal-overlay">
              <div className="modal" id="modal" onClick={() => document.getElementById('modal-card').click() ? '' : this.cancelaModal()}></div>
              <div className="modal-card-background" id="modal-card">
                <div className="modal-card-close">
                  <img src={close} alt="Ícone para fechar o modal" draggable="false" onClick={() => this.cancelaModal()} />
                </div>

                <div className="modal-vehicle-card-form-background">
                  <div className="modal-vehicle-card-form">
                    <div className="modal-vehicle-card-form-text">
                      <h1>Adicionar um novo usuário</h1>
                      <p>Adicione as informações do novo usuário</p>
                    </div>
                    <form onSubmit={this.handleNewUserSubmit}>
                      <div className="modal-vehicle-card-form-input-background">
                        <div className="modal-vehicle-card-form-input">
                          <input type="text" placeholder="Nome de usuário" name="username" value={newUser.username}
                            onChange={this.handleNewUserChange} required />
                        </div>

                        <div className="modal-vehicle-card-form-input">
                          <input type="email" placeholder="Email" name="email" value={newUser.email}
                            onChange={this.handleNewUserChange} required />
                        </div>

                        <div className="modal-vehicle-card-form-input">
                          <input type="password" placeholder="Senha" name="password" value={newUser.password}
                            onChange={this.handleNewUserChange} required />
                        </div>

                        <div className="modal-vehicle-card-form-input">
                          <select name="userType" value={newUser.userType} onChange={this.handleNewUserChange} required>
                            <option value="">Selecione o tipo de usuário</option>
                            <option value="0">Administrador</option>
                            <option value="1">Funileiro</option>
                            <option value="2">Usuário</option>
                          </select>
                        </div>

                        <div className="modal-vehicle-card-form-input">
                          <input type="text" placeholder="Número de telefone" name="phoneNumber" value={newUser.phoneNumber}
                            onChange={this.handleNewUserChange} required />
                        </div>

                        <button type="submit">Adicionar Usuário</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </SidebarAdmin>
      </>
    );
  }
}

export default DashAllUsers;
