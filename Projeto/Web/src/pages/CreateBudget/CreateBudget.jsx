import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CreateBudget.css';
import Sidebar from '../../components/Sidebar';
import { NumericFormat } from 'react-number-format';

import SidebarAdmin from '../../components/SidebarAdmin';

const CreateBudget = () => {
  const [totalValue, setTotalValue] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [finalizationDate, setFinalizationDate] = useState('');
  const [idVehicle, setIdVehicle] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userVehicles, setUserVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchBudgets();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserVehicles = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/Vehicles/user/${userId}`);
      setUserVehicles(response.data);
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    fetchUserVehicles(userId);
    resetForm();
  };

  const handleIdVehicleChange = (e) => {
    const vehicleId = e.target.value;
    setIdVehicle(vehicleId);
    resetForm();
  };

  const resetForm = () => {
    setTotalValue('');
    setTimeEstimate('');
    setVisitDate('');
    setFinalizationDate('');
    setCreationDate('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const data = {
        totalValue: parseFloat(totalValue),
        timeEstimate: parseInt(timeEstimate),
        visitDate: null,
        finalizationDate: null,
        idVehicle: idVehicle,
        creationDate: new Date(),
        userId: selectedUser,
      };

      await axios.post('http://localhost:5000/api/Budgets', data);

      Swal.fire({
        title: 'Budget cadastrado com sucesso!',
        text: 'Deseja cadastrar os serviços para este orçamento agora?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirecionar para a página de cadastro de serviços
          // Aqui você pode colocar o código para redirecionar ou usar o react-router-dom
        } else {
          resetForm();
          setSelectedUser('');
          setUserVehicles([]);
        }
      });
    } catch (error) {
      setError('Ocorreu um erro ao cadastrar o Budget.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await axios.delete(`http://localhost:5000/api/Budgets/${budgetId}`);
      fetchBudgets();
      Swal.fire('Orçamento excluído com sucesso!', '', 'success');
    } catch (error) {
      console.error('Error deleting budget:', error);
      Swal.fire('Ocorreu um erro ao excluir o orçamento.', '', 'error');
    }
  };

  return (
    <SidebarAdmin>
      <div className="create-budget-container">
      <h2>Cadastrar Orçamento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário:</label>
          <select value={selectedUser} onChange={handleUserChange}>
            <option value="">Selecione um usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <>
            <div>
              <label>Veículo:</label>
              <select value={idVehicle} onChange={handleIdVehicleChange}>
                <option value="">Selecione um veículo</option>
                {userVehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.modelName} - {vehicle.licensePlate}
                  </option>
                ))}
              </select>
            </div>
            {idVehicle && (
              <>
                <div>
                  <label>Estimativa de Tempo:</label>
                  <input
                    type="date"
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const day = String(selectedDate.getDate() + 1).padStart(2, '0');
                      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                      const year = selectedDate.getFullYear();
                      const formattedDate = `${day}/${month}/${year}`;
                      setTimeEstimate(formattedDate);
                    }}
                    value={timeEstimate}
                  />
                </div>
                <label> Data escolhida: {timeEstimate}  </label>
                {/* Outros campos do formulário */}
                <div>
                <div>
                  <label>Valor Total:</label>
                  <NumericFormat
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$"
                    value={totalValue}
                    onValueChange={({ value }) => {
                      const cleanedValue = value.replace(/[.,]/g, '');
                      setTotalValue(cleanedValue);
                    }}
                    format={(value) => {
                      if (!value) return '';
                      const numberValue = value.replace(/[^0-9]+/g, '');
                      const formattedValue = new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(Number(numberValue) / 100);
                      return formattedValue;
                    }}
                  />
                </div>
              </div>
                {/* Outros campos do formulário */}
                <button type="submit" disabled={loading}>
                  {loading ? 'Aguarde...' : 'Cadastrar'}
                </button>
              </>
            )}
          </>
        )}
      </form>

      <h2>Orçamentos Cadastrados</h2>
      {budgets.length === 0 ? (
        <p>Nenhum orçamento cadastrado.</p>
      ) : (
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Valor</th>
            <th>Data Estimada</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
        {budgets.map((budget) => (
          <tr key={budget.id}>
            <td>{budget.id}</td>
            <td>{budget.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>{budget.timeEstimate}</td>
            <td>
              <button className="button-style" onClick={() => handleDeleteBudget(budget.id)}>
                Excluir
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      )}

      {error && <p>{error}</p>}
    </div>
      </SidebarAdmin>
  );
};

export default CreateBudget;
