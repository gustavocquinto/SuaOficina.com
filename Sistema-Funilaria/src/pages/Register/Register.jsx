// Libs
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import swal from 'sweetalert';
import InputMask from "react-input-mask";


// Styles
import "../../assets/styles/reset.css";
import "../../assets/styles/pages/register.css";

// Images
import banner from '../../assets/images/pages/register-banner.svg';

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exemplo: ''
        };
    }

    cadUser = (event) => {
        event.preventDefault();
        this.setState({ isLoading: true });

        let user = {
            Username: this.state.Username,
            email: this.state.Email,
            password: this.state.Password,
            phoneNumber: this.state.PhoneNumber
        };
        axios.post('https://54.147.100.207/api/Users', user, {

        })

            .then(resposta => {
                if (resposta.status === 201) {
                    this.setState({ isLoading: false });
                    swal("Sucesso!", "Usuário Cadastrado com Sucesso", "success").then(function() {
                        window.location = "/";
                    });;
                }
            })
            .catch(erro => {
                swal("Erro!", "Ocorreu um Erro " + {erro} , "error");
                this.setState({ isLoading: false });
            })
    };

    atualizaStateCampo = (campo) => {
        this.setState({ [campo.target.name] : campo.target.value })
    };

    componentDidMount(){
        document.title = "Registrar uma conta"
    }


    render() {
        return (
            <>
                <div className="register-background">
                    {/* Área do formulário (lado esquerdo) */}
                    <div className="register-form-background">
                        <div className="register-form-content">
                            <div className="register-form-text">
                                <h1>Criar uma nova conta</h1>
                                <p>Crie uma conta para que você possa acompanhar os nossos Serviços.</p>
                            </div>

                            <form onSubmit={this.cadUser}>
                                <div className="register-form-main">
                                    <div className="register-form-input">
                                        <input type="text" placeholder="Digite o seu nome" 
                                        name="Username"
                                        value={this.state.username}
                                        onChange={this.atualizaStateCampo} />
                                    </div>

                                    <div className="register-form-input">
                                        <input type="email" placeholder="Digite o seu e-mail" 
                                        value={this.state.email}
                                        name="Email"
                                        onChange={this.atualizaStateCampo}/>
                                    </div>

                                    <div className="register-form-input">
                                        <div className="register-form-input">
                                            <input type="password" placeholder="Digite uma senha"
                                            name="Password"
                                            value={this.state.password}
                                            onChange={this.atualizaStateCampo}/>
                                        </div>

                                      
                                    </div>

                                    <div className="register-form-input">
                                        <div className="register-form-input">
                                            <InputMask mask="(99) 99999-9999" placeholder="Digite o seu telefone" 
                                            value={this.state.phoneNumber}
                                            name="PhoneNumber"
                                            onChange={this.atualizaStateCampo}
                                            />
                                        </div>

                                        
                                    </div>

                                    <div className="register-form-btns">
                                        <button>Criar conta</button>
                                        <Link to="/">Já tenho uma conta!</Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Área do banner (lado direito) */}
                    <div className="register-banner-background">
                        <div className="register-banner-content">
                            <img src={banner} alt="Banner" draggable="false" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}