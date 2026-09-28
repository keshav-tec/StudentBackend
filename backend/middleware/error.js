export function notFound(req, res) {

  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });

}


export function errorHandler(err, req, res, next) {

  console.error(err);


  if (err?.code === "LIMIT_FILE_SIZE") {

    return res.status(413).json({
      message: "Uploaded file is too large"
    });

  }


  if (err?.name === "ValidationError") {

    return res.status(400).json({
      message: "Validation failed",

      errors: Object.values(err.errors)
        .map(error => error.message)
    });

  }


  if (err?.code === 11000) {

    return res.status(409).json({
      message: "A record with this unique value already exists"
    });

  }


  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });

}