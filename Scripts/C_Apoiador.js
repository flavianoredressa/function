var apelidoOk = true;
var emailOk = true;
var SeguirSamuel = false;
var SeguirLuizao = false;

function updateImageDisplay() {
    var curFiles = $("#formulario #arquivoEnviar")[0].files;
    for (var i = 0; i < curFiles.length; i++) {
        document.getElementById("imagemCrop").src = window.URL.createObjectURL(curFiles[i]);
    } 
    
    $('#ModalMessage').modal('show')
    $('#ModalMessage').on('shown.bs.modal', function () {
        $('#imagemCrop').croppie('destroy');
        $('#imagemCrop').croppie({
            enableExif: true,
            viewport: {
                width: 200,
                height: 200,
                type: 'circle'
            },
            boundary: {
                width: 250,
                height: 250
            }
        });
    });
}
function AlteraImg() {

    $('#imagemCrop').croppie('result', {
        type: 'base64',
        size: 'viewport'
    }).then(function (resp) {

        $('#ModalMessage').modal('hide')
        $("#profile").prop("hidden", false);
        $("#labelFoto").prop("hidden", true);
        $("#msgFoto").text("Trocar Foto");
        document.getElementById("imagem").src = resp;
    });
}
File.prototype.convertToBase64 = function (callback) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
        callback(e.target.result, e.target.error);
    };
    reader.readAsDataURL(this);
};
function Salve(Pessoa) {
    $.ajax({
        type: 'POST',
        url: '/Pessoa/Create',
        data: { Pessoa: Pessoa },
        dataType: 'json',
        success: function (retorno) {
            $("#divloading").toggle();
            if (retorno > 0) {
                bootbox.alert('<div class="alert alert-success">&Oacutetimo <strong>' + $("#Nome").val() + '</strong> , por favor confirme  o recebimento do email !</div>', function () { window.location.href = "/Home/Sucesso"; });
            }
            else if (retorno == -1007) {
                bootbox.alert('<div class="alert alert-danger">J&aacute existe um usu&aacuterio com esse apelido!</div>');
            }
        },
        error: function (erro) {
            $("#divloading").toggle();
            bootbox.alert('<div class="alert alert-danger"><strong>Falha ao salvar!</strong></div>');
        }
    });
}
function Seguir() {
    if (!SeguirSamuel && !SeguirLuizao) {
        bootbox.alert('<div class="alert alert-danger">Selecione um candidato para seguir !</div>');
    }
    else
        $("#ModalDeputado").modal('hide');

}
$(document).ready(function () {
    new dgCidadesEstados({
        cidade: document.getElementById('Endereco_Cidade'),
        estado: document.getElementById('Endereco_Estado'),
    })
    bootbox.confirm({
        title: "indica&ccedil;&atilde;o",
        message: "voc&ecirc; foi indicado por um usuario?",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> n&atilde;o'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> sim'
            }
        },
        callback: function (result) {
            if (result) {
                $('#apelido').prop('disabled', false);
                $('#apelido').selectpicker('refresh');
                $("#apelido").focus();
            } else {
                $("#indicacaodiv").prop('hidden', true);
                $("#nome").focus();
            }
            $('#ModalDeputado').modal('show')
        }
    });
    $("#DataNascimento").datepicker({
        format: "dd/mm/yyyy",
        language: "pt-BR"
    });

    $(document).on("keyup", "#Telefone", formatar.Telefone_KeyUp);
    $("#formulario").validate({
        rules: {
            'Apelido': { required: true, minlength: 3, maxlength: 50, verificaAP: true },
            'Email': { required: true, minlength: 3, maxlength: 50, verificaEm: true },
            'DataNascimento': { required: true },
            'Telefone': { required: true },
            'Senha': { required: true, minlength: 3, maxlength: 100 },
            'Nome': { required: true, minlength: 3, maxlength: 150 },
            'Endereco.CEP': { required: true, minlength: 3, maxlength: 100 },
            'Endereco.Logradouro': { required: true, minlength: 3, maxlength: 100 },
            'Endereco.Bairro': { required: true, minlength: 3, maxlength: 100 },
            'Endereco_Cidade': { required: true },
            'Endereco_Estado': { required: true },
            'Indicacao': { required: true }
        },
        messages: {
            'Senha': { valueNotEquals: "!", minlength: "!" },
            'DataNascimento': { required: "!", minlength: "!" },
            'Endereco.CEP': { valueNotEquals: "!", minlength: "!" }
        },
        submitHandler: function (form, e) {
            $("#divloading").toggle();
            e.preventDefault();
            var Pessoa = {
                Apelido: $("#Apelido").val(),
                DataNascimento: $("#DataNascimento").val(),
                Senha: $("#Senha").val(),
                PessoaId: $("#PessoaId").val(),
                Nome: $("#Nome").val(),
                Email: $("#Email").val(),
                Telefone: $("#Telefone").val(),
                SegueSamuel: SeguirSamuel,
                SegueLuiz: SeguirLuizao,
                AcimaId: $("#Indicacao").val(),
                Endereco: {
                    Id: $('#Endereco_Id').val(),
                    CEP: $('#Endereco_CEP').val(),
                    Logradouro: $('#Endereco_Logradouro').val(),
                    Numero: $('#Endereco_Numero').val(),
                    Complemento: $('#Endereco_Complemento').val(),
                    Bairro: $('#Endereco_Bairro').val(),
                    Cidade: $('#Endereco_Cidade').val(),
                    Estado: $('#Endereco_Estado').val(),
                }
            };
            if (document.getElementById("imagem").src != "")
                Pessoa.Imagem = { img: document.getElementById("imagem").src }
            Salve(Pessoa)
        }
    });
    jQuery.validator.addMethod("validaData", function (value, element) {
        var dataAtual = new Date(),
            dia = dataAtual.getDate(),
            mes = dataAtual.getMonth() + 1;
        if (dataAtual.getMonth() + 1 <= 9)
            mes = "0" + mes;
        ano = dataAtual.getFullYear();
        dataAtual = [dia, mes, ano].join('/');
        var data = value;
        var dia = data.substr(0, 2);
        var barra1 = data.substr(2, 1);
        var mes = data.substr(3, 2);
        var barra2 = data.substr(5, 1);
        var ano = data.substr(6, 4);
        data = [dia, mes, ano].join('/');

        if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return false;
        if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return false;
        if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return false;
        if (ano < 1900) return false;
        data = new Date(ano, mes - 1, dia);
        if (data > new Date()) {
            return false;
        }
        return true;
    }, "!")
    jQuery.validator.addMethod("verificaAP", function (value, element) {
        return apelidoOk;
    }, "J&agrave cadastrado!")
    jQuery.validator.addMethod("verificaEm", function (value, element) {
        return emailOk;
    }, "J&agrave cadastrado!")
});
function RemoveEspaco(texto) {
    var t = texto.value;
    $("#Apelido").val(texto.value.replace(/( )+/g, "").toLowerCase())
}
function ValidaApelido() {
    if ($("#Apelido").val().length > 3) {
        $.ajax({
            type: 'POST',
            url: '/Pessoa/VerificaApelido',
            data: { Apelido: $("#Apelido").val() },
            dataType: 'json',
            success: function (retorno) {
                if (retorno) {
                    $("#Apelido").addClass("error");
                    $('#Apelido-error').css('display', '');
                    $("#Apelido-error").text("Já cadastrado");
                    apelidoOk = false;
                }
                else {
                    $('#Apelido-error').css('display', 'none');
                    $("#Apelido").removeClass("error");
                    $("#Apelido-error").text("");
                    apelidoOk = true;
                }
            },
            error: function (erro) {
                bootbox.alert('<div class="alert alert-danger"><strong>Falha ao verificar apelido!</strong></div>');
            }
        });
    }
}
function ValidaEmail() {
    if ($("#Email").val().length > 3) {
        $.ajax({
            type: 'POST',
            url: '/Pessoa/VerificaEmail',
            data: { Email: $("#Email").val() },
            dataType: 'json',
            success: function (retorno) {
                if (retorno) {
                    $("#Email").addClass("error");
                    $('#Email-error').css('display', '');
                    $("#Email-error").text("Já cadastrado");
                    emailOk = false;
                }
                else {
                    $('#Email-error').css('display', 'none');
                    $("#Email").removeClass("error");
                    $("#Email-error").text("");
                    emailOk = true;
                }
            },
            error: function (erro) {
                bootbox.alert('<div class="alert alert-danger"><strong>Falha ao verificar Email!</strong></div>');
            }
        });
    }
}
function Clickseguir(Deputado) {
    var bbtn;
    if (Deputado == 1) {
        btn = $("#btnSamuel");
        if (btn.hasClass('btn-primary')) {
            btn.removeClass('btn-primary');
            btn.addClass('btn-success');
            this.PresentToast('Seguindo Samuel Pinheiro');
            this.SeguirSamuel = true;
        }
        else {
            btn.addClass('btn-primary');
            btn.removeClass('btn-success');
            this.PresentToast('Deixou de seguir Samuel Pinheiro');
            this.SeguirSamuel = false;
        }
    }
    else if (Deputado == 2) {
        btn = $("#btnLuizao");
        if (btn.hasClass('btn-primary')) {
            btn.removeClass('btn-primary');
            btn.addClass('btn-success');
            this.PresentToast('Seguindo Luizão Goulart');
            this.SeguirLuizao = true;
        }
        else {
            btn.addClass('btn-primary');
            btn.removeClass('btn-success');
            this.PresentToast('Deixou de seguir Luizão Goulart');
            this.SeguirLuizao = false;
        }
    }
   
}
function PresentToast(nomeCandidato) {
    var x = document.getElementById("snackbar");
    x.innerHTML = nomeCandidato;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
}