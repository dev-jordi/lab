export class PythonDebugger {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Div com id "${containerId}" não encontrada`);
    }

    this.container.innerHTML = `
      <div class="py-debugger">
        <textarea class="py-code" rows="10" cols="50">print("Hello, Jordi!")</textarea><br>
        <button class="py-run">▶️ Rodar</button>
        <pre class="py-output"></pre>
      </div>
    `;

    this.textarea = this.container.querySelector(".py-code");
    this.button = this.container.querySelector(".py-run");
    this.output = this.container.querySelector(".py-output");

    this.init();
  }

  async init() {
    this.output.textContent = "⏳ Carregando Python (Pyodide)...";
    this.pyodide = await loadPyodide();
    this.output.textContent = "✅ Pyodide pronto!";
    this.button.addEventListener("click", () => this.runCode());
  }

  async runCode() {
  const code = this.textarea.value;
  try {
    const result = await this.pyodide.runPythonAsync(code);
    this.output.textContent = result ?? "✔️ Código executado!";
  } catch (err) {
    // janela simples com erro
    alert("Erro no código Python:\n\n" + err);
  }
 }
}
