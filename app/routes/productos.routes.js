module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });

    app.get("/products", (req,res)=>{
        console.log("este es el token:"+req.session.token);
        res.send("exito");
    });
  
  };