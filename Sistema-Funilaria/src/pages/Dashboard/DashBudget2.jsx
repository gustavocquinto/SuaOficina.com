import React, { Component } from "react";
import '../../assets/styles/pages/dashbudget2.css';
import "../../assets/styles/reset.css";
import swal from 'sweetalert';
import axios from 'axios';
import SidebarAdmin from "../../components/SidebarAdmin";
import InputMask from "react-input-mask";
import close from '../../assets/images/modals/modal-close-icon.svg';
import Modal from '../../components/Modal';




export default class budgets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      BudgetList: [],
    };
  }

  getVehicleBudget = () => {
    axios('https://54.147.100.207/api/Services/Budget/' + this.props.match.params.id)
      .then(resposta => {
        if (resposta.status === 200) {
          this.setState({ BudgetList: resposta.data })
          console.log(this.state.BudgetList);
        }
      })
      .catch(erro => console.log(erro));
  };

  cancelaModal = () => {
    this.setState({ isModalOpen: false })
  }

  cadBudget = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });

    let cadBudget = {
      idService: this.state.idService,
      price: this.state.price,
      observations: this.state.observations,
      timeEstimate: this.state.timeEstimate
    };
    axios.post('https://54.147.100.207/api/Services/Answer', cadBudget, {

    })

      .then(resposta => {
        if (resposta.status === 201) {
          this.setState({ isLoading: false });
          swal("Sucesso!", "Usuário Cadastrado com Sucesso", "success").then(function () {
            window.location = "/";
          });;
        }
      })
      .catch(erro => {
        swal("Erro!", "Ocorreu um Erro " + { erro }, "error");
        this.setState({ isLoading: false });
      })
  };


  componentDidMount() {
    this.getVehicleBudget();
    document.title = "Serviços";
  }

  render() {
    return (
      <>
        <SidebarAdmin>
          <div>

            <body>
              <div className="container">

                <div ClassName="container-text">
                  <h1 class="main-title">Serviços</h1>
                </div>
                <div class="main-header">
                  <p>Nome</p>
                  <p>Tipo Serviço</p>
                </div>

                <section ClassName="main-equip">
                  {
                    this.state.BudgetList.map(vehicle => {
                      return (
                        <details>
                          <summary key={vehicle.idbudget}>
                            <p>{vehicle.serviceDescription}</p>
                            <p>{vehicle.serviceType.typeName}</p>
                            <p>{vehicle.marca}</p>
                            <p>{vehicle.status}</p>
                          </summary>
                          <div class="content">
                            <div class="paragrafos">
                              <img src={'https://54.147.100.207/Images/' + vehicle.serviceImages[0].imagePath} draggable="false" />
                            </div>

                            <div className="botoes">
                              <a className="btn-edit" onClick={() => this.setState({ isModalOpen: true })}>Editar</a>
                            </div>

                          </div>
                        </details>
                      );
                    })
                  }
                </section>

              </div>
            </body>
          </div>
        </SidebarAdmin>

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
                    <h1>Aceitar Serviço</h1>
                  </div>
                  <form onSubmit={this.cadBudget}>
                    <div className="modal-profile-card-form-input-background">
                      <div className="modal-profile-card-form-input">
                        <InputMask mask="9999,99" placeholder="Preço" name="price" value={this.cadBudget.price}
                          onChange={this.updateState} />
                      </div>

                      <div className="modal-profile-card-form-input">
                        <input type="date" placeholder="Previsão para termino" name="timeEstimate" value={this.cadBudget.timeEstimate}
                          onChange={this.updateState}/>
                      </div>

                      <div className="modal-profile-card-form-input">
                        <input type="Mecanico Responsável" placeholder="Observações" name="observations" value={this.cadBudget.observations}
                          onChange={this.updateState}/>
                      </div>


                      <button type="submit">Enviar</button>
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