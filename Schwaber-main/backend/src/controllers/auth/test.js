const test = async (req, res) => {

    res.status(200).json({ status: 'ok', statusBackend: 'ok' });
}

module.exports = test;