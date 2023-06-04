import React, { useState } from 'react';
import axios from 'axios';

const CreateServiceType = () => {
  const [typeName, setTypeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setTypeName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      // Dados a serem enviados para a API
      const data = {
        typeName: typeName
      };

      // Envia a requisição POST para a API
      const response = await axios.post('http://localhost:5000/api/ServiceTypes', data);

      // Exibe mensagem de sucesso
      alert('ServiceType cadastrado com sucesso!');

      // Limpa o campo de nome do tipo de serviço
      setTypeName('');
    } catch (error) {
      setError('Ocorreu um erro ao cadastrar o ServiceType.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cadastrar ServiceType</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Tipo de Serviço:</label>
          <input type="text" value={typeName} onChange={handleInputChange} />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Cadastrar'}
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default CreateServiceType;
