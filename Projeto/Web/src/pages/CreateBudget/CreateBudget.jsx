import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateBudget = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [timeEstimate, setTimeEstimate] = useState(0);
  const [visitDate, setVisitDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/Users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError('Erro ao carregar os usuários.');
      });

    axios.get('http://localhost:5000/api/ServiceTypes')
      .then((response) => {
        setServiceTypes(response.data);
      })
      .catch((error) => {
        setError('Erro ao carregar os tipos de serviço.');
      });
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:5000/api/Vehicles/User/${selectedUser.id}`)
        .then((response) => {
          setVehicles(response.data);
        })
        .catch((error) => {
          setError('Erro ao carregar os veículos.');
        });
    }
  }, [selectedUser]);

  useEffect(() => {
    updateTotalValue(selectedServices);
  }, [selectedServices]);

  const handleUserSelect = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
    setSelectedUser(selectedUser);
  };

  const handleVehicleSelect = (vehicleId) => {
    const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId);
    setSelectedVehicle(selectedVehicle);
  };

  const handleServicePriceChange = (serviceId, price) => {
    const updatedServices = selectedServices.map((service) => {
      if (service.id === serviceId) {
        return {
          ...service,
          price: Number(price),
        };
      }
      return service;
    });
    setSelectedServices(updatedServices);
  };

  const handleAddService = () => {
    if (selectedServiceType) {
      const newService = {
        id: selectedServices.length + 1,
        serviceDescription: selectedServiceType.typeName,
        price: 0,
      };
      setSelectedServices([...selectedServices, newService]);
    }
  };

  const handleServiceTypeSelect = (serviceTypeId) => {
    const selectedServiceType = serviceTypes.find((serviceType) => serviceType.id === serviceTypeId);
    setSelectedServiceType(selectedServiceType);
  };

  const handleServiceDeselect = (serviceId) => {
    setSelectedServices((prevServices) =>
      prevServices.filter((service) => service.id !== serviceId)
    );
  };

  const updateTotalValue = (services) => {
    const total = services.reduce((sum, service) => sum + (service.price || 0), 0);
    setTotalValue(total);
  };

  const handleSubmit = () => {
    if (!selectedUser || !selectedVehicle) {
      setError('Selecione um usuário e um veículo.');
      return;
    }

    setLoading(true);

    const budget = {
      idUser: selectedUser.id,
      idVehicle: selectedVehicle.id,
      visitDate,
      timeEstimate,
      totalValue,
    };

    axios
      .post('http://localhost:5000/api/Budgets', budget)
      .then((response) => {
        console.log('Budget created:', response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Erro ao criar o orçamento.');
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Criar Orçamento</h2>

      <div>
        <label>
          Usuário:
          <select onChange={(e) => handleUserSelect(e.target.value)}>
            <option value="">Selecione um usuário</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Veículo:
          <select onChange={(e) => handleVehicleSelect(e.target.value)}>
            <option value="">Selecione um veículo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.modelName} - {vehicle.brandName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <label>
          Data de visita:
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Tempo estimado:
          <input
            type="number"
            value={timeEstimate}
            onChange={(e) => setTimeEstimate(Number(e.target.value))}
          />
        </label>
      </div>

      <div>
        <h3>Serviços Selecionados</h3>
        {selectedServices.length === 0 ? (
          <p>Nenhum serviço selecionado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Preço</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {selectedServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.serviceDescription}</td>
                  <td>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) =>
                        handleServicePriceChange(service.id, e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleServiceDeselect(service.id)}>
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div>
        <h3>Adicionar Serviço</h3>
        <select
          onChange={(e) => handleServiceTypeSelect(e.target.value)}
          value={selectedServiceType?.id || ''}
        >
          <option value="">Selecione um tipo de serviço</option>
          {serviceTypes.map((serviceType) => (
            <option key={serviceType.id} value={serviceType.id}>
              {serviceType.typeName}
            </option>
          ))}
        </select>
        <button onClick={handleAddService}>Adicionar</button>
      </div>

      <div>
        <h3>Resumo do Orçamento</h3>
        <p>Valor Total: R$ {totalValue}</p>
      </div>

      <div>
        {error && <p>{error}</p>}
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default CreateBudget;
