function updateImageDisplay() {
    var curFiles = $("#formulario #arquivoEnviar")[0].files;
    for (var i = 0; i < curFiles.length; i++) {
        document.getElementById("imagem").src = window.URL.createObjectURL(curFiles[i]);;
    }
    $("#imagem").prop("hidden", false);
}
File.prototype.convertToBase64 = function (callback) {
    var reader = new FileReader();
    reader.onloadend = function (e) {
        callback(e.target.result, e.target.error);
    };
    reader.readAsDataURL(this);
};
$(document).ready(function () {
    $("#formulario").validate({
        rules: {
            'Titulo': { required: true, minlength: 3, maxlength: 150 },
            'Conteudo': { required: true, minlength: 3, maxlength: 500 },
        },
        messages: {},
        submitHandler: function (form, e) {
            e.preventDefault();
            var noticia = {
                Titulo: $("#Titulo").val(),
                Conteudo: $("#Conteudo").val(),
                NoticiaId: $("#NoticiaId").val(),
            };
            $("#divloading").toggle();
            var selectedFile = $("#formulario #arquivoEnviar")[0].files[0];
            if (selectedFile != null) {
                selectedFile.convertToBase64(function (base64) {
                    var img = base64;
                    noticia.Imagem = { img: img }
                    $.ajax({
                        type: 'POST',
                        url: '/Noticia/Create',
                        data: { Noticia: noticia },
                        dataType: 'json',
                        success: function (retorno) {
                            $("#divloading").toggle();
                            if (retorno > 0) {
                                bootbox.alert('<div class="alert alert-success">Noticia salva <strong>' + $("#Titulo").val() + '</strong> com sucesso</div>', function () { location.reload(); });
                            }
                            else
                                bootbox.alert('<div class="alert alert-danger">Erro ao salvar! <strong>' + $("#Titulo").val() + '</strong> !</div>');
                        },
                        error: function (erro) {
                            $("#divloading").toggle();
                            bootbox.alert('<div class="alert alert-danger"><strong>Falha ao salvar!</strong></div>');
                        }
                    });
                })
            }
            else {
                $("#divloading").toggle();
                bootbox.alert('<div class="alert alert-danger"><strong>Selecione uma imagem!</strong></div>');
            }
        }
    });
});

