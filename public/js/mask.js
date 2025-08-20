
window.addEventListener("DOMContentLoaded", () => {
  if (window.VMasker) {
    const cpfInput = document.querySelector("#cpf")
    if (cpfInput) {
      VMasker(cpfInput).maskPattern("999.999.999-99")
    }

    const telefoneInput = document.querySelector("#telefone")
    if (telefoneInput) {
      VMasker(telefoneInput).maskPattern("(99) 99999-9999")
    }
  }
})
