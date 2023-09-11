//esta funcion es para renderizar el pedido ya encontrado en la base de datos si no se encuentra te va a mandar a la pagina del carrito con la leyenda "no se encontro el pedido"
function updateStatus(req, res) {
    const id = req.params.idticket;
    if (id && req.session.email) {
        req.getConnection((err, conn) => {
            conn.query('SELECT a.Folio,a.Fecha,a.correoUsuario,a.id_empleado,a.status,b.Cantidad,b.Precio,c.nombre FROM encabezado a,detalle b,articulos c WHERE a.Folio=b.Folio AND b.Clave_Articulo=c.id_art AND a.Folio = ?', [id], (err, car) => {
                if (err) throw err
                console.log(car);
                if (car.length > 0) {
                    if (car[0].correoUsuario == req.session.email) {
                        let toc = 0
                        let tot = 0
                        car.forEach(element => {
                            element.total = element.Precio * element.Cantidad
                            tot = tot + element.total
                            toc = toc + element.Cantidad
                        });

                        let repeed
                        let estado
                        let estadoo
                        let estadop
                        let estadol
                        let estadoe
                        let largo = 0
                        if (car.length > 0) {
                            largo = car.length - 1
                            estado = car[largo].status
                            repeed = car[largo].Folio
                        }
                        if (estado == 'o') {
                            estadoo = 'o'
                            estadop = null
                            estadol = null
                            estadoe = null
                        } else if (estado == 'p') {
                            estadoo = null
                            estadop = 'p'
                            estadol = null
                            estadoe = null
                        } else if (estado == 'l') {
                            estadoo = null
                            estadop = null
                            estadol = 'l'
                            estadoe = null
                        } else if (estado == 'e') {
                            estadoe = 'e'
                        }

                        const f = car[0].Fecha


                        const fc = f.toString()

                        const fe = fc.slice(0, -33)


                        const lol = 'http://localhost:5000/pedido/' + id
                        res.render('pages/pedido', { name: req.session.name, image: req.session.image, car, totales: tot, url: lol, fecha: fe, estadoo, estadop, estadol, estadoe, redire: repeed });
                    } else {

                        res.redirect('/')
                    }
                } else {
                    res.render('pages/carrito', { errore: 'No tienes nada en tu pedido' })

                }
            })
        })
    } else {
        res.redirect('/')
    }
}

module.exports = {
    updateStatus,
}