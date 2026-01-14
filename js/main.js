$(document).ready(function(){

    // LOGIN

    $('#result').hide();

    const user = 'cristian@dosiscl.com';
    const pass = '1234';
    
    $('#loginForm').submit(function(e){
        e.preventDefault();

        const emailVal = $('#email').val();
        const passVal = $('#password').val();

        if(emailVal === user && passVal === pass){
            localStorage.setItem('user',emailVal);
            $('#result').html('')

            $('#result').append(`
                <div class="alert alert-success" role="alert">
                Bienvenido ${emailVal}
                </div>
            `)
            .slideDown();

            setTimeout(function () {
                window.location.href = "menu.html";
            }, 3000);
        }else{

            $('#result').html('')
            
            $('#result').append(`
                <div class="alert alert-danger" role="alert">
                Los datos ingresados son incorrectos
                </div>
            `)
            .slideDown();

            setTimeout(function () {
                $('#result').slideUp()
            }, 3000);
        }
    });

    // MENU

    let saldo = Number(localStorage.getItem('saldo')) || 0;
    let userCurrent = localStorage.getItem('user') || '';

    $('#saldo').text(saldo);

    if(userCurrent != ''){
        $('#user-current').text('Hola '+ userCurrent);
    }else{
        $('#user-current').text('Hola usuario.');
    }
    

    $('#deposit').click(function(e){
        e.preventDefault();
        showLegends('depositar','deposit');
    });

    $('#sendMoney').click(function(e){
        e.preventDefault();
        showLegends('enviar dinero','sendmoney');
    });

    $('#lastMov').click(function(e){
        e.preventDefault();
        showLegends('últimos movimientos','transactions');
    }); 

    $('#resultsMenu').hide();

    function showLegends(message,link) {
      $('#resultsMenu').append(`
        <div class="alert alert-success alert-dismissible fade show" role="alert">
        <p>redirigiendo a ${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
      `)
      .slideDown();

      setTimeout(() => {
        window.location.href = `${link}.html`;
      }, 1500);
    }

});