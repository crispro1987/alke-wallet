$(document).ready(function(){

    // SEND MONEY

    const contacts = [
        { name: "John", lastname: "Doe", cbu: "123456789", alias:"john.doe", bank: "ABC Bank" },
        { name: "Jane", lastname: "Smith", cbu: "987654321", alias:"jane.smith", bank: "XYZ Bank" }
    ];
    

    $('#filter').on('input', function () {
        const value = $(this).val();
        renderContacts(value);
    });

    function renderContacts(filterText = "") {
        const $list = $('#clientsList');
        const $dataList = $('#contacts-list');
        $list.empty();
        $dataList.empty();

        const text = filterText.toLowerCase();

        const filteredContacts = contacts.filter(valor =>
            valor.name.toLowerCase().includes(text) ||
            valor.lastname.toLowerCase().includes(text) ||
            valor.alias.toLowerCase().includes(text) || 
            valor.name.toLowerCase() +' '+ valor.lastname.toLowerCase()== text
        );

        if (filteredContacts.length === 0) {
            $list.append(`
                <li class="list-group-item text-muted">
                    No se encontraron contactos
                </li>
            `);
            return;
        }

        filteredContacts.forEach((val, i) => {
            const realIndex = contacts.indexOf(val); // índice real

            $list.append(`
                <li class="list-group-item" data-index="${realIndex}">
                    <div class="contact-info">
                        <span class="me-2"><strong>Nombre: </strong>${val.name} ${val.lastname}</span>
                        <span class="me-2"><strong>RUT: </strong> ${val.cbu}</span>
                        <span class="me-2"><strong>Alias: </strong> ${val.alias}</span>
                        <span><strong>Bank: </strong> ${val.bank}</span>
                    </div>
                </li>
            `);

            $dataList.append(`
                <option value="${val.name} ${val.lastname}"></option>
            `)
        });
    }

    renderContacts();

    $('#addContact').on('shown.bs.modal', function () {
        $('#name').focus();
    });

    $('#saveClient').click(function(e){
        e.preventDefault();
        let isValid = true;
        let requiredFields = ["#name", "#lastname", "#alias", "#bank", "#cbu"];

        requiredFields.forEach(function (field) {
            if ($(field).val().trim() === "") {
                isValid = false;
                $(field).addClass("is-invalid");
            } else {
                $(field).removeClass("is-invalid");
            }
        });

        let cbu = $('#cbu').val().trim();
        let cbuRegex = /^[0-9]{9}$/;

        if (!cbuRegex.test(cbu)) {
            isValid = false;
            $('#cbu').addClass("is-invalid");
        }

        if (!isValid) {
            
            $('#resultModal').html('');
            $('#resultModal').hide();
            $('#resultModal').append(`
                <div class="alert alert-danger" role="alert">
                    Verifique los campos obligatorios. El CBU debe tener 9 dígitos numéricos.
                </div>
            `)
            .slideDown();
            return;
        }else{
            contacts.push({
                name: $('#name').val(),
                lastname: $('#lastname').val(),
                cbu: cbu,
                alias: $('#alias').val(),
                bank: $('#bank').val()
            }); 

            $('#saveClient').blur();
            bootstrap.Modal.getInstance($('#addContact'))?.hide();
        }
        
    });

    $('#addContact').on('hide.bs.modal',function () {
       renderContacts(); 
    });

    let selectedContact;

    $('#sendMoneyBtn').hide();

    $('#clientsList').on('click', 'li.list-group-item', function (e) {
        e.preventDefault();

        const index = Number($(this).data('index'));
        selectedContact = contacts[index];

        $('#clientsList li.list-group-item').removeClass('active');
        $(this).addClass('active');

        if(selectedContact){
            $('#sendMoneyBtn').slideDown();
        }
    });

    $('#sendMoneyBtn').on('click', sendM);

    function sendM(){
        const amountN = Number($('#amount').val());

        if (!amountN || amountN <= 0) {
            console.log(amountN)
            $('#resultsSend').html('');
            $('#resultsSend').hide();
            $('#resultsSend').append(`
                <div class="alert alert-danger" role="alert">
                    Ingresa un monto válido
                </div>
            `)
            .slideDown();

            setTimeout(function () {
                $('#resultsSend').slideUp()
            }, 3000);
            return;
        }   

        if(!selectedContact){
            $('#resultsSend').html('');
            $('#resultsSend').hide();
            $('#resultsSend').append(`
                <div class="alert alert-danger" role="alert">
                    Selecciona un contacto
                </div>
            `)
            .slideDown();

            setTimeout(function () {
                $('#resultsSend').slideUp()
            }, 3000);
            return;
        }

        let saldoCurrent = Number(localStorage.getItem("saldo")) || 0;

        const newSaldo = saldoCurrent - amountN;

        if(newSaldo < 0){
            $('#resultsSend').html('');
            $('#resultsSend').hide();
            $('#resultsSend').append(`
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <p>Saldo insuficiente</p>
                </div>
            `)
            .slideDown();
            return;
        }

        localStorage.setItem("saldo", String(newSaldo));
        const trans = { type: `Transferencia a ${selectedContact['name']} ${selectedContact['lastname']}`, value: amountN , use: 'transferencia'};

        if(localStorage.getItem('transactions')){
            const localS = JSON.parse(localStorage.getItem('transactions'));
            localS.push(trans);
            localStorage.setItem('transactions', JSON.stringify(localS));
        }else{
            const currentTrans = [];
            currentTrans.push(trans);
            localStorage.setItem('transactions', JSON.stringify(currentTrans));
        }   

        $('#resultsSend').html('');
        $('#resultsSend').hide();
        $('#resultsSend').append(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <p>Se ha enviado $${amountN} a ${selectedContact.name} ${selectedContact.lastname}</p>
            </div>
        `)
        .slideDown();

        setTimeout(() => {  
            window.location.href = 'menu.html';
        }, 2000);
    }

})