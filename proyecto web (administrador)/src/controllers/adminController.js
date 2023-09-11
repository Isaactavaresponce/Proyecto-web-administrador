// Funciones a las que accede un administrador
const bcrypt = require('bcrypt');



// Funcion que manda a alta personal para registrar un personal //
function personal(req, res) {
    if (req.session.loggedin == true) {
        res.render('pages/altaPersonal', { name: req.session.name });
    } else {
        res.redirect('/')
    }
}

// Muestra todos los datos de la tabla de usuarios //
// En el archivo de personal //
function tabla(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users', (err, per) => {
            if (err) {
                console.log(err);
            } else {
                if (req.session.loggedin == true) {
                    res.render('pages/personal', { per, name: req.session.name })
                } else {
                    res.redirect('/')
                }
            }
        })
    })
}

// Se registran los datos ingresados en la table usuarios //
// Se revisa que los correos ingresados no se encuentren en uso //
function registraPerso(req, res) {
    const data = req.body;

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('pages/altaPersonal', { name: req.session.name, error: 'ya existe el email' })
            } else {
                if (data.password == data.password1) {
                    delete data.password1;
                    bcrypt.hash(data.password, 12).then(hash => {
                        data.password = hash;

                        req.getConnection((err, conn) => {
                            conn.query('INSERT INTO `users` SET ?', [data], (err, rows) => {
                                if (err) throw err
                                res.redirect('/personal');
                            })
                        })
                    })
                } else {
                    res.render('pages/altaPersonal', { name: req.session.name, error: 'No coinciden las contraseñas' })
                }
            }
        })
    })

}

// Se eliminan los datos de un usuario de la tabla de usuarios segun su id // 
function elimina(req, res) {
    id = req.params.idUser;
    console.log(id)
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM users WHERE idUser = ?', [id], (err, rows) => {
            req.getConnection((err, conn) => {
                conn.query('SELECT * FROM users', (err, per) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (req.session.loggedin == true) {
                            res.render('pages/personal', { per, name: req.session.name })
                        } else {
                            res.redirect('/')
                        }
                    }
                })
            })
        });
    })
}

// Se selecciona los datos de un usuario segun su id, para poder modificarlos  // 
function editar(req, res) {
    id = req.params.idUser;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE idUser =?', [id], (err, per) => {
            if (err) {
                console.log(err);
            } else {
                if (req.session.loggedin == true) {
                    res.render('pages/editaPer', { per, name: req.session.name })
                } else {
                    res.redirect('/altaPersonal');
                }
            }
        })
    })
}

function update(req, res) {
    const id = req.params.idUser;
    console.log(id);
    const data = req.body;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM users WHERE email= ?', [data.email], (err, userdata) => {
            if (userdata.length > 0) {
                req.getConnection((err, conn) => {
                    conn.query('SELECT * FROM users WHERE idUser= ? AND email LIKE ?', [id, data.email], (err, userdatas) => {

                        if (userdatas.length > 0) {
                            if (data.password.length > 5) {
                                bcrypt.hash(data.password, 12).then(hash => {
                                    data.password = hash;
                                    console.log(data.password)
                                    req.getConnection((err, conn) => {
                                        conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            res.redirect('/personal')
                                        });
                                    });
                                })
                            } else {
                                delete data.password;
                                console.log('chico');
                                req.getConnection((err, conn) => {
                                    conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                        }
                                        res.redirect('/personal')
                                    });
                                });
                            }
                        } else {
                            req.getConnection((err, conn) => {
                                conn.query('SELECT * FROM users WHERE idUser =?', [id], (err, per) => {
                                    res.render('pages/editaPer', { name: req.session.name, error: 'ya existe el email', per })
                                })
                            })
                        }

                    })
                })
            } else {
                if (data.password.length > 5) {
                    bcrypt.hash(data.password, 12).then(hash => {
                        data.password = hash;
                        console.log(data.password)
                        req.getConnection((err, conn) => {
                            conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                                if (err) {
                                    console.log(err);
                                }
                                res.redirect('/personal')
                            });
                        });
                    })
                } else {
                    delete data.password;
                    console.log('chico');
                    req.getConnection((err, conn) => {
                        conn.query('UPDATE users SET ? WHERE idUser = ?', [data, id], (err, rows) => {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect('/personal')
                        });
                    });
                }
            }
        })
    })
}

//Menu//

// Funcion que manda al archivo producto //
function productos(req, res) {
    if (req.session.loggedin == true) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM tipo_articulo', (err, per) => {

                req.getConnection((err, conn) => {
                    conn.query(' SELECT * FROM tipo_unidad', (err, uni) => {

                        res.render('pages/altaProducto', { name: req.session.name, per, uni });

                    }
                    )
                })
            })
        })
    } else {
        res.redirect('/')
    }
}

// Muestra la informacon que se encuentra en la tabla de articulos //
// En el archivo de menu //
function prod(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM articulos', (err, per) => {
            if (err) {
                console.log(err);
            } else {
                if (req.session.loggedin == true) {
                    res.render('pages/menu', { per, name: req.session.name })
                } else {
                    res.redirect('/')
                }

            }
        })
    })
}

// Se registra un nuevo articulo en la tabla de articulos //
// Se rivisa que no se ingrese un tipo de articulo que no exista //
// Se checha que no se vuelva a registrar un articulo existente //
function registraMenu(req, res) {
    const data = req.body;
    if (req.file){
        data.image = 'http://localhost:4000/images/' + req.file.filename

    req.getConnection((err, conn) => {
        conn.query('select * from tipo_articulo where tipo = ?', [data.tipo], (err, tp) => {
            if (tp.length > 0) {

                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO `articulos` SET ?', [data], (err, rows) => {
                        res.redirect('/menu');
                    })
                })
            } else {
                res.render('pages/altaProducto', { name: req.session.name, error: 'No existe el tipo de articulo' })
            }
        })
    })
    }else{
        data.image = '/images/producto_ejemplo.jpg'

    req.getConnection((err, conn) => {
        conn.query('select * from tipo_articulo where tipo = ?', [data.tipo], (err, tp) => {
            if (tp.length > 0) {

                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO `articulos` SET ?', [data], (err, rows) => {
                        res.redirect('/menu');
                    })
                })
            } else {
                res.render('pages/altaProducto', { name: req.session.name, error: 'No existe el tipo de articulo' })
            }
        })
    })
    }

}

// Se busca el articulo por su id, para borrar toda la informacion de este de la tabla //
function eliminaMen(req, res) {
    id = req.params.id_art;
    console.log(id)
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM articulos WHERE id_art = ?', [id], (err, rows) => {
            req.getConnection((err, conn) => {
                conn.query('SELECT * FROM articulos', (err, per) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (req.session.loggedin == true) {
                            res.render('pages/menu', { per, name: req.session.name })
                        } else {
                            res.redirect('/')
                        }
                    }
                })
            })
        });
    })
}

// Se edita la informacion de un articulo segun su id //
function editarMen(req, res) {
    id = req.params.id_art;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM articulos a, tipo_unidad b,tipo_articulo c WHERE id_art =? and a.tipo = c.tipo and a.unidad=b.unidad', [id], (err, per) => {
            if (err) {
                console.log(err);
            } else {

                req.getConnection((err, conn) => {
                    conn.query('SELECT * FROM tipo_articulo', (err, tip) => {

                        req.getConnection((err, conn) => {
                            conn.query(' SELECT * FROM tipo_unidad', (err, uni) => {

                                if (req.session.loggedin == true) {
                                    res.render('pages/editaMenu', { per, name: req.session.name, tip, uni })
                                } else {
                                    res.redirect('/altaProducto');
                                }
                            }
                            )
                        })
                    }
                    )
                })
            }
        })
    })
}


// Se actualiza la informacion del articulo editado //
function updateMen(req, res) {
    const id = req.params.id_art;
    const data = req.body;
    console.log(data)
    console.log(req.file)
    if (req.file){
        data.image = 'http://localhost:4000/images/' + req.file.filename
    req.getConnection((err, conn) => {
        conn.query('UPDATE articulos SET ? WHERE id_art = ?', [data, id], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/menu')
        });
    });
    }else{
        delete data.image
    req.getConnection((err, conn) => {
        conn.query('UPDATE articulos SET ? WHERE id_art = ?', [data, id], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/menu')
        });
    });
    }
}

//Tipo articulos//

// Funcion que manda a alta personal para registrar un nuevo tipo //
function articulos(req, res) {
    if (req.session.loggedin == true) {
        res.render('pages/altaTipo', { name: req.session.name });
    } else {
        res.redirect('/')
    }
}

// Muestra la informacon que se encuentra en la tabla de articulos //
// En el archivo de tipoart //
function tipoArt(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tipo_articulo', (err, per) => {
            if (err) {
                console.log(err);
            } else {
                if (req.session.loggedin == true) {
                    console.log(per)
                    res.render('pages/tipoArt', { per, name: req.session.name })
                } else {
                    res.redirect('/')
                }
            }
        })
    })
}

// Se registra un nuevo tipo articulo en la tabla de articulos //
// Se rivisa que no se ingrese un tipo de articulo que ya existente //
function registraTipo(req, res) {
    const data = req.body;
    console.log(data)

    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tipo_articulo WHERE tipo = ?', [data.tipo_articulo], (err, userdata) => {
            if (userdata.length > 0) {
                res.render('pages/altaTipo', { name: req.session.name, error: 'ya existe el tipo de producto' })
            } else {
                req.getConnection((err, conn) => {
                    conn.query('INSERT INTO `tipo_articulo` SET ?', [data], (err, rows) => {
                        res.redirect('/tipoArt');
                    })
                })
            }
        })
    })

}

// Edita el tipo de articulo seleccionado  //
function editarTip(req, res) {
    id = req.params.tipo;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tipo_articulo WHERE tipo =?', [id], (err, per) => {
            console.log(per)
            if (err) {
                console.log(err);
            } else {
                if (req.session.loggedin == true) {
                    res.render('pages/editaTipo', { per, name: req.session.name })
                } else {
                    res.redirect('/altaTipo');
                }
            }
        })
    })
}

// Se actualiza la informacion del tipo de articulo editado //
function updateTip(req, res) {
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

// Se elimina el tipo de articulo sellecionado //
function eliminaArt(req, res) {
    id = req.params.tipo;
    console.log(id)
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM tipo_articulo WHERE tipo = ?', [id], (err, rows) => {
            req.getConnection((err, conn) => {
                conn.query('SELECT * FROM tipo_articulo', (err, per) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (req.session.loggedin == true) {
                            res.render('pages/tipoArt', { per, name: req.session.name })
                        } else {
                            res.redirect('/')
                        }
                    }
                })
            })
        });
    })
}

// Unidad //

function unidad(req, res) {
    if (req.session.loggedin == true) {
        req.getConnection((err, conn) => {
            conn.query(' SELECT * FROM tipo_unidad', (err, per) => {
                res.render('pages/altaProducto', { name: req.session.name, per });
            })
        })
    } else {
        res.render('/')
    }
}

function pedidos(req, res) {
    if (req.session.loggedin == true) {
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM encabezado a, detalle b, articulos c WHERE a.Folio = b.Folio and b.Clave_Articulo = c.id_art ORDER BY b.Folio', (err, per) => {
                per.forEach(element => {
                    const f= element.Fecha

            
                    const fc = f.toString()

                    const fe = fc.slice(0,-33)

                    element.Fecha = fe
                });
                console.log(per);
               // res.send(per)
                res.render('pages/pedidos', { name: req.session.name,per });
            })
     
    
        })
    } else {
        res.redirect('/')
}
}

// Muestra la informacon que se encuentra en la tabla de articulos //
// En el archivo de tipoart //
function tipoUnd(req, res) {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM tipo_unidad', (err, per) => {
            if (err) {
                console.log(err);
            } else {
                if (req.session.loggedin == true) {
                    console.log(per)
                    res.render('pages/unidad', { per, name: req.session.name })
                } else {
                    res.redirect('/')
                }
            }
        })
    })
    
}

function editarStatus(req, res) {
    Sta = req.params.Status;
    req.getConnection((err, conn) => {
        conn.query('SELECT Status FROM encabezado WHERE Folio = ?',[Sta], (err,per) => {
            var old_status = (Sta);
            const new_status = "text";
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
                    res.redirect('/pedidos');
                }
            }
        )
    })
}


function updateStatus(req, res) {
    const id = req.params.Folio;
    console.log(id);
    const data = req.body;
    console.log(data);
    req.getConnection((err, conn) => {
        conn.query('UPDATE Status SET ? WHERE Folio = ?', [data, id], (err, rows) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/pedidos')
        });
    });
}

// Enivia las funciones utilizadas //
module.exports = {
    personal,
    tabla,
    editar,
    update,
    elimina,
    registraPerso,
    registraMenu,
    prod,
    productos,
    eliminaMen,
    editarMen,
    updateMen,
    articulos,
    tipoArt,
    registraTipo,
    editarTip,
    updateTip,
    eliminaArt,
    unidad,
    tipoUnd,
    pedidos,
    updateStatus,
    editarStatus,

}