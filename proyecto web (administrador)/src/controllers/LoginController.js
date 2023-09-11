//se importa bcrypt

const bcrypt = require('bcrypt');


//Es la funcion que redirecciona ala carpeta login y al index y si ya se registro redirecciona a la raiz
function index(req, res) {
  if (req.session.loggedin != true) {
    res.render('login/index');
  }else{
    res.redirect('/')
  }
}

// //Es la funcion que redirecciona ala carpeta login y al iniciaSecion //
function iniciaSesion(req, res) {
  if (req.session.loggedin != true) {
    res.render('login/iniciaSesion');
  }else{
    res.redirect('/')
  }
}

// //Es la funcion que redirecciona ala carpeta login y al crearCuenta //
function crearCuenta(req, res) {
  if (req.session.loggedin != true) {
    res.render('login/crearCuenta');
  }else{
    res.redirect('/')
  }
}

// Es la funcion que redirecciona ala carpeta ac y al acerca //
function acerca(req, res) {
    res.render('ac/acerca',  {name: req.session.name, r:'re'})

  }

// Cuando se crea una cuenta con un email ya utilizado no deja continuar //
function storeUser(req, res) {
  const data = req.body;

  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
      if (userdata.length > 0) {
        res.render('login/index', { error: '¡Ya existe el email!' })
      } else {
        bcrypt.hash(data.password, 12).then(hash => {
          data.password = hash;

          req.getConnection((err, conn) => {
            conn.query('INSERT INTO `users` SET ?', [data], (err, rows) => {

              req.session.loggedin = true;
              req.session.name = data.nombre
              req.session.rol = data.rol

              res.redirect('/');
            })
          })
        })
      }
    })
  })

}

// Comprueba que al iniciar sesion el email ingresado exista //
function auth(req, res) {
  const data = req.body;
  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM users WHERE email = ?', [data.email], (err, userdata) => {
      if (userdata.length > 0) {
        userdata.forEach(element => {
          bcrypt.compare(data.password, element.password, (err, isMatch) => {
            if (!isMatch) {
              res.render('login/index', { passwordErrors: '¡Contraseña incorrecta!' })
            } else {
              req.session.loggedin = true;
              req.session.name = element.nombre
              req.session.rol = element.rol

              res.redirect('/')
            }

          });
        })

      } else {
        res.render('login/index', { emailErrors: '¡No existe el email!' })
      }
    })
  })
}

// Sierra las secion iniciada del usuario //
function logout(req, res){
  if (req.session.loggedin == true) {
    req.session.destroy();
    res.redirect('/login');
  }
}


// Enivia las funciones utilizadas //
module.exports = {
  index,
  acerca,
  storeUser,
  auth,
  logout,
  iniciaSesion,
  crearCuenta,
}