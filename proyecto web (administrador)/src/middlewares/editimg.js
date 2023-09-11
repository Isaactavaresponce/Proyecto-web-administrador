const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/images')
    },
    filename: function (req, file, cb) {
        const id = req.params.id_art;
        req.getConnection((err, conn) => {
            conn.query('SELECT * FROM articulos WHERE id_art = ?', [id], (err, data) => {
                const ida = data[0].id_art;
                console.log(ida)
                cb(null, 'img-' + ida + '.jpg')
                
            })
        })
    }
})

const upload = multer({ storage })

module.exports = upload