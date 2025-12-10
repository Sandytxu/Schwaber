const check= async (req, res) => {

  if (req.session.userID) {

    res.send({ authenticated: true });
  }
  else
  {
    res.send({ authenticated: false });
  }

  }

module.exports = check;