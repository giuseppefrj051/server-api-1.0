// Custom authorization middleware
function checkPermission(req, res, next) {
    if (req.user && req.user.hasPermissionToUpdate()) {
      return next(); // User is authorized, proceed to the update route
    }
    res.status(403).send('Permission denied');
  }
  
  // Secure the update route with the custom middleware
  app.post('/update', checkPermission, (req, res) => {
    // Handle the update logic here
  });

  /////////////////////////////////////////////////////////////////////

  