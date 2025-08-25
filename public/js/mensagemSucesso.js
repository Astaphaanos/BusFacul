
document.addEventListener('DOMContentLoaded', (e) => {
    const sucessAlert = document.getElementById('success-alert')

    if(sucessAlert) {
        setTimeout(() => {
            sucessAlert.style.display = 'none'
        },5000)
    }
})