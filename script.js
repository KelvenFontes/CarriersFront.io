const apiBaseUrl = 'http://apicarriers-env.eba-tbcaswzg.us-east-1.elasticbeanstalk.com/api';

// Função para mostrar mensagem
function showMessage(message, color) {
  const messageBox = document.getElementById('message');
  messageBox.textContent = message;
  messageBox.classList.remove('alert-success', 'alert-danger'); // Remover classes anteriores
  messageBox.classList.add(`alert-${color}`);
  messageBox.style.display = 'block';
  setTimeout(() => {
    messageBox.style.display = 'none';
    messageBox.classList.remove(`alert-${color}`);
  }, 15000); // Exibir mensagem por 5 segundos e depois esconder
}

function formatBrazilianDateTime(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}

function formatIsActive(isActive) {
  return isActive ? 'Ativo' : 'Inativo';
}

const createButton = document.getElementById('create');
const getCnpjButton = document.getElementById('getCnpjButton');
const deleteButton = document.getElementById('deleteButton');
const carriersList = document.getElementById('carriersList');

// createButton.addEventListener('click', createCarrier);
getCnpjButton.addEventListener('click', getCarrierByCnpj);
// deleteButton.addEventListener('click', deleteCarrierById);

document.getElementById('create').addEventListener('click', async () => {
  const cnpj = document.getElementById('cnpj').value;
  const corporateName = document.getElementById('corporateName').value;
  const fantasyName = document.getElementById('fantasyName').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const uf = document.getElementById('uf').value;
  const postalCode = document.getElementById('postalCode').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  const newCarrier = {
    CNPJ: cnpj,
    corporateName: corporateName,
    fantasyName: fantasyName,
    address: address,
    city: city,
    UF: uf,
    postalCode: postalCode,
    phone: phone,
    email: email,
  };

  try {
    const response = await fetch(`${apiBaseUrl}/Carriers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCarrier),
    });

    if (response.ok) {

      const responseData = await response.json();
      showMessage(responseData.message, 'success');

      document.getElementById('cnpj').value = '';
      document.getElementById('corporateName').value = '';
      document.getElementById('fantasyName').value = '';
      document.getElementById('address').value = '';
      document.getElementById('city').value = '';
      document.getElementById('uf').value = '';
      document.getElementById('postalCode').value = '';
      document.getElementById('phone').value = '';
      document.getElementById('email').value = '';

      // Atualizar a lista de transportadoras
      getAllCarriers();
    } else {
      const errorData = await response.json();
      console.log(errorData)
      showMessage(`Error: ${errorData.error}`, 'danger');
      console.error('Erro ao criar transportadora:', errorData.error);
    }
  } catch (error) {
    showMessage('An error occurred', 'danger');
    console.error('Erro ao criar transportadora:', error);
  }
});


async function getCarrierByCnpj() {
  const getCnpj = document.getElementById('getCnpj').value;

  try {
    const response = await fetch(`${apiBaseUrl}/Carriers/company/${getCnpj}`);

    if (response.ok) {
      const data = await response.json();

      const carrier = data.transporter; 

      showMessage(data.message, 'success');

      carriersList.innerHTML = ''; // Limpa a lista antes de preencher com novo resultado
      pagination.innerHTML = ''; // Limpa a paginação

      const rawDateTime = carrier.createdAt;
      const formattedDateTime = formatBrazilianDateTime(rawDateTime);

      const isActive = carrier.isActive;
      const formattedStatus = formatIsActive(isActive);

      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'bg-light', 'mb-3');
      listItem.innerHTML = `
      <h5 class="mb-1">${carrier.corporateName}</h5>
      <p class="mb-1">ID: ${carrier.id}</p>
      <p class="mb-1">CNPJ: ${carrier.CNPJ}</p>
      <p class="mb-1">Fantasy name: ${carrier.fantasyName}</p>
      <p class="mb-1">Adress: ${carrier.address}</p>
      <p class="mb-1">City: ${carrier.city}</p>
      <p class="mb-1">State: ${carrier.UF}</p>
      <p class="mb-1">Postal code: ${carrier.postalCode}</p>
      <p class="mb-1">Phone: ${carrier.phone}</p>
      <p class="mb-1">email: ${carrier.email}</p>
      <p class="mb-1">isActive: ${formattedStatus}</p>
      <p class="mb-1">cretedAt: ${formattedDateTime}</p>
      `;
      carriersList.appendChild(listItem);
    } else {
      const errorData = await response.json(); // Extrai a mensagem de erro, se disponível
      console.error('Error getting carrier by CNPJ:', errorData.message);
    }
  } catch (error) {
    console.error('Error getting carrier by CNPJ:', error);
  }
}

// Função para obter todos os transportadores
async function getAllCarriers() {
  try {
    const response = await fetch(`${apiBaseUrl}/Carriers`);
    if (response.ok) {
      const data = await response.json();

      if (data) {
        const carriers = data.transporters;

        console.log(carriers);

        showMessage(data.message, 'success');

        carriersList.innerHTML = '';
        pagination.innerHTML = '';

        carriers.forEach(carrier => {
          const rawDateTime = carrier.createdAt;
          const formattedDateTime = formatBrazilianDateTime(rawDateTime);

          const isActive = carrier.isActive;
          const formattedStatus = formatIsActive(isActive);

          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item', 'bg-light', 'mb-3');
          listItem.innerHTML = `
            <h5 class="mb-1">${carrier.corporateName}</h5>
            <p class="mb-1">ID: ${carrier.id}</p>
            <p class="mb-1">CNPJ: ${carrier.CNPJ}</p>
            <p class="mb-1">Fantasy name: ${carrier.fantasyName}</p>
            <p class="mb-1">Adress: ${carrier.address}</p>
            <p class="mb-1">City: ${carrier.city}</p>
            <p class="mb-1">State: ${carrier.UF}</p>
            <p class="mb-1">Postal code: ${carrier.postalCode}</p>
            <p class="mb-1">Phone: ${carrier.phone}</p>
            <p class="mb-1">email: ${carrier.email}</p>
            <p class="mb-1">isActive: ${formattedStatus}</p>
            <p class="mb-1">cretedAt: ${formattedDateTime}</p>
          `;
          carriersList.appendChild(listItem);
        });

      } else {
        console.error('Erro ao buscar dados:', 'Dados de transportadoras ausentes na resposta');
      }
    } 
    else {
      const errorData = await response.json();
      console.error('Erro ao buscar dados:', errorData.message);
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

const updateIsActiveToggle = document.getElementById('updateIsActiveToggle');
const isActiveText = document.getElementById('isActiveText');

updateIsActiveToggle.addEventListener('change', () => {
  isActiveText.textContent = updateIsActiveToggle.checked ? 'Ativo' : 'Inativo';
  isActiveText.classList.toggle('inactive-text', !updateIsActiveToggle.checked);
  
  // Adicionar/remover classes para alternar as cores do toggle
  updateIsActiveToggle.classList.toggle('toggle-input-active', updateIsActiveToggle.checked);
});


// Função para atualizar transportadora
document.getElementById('update').addEventListener('click', async () => {
  const id = document.getElementById('updateId').value;
  const updateIsActiveSelect = document.getElementById('updateIsActive');

  console.log(updateIsActiveSelect.value);
  
  const updatedCarrier = {
    // CNPJ: document.getElementById('updateCnpj').value,
    corporateName: document.getElementById('updateCorporateName').value,
    fantasyName: document.getElementById('updateFantasyName').value,
    address: document.getElementById('updateAddress').value,
    city: document.getElementById('updateCity').value,
    UF: document.getElementById('updateUF').value,
    postalCode: document.getElementById('updatePostalCode').value,
    phone: document.getElementById('updatePhone').value,
    email: document.getElementById('updateEmail').value,
    isActive: updateIsActiveSelect.value
  };

  try {
    const response = await fetch(`${apiBaseUrl}/Carriers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCarrier),
    });

    const response2 = await response.json();

    if(response2.error !== '') {
      showMessage(`Error: ${response2.error}`, 'danger');
    }

    if (response.ok) {
      
      const responseData = await response.json();
      showMessage(responseData.message, 'success');
      // Limpar campos após atualização bem-sucedida
      // Atualizar a lista de transportadoras
      setTimeout(() => {
        getAllCarriers();
      }, 5000);

    } else {
      const errorData = await response.json();
      showMessage(`Error: ${errorData}`, 'danger');
      console.log('aqui')
    }
  } catch (error) {
    showMessage(`Error: ${response2.error}`, 'danger');
    console.error('Erro ao atualizar transportadora:', error);
  }
});

document.getElementById('searchButton').addEventListener('click', () => {
  getAllCarriers();
});

// Chame a função para obter todos os transportadores assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  getAllCarriers();
});
