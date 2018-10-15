function Enviar() {
    if ($('#txtEmail').val().length > 0 && $('#txtSenha').val().length > 0) {
        $("#divloading").toggle();
    }
}

function VerificaEmail() {
    if ($('#txtEmail').val() == "") {
        bootbox.alert('<div class=\"alert alert-danger text-center\" role=\"alert\"><strong>Informe o email !</strong></div>');
    return false;
    }
    return true
}

function RecuperarSenha() {
    if (VerificaEmail())
    {
        $("#divloading").toggle();
        $.ajax({
            type: 'POST',
            url: '/Home/RecuperarSenha',
            data: { Email: $('#txtEmail').val() },
            dataType: 'json',
            success: function (retorno) {
                $("#divloading").toggle();
                if (retorno > 0) {
                    bootbox.alert('<div class=\"alert alert-danger text-center\" role=\"alert\"><strong>&Oacutetimo , e-mail para redefinir senha enviado !</strong></div>');
                }
                else if (retorno == -1007) {
                    bootbox.alert('<div class=\"alert alert-danger text-center\" role=\"alert\"><strong>Usu&aacuterio n&atildeo encontrado</strong></div>');
                }
            },
            error: function (erro) {
                $("#divloading").toggle();
                bootbox.alert('<div class="alert alert-danger"><strong>Falha ao enviar!</strong></div>');
            }
        });
    }
}

