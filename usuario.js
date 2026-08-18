function VerificarUsuario() {
    var usu = $("#txt_usu").val();
    var con = $("#txt_con").val();

    if (usu.length == 0 || con.length == 0) {
        return Swal.fire(
            "Mensaje De Advertencia",
            "Llene los campos vacios",
            "warning"
        );
    }
    $.ajax({
        url: "../controlador/usuario/controlador_verificar_usuario.php",
        type: "POST",
        data: {
            user: usu,
            pass: con
        },
    }).done(function (resp) {
        if (resp == 0) {
            Swal.fire(
                "Mensaje De Error",
                "Usuario y/o contrase\u00f1a incorrecta",
                "error"
            );
            $.ajax({
                url: "../controlador/usuario/controlador_intento_usuario.php",
                type: "POST",
                data: {
                    user: usu,
                },
            }).done(function (resp) {
                var data = JSON.parse(resp);
                Swal.fire(
                    "Mensaje De Advertencia",
                    "Usuario y/o contrase\u00f1a incorrecta incorrecta, intentos fallidos --" +
                    (parseInt(resp) + 1) +
                    "-- para acceder a su cuenta restablesca la contrase\u00f1a ",
                    "warning"
                );
            });
        } else {
            var data = JSON.parse(resp);

            if (data[0][5] === "INACTIVO") {
                return Swal.fire(
                    "Mensaje De Advertencia",
                    "Lo sentimos el usuario " +
                    usu +
                    " se encuentra suspendido, comuniquese con el administrador",
                    "warning"
                );
            }
            if (data[0][6] >= 3) {
                return Swal.fire(
                    "Mensaje De Advertencia",
                    "Su cuenta  " +
                    usu +
                    "  esta actualmente bloqueada, para acceder a su cuenta restablesca la contrase\u00f1a ",
                    "warning"
                );
            }
            $.ajax({
                url: "../controlador/usuario/controlador_crear_session.php",
                type: "POST",
                data: {
                    idusuario: data[0][0],
                    user: data[0][1],
                    email: data[0][2],
                    status: data[0][5],
                    rol: data[0][7],
                },
            }).done(function (resp) {
                let timerInterval;
                Swal.fire({
                    title: "BIENVENIDO AL SISTEMA",
                    html: "Usted sera redireccionado en <b></b> milisegundos.",
                    timer: 2000,
                    timerProgressBar: true,
                    onBeforeOpen: () => {
                        Swal.showLoading();
                        timerInterval = setInterval(() => {
                            const content = Swal.getContent();
                            if (content) {
                                const b = content.querySelector("b");
                                if (b) {
                                    b.textContent = Swal.getTimerLeft();
                                }
                            }
                        }, 100);
                    },
                    onClose: () => {
                        clearInterval(timerInterval);
                    },
                }).then((result) => {
                    /* Read more about handling dismissals below */
                    if (result.dismiss === Swal.DismissReason.timer) {
                        location.reload();
                    }
                });
            });
        }
    });
}

function registrar(){
       var usu = $("#txt_usu").val();
    var con = $("#txt_con").val();
}