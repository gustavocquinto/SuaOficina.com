import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './CreateService.css'; // Importando o arquivo CSS personalizado
import SidebarAdmin from '../../components/SidebarAdmin';

const CreateService = () => {
  const [serviceDescription, setServiceDescription] = useState('');
  const [price, setPrice] = useState('');
  const [observations, setObservations] = useState('');
  const [serviceStatus, setServiceStatus] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [users, setUsers] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchBudgets(selectedUser);
    } else {
      setBudgets([]);
      setSelectedBudget('');
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/Users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBudgets = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/Budgets/User/${userId}`);
      setBudgets(response.data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ServiceTypes');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleUserChange = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
  };

  const handleBudgetChange = (e) => {
    const budgetId = e.target.value;
    setSelectedBudget(budgetId);
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedService(serviceId);
  };

  const createService = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/Services', data);
      console.log(response.data); // Log the response data for debugging purposes
      // Handle the response as needed
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const selectedBudgetObject = budgets.find((budget) => budget.id === selectedBudget);

      const data = {
        serviceDescription: serviceDescription,
        price: parseFloat(price),
        observations: observations,
        serviceStatus: serviceStatus,
        creationDate: creationDate,
        userId: selectedUser,
        idServiceType: selectedService,
        idVehicle: selectedBudgetObject.vehicle.id,
        idBudget: selectedBudget
      };

      console.log(data); // Log the data for debugging purposes

      await createService(data);

      setServiceDescription('');
      setPrice('');
      setObservations('');
      setServiceStatus('');
      setCreationDate('');
      setSelectedUser('');
      setSelectedBudget('');
      setSelectedService('');
    } catch (error) {
      setError('An error occurred while submitting the service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarAdmin>
      <div className="create-service-container"> {/* Adicionando a classe CSS */}
      <h2>Cadastrar serviço</h2>
      <Link to="/servicesType">
        <button className="manage-service-types-button">Gerenciar tipos de serviço</button>
      </Link>
     
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário:</label>
          <select value={selectedUser} onChange={handleUserChange}>
            <option value="">Selecione o usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        {selectedUser && (
          <div>
            <label>Orçamento:</label>
            <select value={selectedBudget} onChange={handleBudgetChange}>
              <option value="">Selecione o orçamento</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.id}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label>Tipo de serviço:</label>
          <select value={selectedService} onChange={handleServiceChange}>
            <option value="">Selecione o serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.typeName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Descrição do serviço:</label>
          <input type="text" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} />
        </div>
        <div>
          <label>Preço:</label>
          <input type="number" step="1.00"value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label>Observações:</label>
          <textarea value={observations} onChange={(e) => setObservations(e.target.value)} />
        </div>
        <div>
          <label>Status de serviço:</label>
          <select required value={serviceStatus} onChange={(e) => setServiceStatus(e.target.value)}>
            <option value="">Selecione o status</option>
            <option value="2">Pendente</option>
            <option value="1">Em Andamento</option>
            <option value="0">Finalizado</option>
          </select>
        </div>
        <div>
          <label>Data de entrada:</label>
          <input type="date" value={creationDate} onChange={(e) => setCreationDate(e.target.value)} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    </SidebarAdmin>
    
  );
};

export default CreateService;
