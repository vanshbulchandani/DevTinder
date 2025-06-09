const adminAuth = (req, res, next) => {
  console.log("getting checked");
  const token = "xyz";
  const isauthenticated = token === "xyz";
  if (!isauthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = { adminAuth };
