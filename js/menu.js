// Seleciona o botão de menu e o menu
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('ul');

// Verifique se o botão e o menu são encontrados
if (menuToggle && menu) {
    // Adiciona o evento de clique no botão de menu
    menuToggle.addEventListener('click', () => {
        // Alterna a classe 'active' para mostrar ou esconder o menu
        menu.classList.toggle('active');
    });
} else {
    console.error("Elementos não encontrados!");
}
