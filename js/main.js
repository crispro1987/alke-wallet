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
});