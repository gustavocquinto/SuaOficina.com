import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import '../../assets/styles/reset.css';
import '../../assets/styles/pages/budget.css';

import Sidebar from '../../components/Sidebar';

class Budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budgetList: [],
      vehicle: null,
    };
  }

  componentDidMount() {
    this.getUserVehicle();
    this.getVehicleBudget();
    document.title = 'Orçamento do Veículo';
  }

  getUserVehicle = () => {
    axios
      .get('http://localhost:5000/api/Vehicles/VehicleId/' + this.props.match.params.id)
      .then((response) => {
        if (response.status === 200) {
          this.setState({ vehicle: response.data });
          console.log('Veículo: ', response.data);
        }
      })
      .catch((error) => {
        console.log('Erro ao obter o veículo: ', error);
      });
  };

  getVehicleBudget = () => {
    axios
      .get('http://localhost:5000/api/Budgets/Vehicle/' + this.props.match.params.id)
      .then((response) => {
        if (response.status === 200) {
          const budgetList = response.data;
          const budgets = Array.isArray(budgetList) ? budgetList : [budgetList];
          this.setState({ budgetList: budgets });
          console.log('Lista de orçamentos: ', budgets);
        }
      })
      .catch((error) => {
        console.log('Erro ao obter os orçamentos: ', error);
      });
  };

  renderBudgetList = () => {
    const { budgetList } = this.state;

    if (budgetList.length === 0) {
      return <p className="no-budget-message">Sem orçamentos para esse veículo</p>;
    }

    return budgetList.map((budget) => {
      const budgetNumber = budget.id.toString().padStart(4, '0');
      const startDate = new Date(budget.visitDate).toLocaleDateString();
      const endDate = budget.finalizationDate
        ? new Date(budget.finalizationDate).toLocaleDateString()
        : 'ainda não finalizado';

      return (
        <Link
          to={{
            pathname: `/services/${budget.id}`,
            state: {
              budgetName: `Orçamento ${budgetNumber}`,
              licensePlate: this.state.vehicle.licensePlate,
              customerName: budget.customerName,
            },
          }}
          className="budget-content-background"
          key={budget.id}
        >
          <div className="budget-content-text">
            <h1>#Orçamento {budgetNumber}</h1>
            <p>Data de Início: {startDate}</p>
            <p>Data de Término: {endDate}</p>
          </div>
          <div className="budget-content-btn">
            <p>Status: {budget.status}</p>
            <p className="budget-content-btn-valor">Valor: R$ {budget.totalValue}</p>
          </div>
        </Link>
      );
    });
  };

  render() {
    const { vehicle } = this.state;

    if (!vehicle) {
      return (
        <>
          <Sidebar>
            <p className="loading-message">Carregando...</p>
          </Sidebar>
        </>
      );
    }

    const { licensePlate, modelName, brandName } = vehicle;

    return (
      <>
        <Sidebar>
          <div className="budget-header">
            <Link to="/home" className="budget-header-back">
              {'< Meus Veículos'}
            </Link>
            <div className="budget-title">
              <h1>{brandName} {modelName}</h1>
            </div>
            <div className="budget-placa">
              <p>Placa: {licensePlate}</p>
            </div>
          </div>

          <div className="budget-card-background">
            <p className="budget-card-background-title">Orçamento</p>
            {this.renderBudgetList()}
          </div>
        </Sidebar>
      </>
    );
  }
}

export default Budget;
