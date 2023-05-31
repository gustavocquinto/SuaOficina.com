import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import close from '../../assets/images/modals/modal-close-icon.svg';
import Modal from '../../components/Modal';
import car from '../../assets/images/pages/home-red-car-example.svg';
import SidebarAdmin from '../../components/SidebarAdmin';

class UserVehiclePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.match.params.userId,
            userName: '',
            vehicles: [],
            loading: true,
            isModalOpen: false,
            cadastrarCarro: {
                modelName: '',
                brandName: '',
                year: '',
                color: '',
                licensePlate: '',
            },
            brands: [],
            models: [],
        };
    }

    componentDidMount() {
        this.fetchUserData();
        this.fetchUserVehicles();
        this.fetchVehicleBrands();
    }

    fetchUserData() {
        const { userId } = this.state;
        axios
            .get(`http://localhost:5000/api/Users/${userId}`)
            .then((response) => {
                const userName = response.data.username;
                this.setState({ userName });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchUserVehicles() {
        const { userId } = this.state;
        axios
            .get(`http://localhost:5000/api/Vehicles/User/${userId}`)
            .then((response) => {
                this.setState({ vehicles: response.data, loading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    fetchVehicleBrands() {
        axios
            .get('https://vpic.nhtsa.dot.gov/api/vehicles/GetAllMakes?format=json')
            .then((response) => {
                const brands = response.data.Results.map((brand) => brand.Make_Name);
                this.setState({ brands });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    fetchVehicleModels = (brandName) => {
        axios
            .get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${brandName}?format=json`)
            .then((response) => {
                const models = response.data.Results.map((model) => model.Model_Name);
                this.setState({ models });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };

    updateState = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            cadastrarCarro: {
                ...prevState.cadastrarCarro,
                [name]: value,
            },
        }));
    };

    handleBrandChange = (event) => {
        const { value } = event.target;
        this.setState((prevState) => ({
            cadastrarCarro: {
                ...prevState.cadastrarCarro,
                brandName: value,
            },
        }));
        this.fetchVehicleModels(value);
    };

    cadastrarCarro = (event) => {
        event.preventDefault();
        const { userId } = this.state;
        const newVehicle = { ...this.state.cadastrarCarro, idUser: userId };

        axios
            .post('http://localhost:5000/api/Vehicles', newVehicle)
            .then((response) => {
                console.log('Veículo cadastrado com sucesso!');
                this.fetchUserVehicles();
                this.closeModal();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    render() {
        const { userName, vehicles, loading, isModalOpen, cadastrarCarro, brands, models } = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        return (
            <>
                <SidebarAdmin>
                    <div className="home-title">
                        <h1>Veículos de {userName}</h1>
                    </div>
                    <div className="home-btn">
                        <button onClick={this.openModal}>Novo Veículo</button>
                    </div>
                    <div className="home-card-background">
                        {vehicles.length > 0 ? (
                            vehicles.map((vehicle) => (
                                <Link
                                    key={vehicle.id}
                                    className="home-content-background"
                                    to={{ pathname: "/budgets/" + vehicle.id }}
                                >
                                    <div className="home-content-car-image">
                                        <img src={car} alt="Imagem de um carro vermelho" draggable="false" />
                                    </div>

                                    <div className="home-content-text">
                                        <h1>
                                            {vehicle.brandName} {vehicle.modelName}
                                        </h1>
                                        <p>Placa: {vehicle.licensePlate}</p>
                                        <p>Cor: {vehicle.color}</p>
                                    </div>

                                    <div className="home-content-btn">
                                        <p>Visualizar Orçamentos</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p>Nenhum veículo encontrado.</p>
                        )}
                    </div>
                </SidebarAdmin>

                {/* Modal */}
                <Modal isOpen={isModalOpen} onClose={this.closeModal}>
                    <div className="modal-overlay">
                        <div
                            className="modal"
                            id="modal"
                            onClick={() => document.getElementById('modal-card').click() ? '' : this.closeModal()}
                        ></div>
                        <div className="modal-card-background" id="modal-card">
                            <div className="modal-card-close">
                                <img src={close} alt="Ícone para fechar o modal" draggable="false" onClick={this.closeModal} />
                            </div>

                            <div className="modal-vehicle-card-form-background">
                                <div className="modal-vehicle-card-form">
                                    <div className="modal-vehicle-card-form-text">
                                        <h1>Adicionar um novo veículo</h1>
                                        <p>Adicione as informações do seu Veículo</p>
                                    </div>

                                    <form onSubmit={this.cadastrarCarro}>
                                        <div className="modal-vehicle-card-form-input">
                                            <input
                                                type="text"
                                                name="brandName"
                                                value={cadastrarCarro.brandName}
                                                onChange={this.handleBrandChange}
                                                placeholder="Pesquisar Marca"
                                                className="modal-vehicle-card-form-input"
                                                autoComplete="off"
                                                required
                                                
                                            />
                                            <select
                                                name="brandName"
                                                value={cadastrarCarro.brandName}
                                                onChange={this.handleBrandChange}
                                                className="modal-vehicle-card-form-select"
                                                autoComplete="off"
                                                
                                            >
                                                <option value="" disabled hidden>Marca</option>
                                                {brands
                                                    .filter((brand) => brand.toLowerCase().includes(cadastrarCarro.brandName.toLowerCase()))
                                                    .map((brand, index) => (
                                                        <option key={index} value={brand}>{brand}</option>
                                                    ))}

                                            </select>

                                        </div>

                                        <div className="modal-vehicle-card-form-input">
                                            <input
                                                type="text"
                                                name="modelName"
                                                value={cadastrarCarro.modelName}
                                                onChange={this.updateState}
                                                placeholder="Pesquisar Modelo"
                                                className="modal-vehicle-card-form-input"
                                                autoComplete="off"
                                                required
                                            />
                                            <select
                                                name="modelName"
                                                value={cadastrarCarro.modelName}
                                                onChange={this.updateState}
                                                className="modal-vehicle-card-form-select"
                                                autoComplete="off"
                                                required
                                            >
                                                <option value="" disabled hidden>Modelo</option>
                                                {models
                                                    .filter((model) => model.toLowerCase().includes(cadastrarCarro.modelName.toLowerCase()))
                                                    .map((model, index) => (
                                                        <option key={index} value={model}>{model}</option>
                                                    ))}
                                            </select>
                                        </div>




                                        <div className="modal-vehicle-card-form-input">
                                            <input
                                                type="text"
                                                name="year"
                                                value={cadastrarCarro.year}
                                                onChange={this.updateState}
                                                placeholder="Ano"
                                                className="modal-vehicle-card-form-input"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>

                                        <div className="modal-vehicle-card-form-input">
                                            <input
                                                type="text"
                                                name="color"
                                                value={cadastrarCarro.color}
                                                onChange={this.updateState}
                                                placeholder="Cor"
                                                className="modal-vehicle-card-form-input"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>

                                        <div className="modal-vehicle-card-form-input">
                                            <input
                                                type="text"
                                                name="licensePlate"
                                                value={cadastrarCarro.licensePlate}
                                                onChange={this.updateState}
                                                placeholder="Placa"
                                                className="modal-vehicle-card-form-input"
                                                autoComplete="off"
                                                required
                                            />
                                        </div>

                                        <div className="modal-vehicle-card-form-button">
                                            <button type="submit">Cadastrar</button>
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

export default UserVehiclePage;
