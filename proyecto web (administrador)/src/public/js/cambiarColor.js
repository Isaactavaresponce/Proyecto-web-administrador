$(document).ready(function () {
    //obtenemos los botones en contantes para su modificacion
    const pillLoginButton = document.querySelector('.pillLoginButton');
    const pillRegisterButton = document.querySelector('.pillRegisterButton');

    //se marca el boton 1 como activo y el 2 como inactivo
    $(".pillLoginButton").click(function () {
        pillLoginButton.style.color = 'rgb(255, 166, 0)';
        pillRegisterButton.style.color = 'rgb(170, 170, 170)';
    });

    //se marca el boton 2 como activo y el 1 como inactivo
    $(".pillRegisterButton").click(function () {
        pillLoginButton.style.color = 'rgb(170, 170, 170)';
        pillRegisterButton.style.color = 'rgb(255, 166, 0)';
    });
});