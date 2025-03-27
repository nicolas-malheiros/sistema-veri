// Carregar perguntas e respostas do localStorage
window.onload = function() {
    loadQuestions();
  };
  
  // Função para carregar as perguntas e respostas salvas no localStorage
  function loadQuestions() {
    const preExistingQuestions = JSON.parse(localStorage.getItem('preExistingQuestions')) || [
      "Se daqui a 10, 20 anos, provavel estar casada, e talvez seu relacionamento não seja mais o mesmo, e então vai culpar seu marido e lembrará de todos os homens que um dia conheceu, bom, eu sou esse cara?",
      "Você acredita que as coisas acontecem por um motivo, ou a vida é só uma sequência de coincidências?",
      "Você acha que a gente só tem uma chance na vida para encontrar alguém assim, ou é algo que pode acontecer várias vezes?",
    ];
  
    const addedQuestions = JSON.parse(localStorage.getItem('addedQuestions')) || [];
  
    // Carregar perguntas pré-existentes
    const preExistingContainer = document.getElementById('pre-existing-questions');
    preExistingContainer.innerHTML = ''; // Limpar container antes de adicionar
    preExistingQuestions.forEach(question => {
      const questionElement = createQuestionElement(question);
      preExistingContainer.appendChild(questionElement);
    });
  
    // Carregar perguntas adicionadas pelo usuário
    const addedContainer = document.getElementById('added-questions');
    addedContainer.innerHTML = ''; // Limpar container antes de adicionar
    addedQuestions.forEach(question => {
      const questionElement = createQuestionElement(question);
      addedContainer.appendChild(questionElement);
    });
  }
  
  // Função para criar um elemento de pergunta com o botão de resposta e limpar
  function createQuestionElement(question) {
    const questionElement = document.createElement('div');
    questionElement.classList.add('question');
    questionElement.innerHTML = `
      <p>${question}</p>
      <button class="responder" onclick="answerQuestion('${question}', this)">Responder</button>
      <button class="limpar" onclick="clearQuestion('${question}', this)">Limpar</button> <!-- Botão para limpar -->
      <div class="answer" style="display: none;"></div> <!-- A resposta fica oculta inicialmente -->
    `;
  
    // Verificar se a resposta já foi armazenada no localStorage e exibi-la
    const storedAnswers = JSON.parse(localStorage.getItem('answers')) || {};
    if (storedAnswers[question]) {
      const answerDiv = questionElement.querySelector('.answer');
      answerDiv.style.display = 'block'; // Exibe a resposta
      answerDiv.textContent = storedAnswers[question]; // Exibe a resposta salva
    }
  
    return questionElement;
  }
  
  // Função para responder a uma pergunta
  function answerQuestion(question, buttonElement) {
    const response = prompt(`Resposta para: "${question}"`);
  
    if (response) {
      const questionDiv = buttonElement.parentElement;
      const answerDiv = questionDiv.querySelector('.answer');
      answerDiv.style.display = 'block'; // Exibe a resposta
      answerDiv.textContent = response; // Adiciona a resposta no div
  
      // Salvar a resposta no localStorage
      saveAnswer(question, response);
    }
  }
  
  // Função para salvar a resposta no localStorage
  function saveAnswer(question, response) {
    const answers = JSON.parse(localStorage.getItem('answers')) || {};
    answers[question] = response;
    localStorage.setItem('answers', JSON.stringify(answers));
  }
  
  // Função para limpar uma pergunta e sua resposta
  function clearQuestion(question, buttonElement) {
    // Remover pergunta e resposta do localStorage
    const addedQuestions = JSON.parse(localStorage.getItem('addedQuestions')) || [];
    const preExistingQuestions = JSON.parse(localStorage.getItem('preExistingQuestions')) || [];
  
    // Remover a pergunta da lista correta (adicionada ou pré-existente)
    const updatedAddedQuestions = addedQuestions.filter(q => q !== question);
    const updatedPreExistingQuestions = preExistingQuestions.filter(q => q !== question);
  
    // Atualizar o localStorage
    localStorage.setItem('addedQuestions', JSON.stringify(updatedAddedQuestions));
    localStorage.setItem('preExistingQuestions', JSON.stringify(updatedPreExistingQuestions));
  
    // Remover a resposta também do localStorage
    const answers = JSON.parse(localStorage.getItem('answers')) || {};
    delete answers[question];
    localStorage.setItem('answers', JSON.stringify(answers));
  
    // Atualizar a tela removendo a pergunta
    buttonElement.parentElement.remove();
  }
  
  // Função para adicionar novas perguntas
  function addNewQuestion() {
    const newQuestionInput = document.getElementById('new-question');
    const newQuestion = newQuestionInput.value.trim();
  
    if (newQuestion) {
      // Adicionar nova pergunta à lista de perguntas
      const addedQuestions = JSON.parse(localStorage.getItem('addedQuestions')) || [];
      addedQuestions.push(newQuestion);
      localStorage.setItem('addedQuestions', JSON.stringify(addedQuestions));
  
      // Atualizar a tela
      const addedContainer = document.getElementById('added-questions');
      const questionElement = createQuestionElement(newQuestion);
      addedContainer.appendChild(questionElement);
  
      newQuestionInput.value = ''; // Limpar campo de input
    } else {
      alert('Por favor, digite uma pergunta!');
    }
  }
  