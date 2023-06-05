import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './CreateServiceType.css';

const CreateServiceType = () => {
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceTypes, setServiceTypes] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState(null);

  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ServiceTypes');
      setServiceTypes(response.data);
    } catch (error) {
      console.error('Error fetching service types:', error);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const handleInputChange = (e) => {
    setTypeName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!typeName) {
      setError('Por favor, insira o nome do serviço.');
      return;
    }

    if (editingServiceType) {
      try {
        setLoading(true);
        setError('');

        const data = {
          typeName: typeName
        };

        await axios.patch(`http://localhost:5000/api/ServiceTypes/${editingServiceType.id}`, data);
        Swal.fire('Sucesso', `Serviço "${typeName}" atualizado com sucesso!`, 'success');

        setTypeName('');
        fetchServiceTypes();
        handleToggleAddService(); // Close the add service form after submission
      } catch (error) {
        setError('Ocorreu um erro ao atualizar o serviço.');
        Swal.fire('Erro', 'Ocorreu um erro ao atualizar o serviço.', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      const existingService = serviceTypes.find((serviceType) => serviceType.typeName === typeName);
      if (existingService) {
        Swal.fire('Erro', 'Esse serviço já está cadastrado.', 'error');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = {
          typeName: typeName
        };

        await axios.post('http://localhost:5000/api/ServiceTypes', data);
        Swal.fire('Sucesso', `Serviço "${typeName}" cadastrado com sucesso!`, 'success');

        setTypeName('');
        fetchServiceTypes();
        handleToggleAddService(); // Close the add service form after submission
      } catch (error) {
        setError('Ocorreu um erro ao cadastrar o serviço.');
        Swal.fire('Erro', 'Ocorreu um erro ao cadastrar o serviço.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteServiceType = async (id, serviceName) => {
    try {
      const result = await Swal.fire({
        title: 'Confirmação',
        text: `Tem certeza que deseja excluir o serviço "${serviceName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`http://localhost:5000/api/ServiceTypes/${id}`);
        Swal.fire('Sucesso', `Serviço "${serviceName}" excluído com sucesso!`, 'success');
        fetchServiceTypes();
      }
    } catch (error) {
      console.error('Error deleting service type:', error);
      Swal.fire('Erro', 'Ocorreu um erro ao excluir o serviço.', 'error');
    }
  };

  const handleEditServiceType = (serviceType) => {
    setEditingServiceType(serviceType);
    setShowAddService(true);
    setTypeName(serviceType.typeName);
    setError('');
  };

  const handleToggleAddService = () => {
    setEditingServiceType(null);
    setShowAddService(!showAddService);
    setTypeName('');
    setError('');
  };

  return (
    <div className="container">
      {!showAddService && (
        <>
          <h2>Serviços prestados: </h2>
          <ul>
            {serviceTypes.map((serviceType) => (
              <li key={serviceType.id}>
                {serviceType.typeName}
                <span>
                  <FaEdit onClick={() => handleEditServiceType(serviceType)} />
                  <FaTrash onClick={() => handleDeleteServiceType(serviceType.id, serviceType.typeName)} />
                </span>
              </li>
            ))}
          </ul>
          <button onClick={handleToggleAddService}>Adicionar Novo Serviço</button>
        </>
      )}
      {showAddService && (
        <div>
          <h2>{editingServiceType ? 'Editar Serviço' : 'Cadastrar Serviço'}</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Nome do Serviço:</label>
              <input type="text" value={typeName} onChange={handleInputChange} />
            </div>
            <div>
              <button type="submit" disabled={loading}>
                {loading ? 'Aguarde...' : editingServiceType ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button type="button" onClick={handleToggleAddService}>Cancelar</button>
            </div>
          </form>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CreateServiceType;
