const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/public/images')
    },
    filename: function (req, file, cb) {
        req.getConnection((err,conn) =>{
            conn.query('SELECT * FROM articulos', (err,data)=>{
                const long = data.length - 1
                const ida = data[long].id_art + 1
                cb(null, 'img-' + ida + '.jpg')
            })
        })
    }
  })
  
  const upload = multer({storage })

  module.exports = upload