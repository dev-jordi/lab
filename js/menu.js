// Seleciona o botão de menu e o menu
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('ul.menu'); // Seletor mais específico

// Verifique se o botão e o menu são encontrados
if (menuToggle && menu) {
    // Adiciona o evento de clique no botão de menu
    menuToggle.addEventListener('click', () => {
        // Alterna a classe 'active' para mostrar ou esconder o menu
        menu.classList.toggle('active');
    });
} else {
    console.error("Botão de menu ou menu não encontrados!");
}
////////////////////////////////////////////////////////////////////////////////// menu

const rainContainer = document.querySelector('.rain');

function createRainDrop() {
    const rainDrop = document.createElement('div');
    rainDrop.classList.add('rain-drop');
    rainDrop.style.left = Math.random() * 100 + 'vw'; // Distribui os raios aleatoriamente na largura da tela

    // Calcula a altura total da página
    const pageHeight = Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
    rainDrop.style.animationDuration = (pageHeight / 300) + 's'; // Ajusta a duração proporcionalmente à altura da página
    rainContainer.appendChild(rainDrop);

    // Remove a gota de chuva depois da animação
    setTimeout(() => {
        rainDrop.remove();
    }, (pageHeight / 300) * 1000); // Ajusta o tempo de remoção para corresponder à duração da animação
}

// Cria múltiplas gotas de chuva continuamente
setInterval(createRainDrop, 700);

document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".box");

    boxes.forEach(box => {
        box.addEventListener("click", () => {
            const isActive = box.classList.contains("active");

            // remove todas classes
            boxes.forEach(b => {
                b.classList.remove("active");
                b.classList.remove("inactive-hidden");
            });

            if (!isActive) {
                // ativa a clicada
                box.classList.add("active");
                // esconde as outras
                boxes.forEach(b => {
                    if (b !== box) b.classList.add("inactive-hidden");
                });
            }
        });
    });
});

const wall = document.querySelector('.wall');
const imgs = wall.querySelectorAll('img');

imgs.forEach(img => {
    // Limita a posição para não encostar nas bordas (10% a 85%)
    const x = 10 + Math.random() * 75; 
    const y = 10 + Math.random() * 75; 

    // Rotação menor (-5° a 5°)
    const rotate = (Math.random() - 0.5) * 10; 

    // Escala mais próxima de 1 (0.9 a 1.05)
    const scale = 0.9 + Math.random() * 0.15; 

    img.style.position = 'absolute';
    img.style.left = x + '%';
    img.style.top = y + '%';
    img.style.transform = `rotate(${rotate}deg) scale(${scale})`;
});