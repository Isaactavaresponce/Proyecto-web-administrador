const express = require('express');
const LoginController = require('../controllers/LoginController');
const adminController = require('../controllers/adminController.js');
const upload = require('../middlewares/subirimg');
const update = require('../middlewares/editimg')

const router = express.Router();

///Son las redirecciones para que funcione el sistema //

// Redirreciones del logincontrollers //
router.get('/login', LoginController.index);
router.get('/iniciaSesion', LoginController.iniciaSesion);
router.get('/crearCuenta', LoginController.crearCuenta);
router.get('/registro', LoginController.auth);
router.get('/acerca', LoginController.acerca);
router.post('/registra', LoginController.storeUser);
router.post('/entrar', LoginController.auth);
router.get('/logout', LoginController.logout);

// Redirreciones del admincontrollers //

router.get('/personal', adminController.tabla);
router.get('/altaPersonal', adminController.personal);
router.post('/registraPer', adminController.registraPerso)
router.get('/editar/:idUser', adminController.editar);
router.get('/elimina/:idUser', adminController.elimina);
router.post('/editar/:idUser', adminController.update);

router.get('/menu', adminController.prod);
router.get('/altaProducto', adminController.productos);
router.post('/registraMen',upload.single('image'), adminController.registraMenu);
router.get('/eliminaMen/:id_art', adminController.eliminaMen);
router.get('/editarMen/:id_art',adminController.editarMen);
router.post('/editarMen/:id_art',update.single('image'), adminController.updateMen);

router.get('/tipoArt', adminController.tipoArt);
router.get('/altaTipo', adminController.articulos);
router.post('/registraTipo', adminController.registraTipo);
router.get('/eliminaArt/:tipo',adminController.eliminaArt)
router.get('/editarTipo/:tipo', adminController.editarTip);


router.post('/editarTipo/:tipo', adminController.updateTip);

router.get('/unidad',adminController.tipoUnd),

router.get('/pedidos', adminController.pedidos);

router.get('/editaStatus/:Folio', adminController.editarStatus);
router.post('/editaStatus/:Folio', adminController.updateStatus);

module.exports = router;