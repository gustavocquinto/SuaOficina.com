import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './CreateServiceType.css';

import SidebarAdmin from '../../components/SidebarAdmin';

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
    setTypeName(serviceType.typeName);
    handleToggleAddService();
  };

  const handleToggleAddService = () => {
    setShowAddService(!showAddService);
    setEditingServiceType(null);
    setTypeName('');
    setError('');
  };

  return (
    <SidebarAdmin>
        <div className="create-service-type">
      <div className="create-service-type-header">
        <h2>Gerenciar Categorias de Serviço</h2>
        <button className="add-service-button" onClick={handleToggleAddService}>
          {!showAddService ? 'Adicionar Categoria' : 'Cancelar'}
        </button>
      </div>
      {showAddService && (
        <form className="add-service-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="service-name-input"
            placeholder="Insira o nome do serviço"
            value={typeName}
            onChange={handleInputChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button" disabled={loading}>
            {editingServiceType ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
          </button>
        </form>
      )}
      <div className="service-types-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Serviço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {serviceTypes.map((serviceType) => (
              <tr key={serviceType.id}>
                <td>{serviceType.id}</td>
                <td>{serviceType.typeName}</td>
                <td className="actions-column">
                  <button
                    className="edit-button"
                    onClick={() => handleEditServiceType(serviceType)}
                    disabled={loading}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteServiceType(serviceType.id, serviceType.typeName)}
                    disabled={loading}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
      </SidebarAdmin>
    
  );
};

export default CreateServiceType;
