function editarStatus(req, res) {
    Sta = req.params.Status;
    req.getConnection((err, conn) => {
        conn.query('SELECT Status FROM encabezado WHERE Folio = ?',[Sta], (err,per) => {
            var old_status = (Sta);
            var new_status = "text";
            console.log(per)
            if (err) {
                console.log(err);
            } else {
            } if(old_status == "o"){
                new_status = 'p';
            }else if(old_status == "p"){
                new_status = 'l';
            }else if(old_status == "l"){
                new_status = ('e');
            }
                if (req.session.loggedin == true) {
                    res.render('pages/editaStatus', { per, name: req.session.name })
                } else {
                    res.redirect('/Pedidos');
                }
            }
        )
    })
}


// Se actualiza la informacion del tipo de articulo editado //
function updateStatus(req, res) {
    const id = req.params.tipo;
    console.log(id);
    const data = req.body;
    console.log(data);
    req.getConnection((err, conn) => {
        conn.query('UPDATE tipo_articulo SET ? WHERE tipo = ?', [data, id], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/tipoArt')
        });
    });
}






function updateStatus(req, res){
    Sta = req.params.Status;
    req.getConnection((err, conn) => {
        conn.query('SELECT Status FROM encabezado WHERE Folio = ?',[Sta], (err,per) => {
            console.log(per);
            var old_status = (Sta);
            var new_status = "text";

            if(old_status == "o"){
                new_status = 'p';
            }else if(old_status == "p"){
                new_status = 'l';
            }else if(old_status == "l"){
                new_status = ('e');
            }

        conn.query('UPDATE encabezado SET Status = ? WHERE Folio = ?',[new_status] , (err,a) => {
                if (err) {
                    console.log(err);
                } else {
                    if (req.session.loggedin == true) {
                        console.log(per)
                        res.render('pages/pedidos', { per, name: req.session.name })
                    } else {
                        res.redirect('/login')
                    }
                }
            })
        })
    })
}