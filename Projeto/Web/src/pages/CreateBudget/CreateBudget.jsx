import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Swal from 'sweetalert2';
import './CreateBudget.css';

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

  useEffect(() => {
    fetchUsers();
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

  return (
    <div className="create-budget-container">
      <h2>Cadastrar Budget</h2>
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
                    value={timeEstimate}
                    onChange={(e) => setTimeEstimate(e.target.value)}
                  />
                </div>
               
                <button type="submit" disabled={loading}>
                  {loading ? 'Aguarde...' : 'Cadastrar'}
                </button>
              </>
            )}
          </>
        )}
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateBudget;
